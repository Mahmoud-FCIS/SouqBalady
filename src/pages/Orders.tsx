import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, DollarSign, MessageCircle, Plus, ShoppingCart } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface Order {
  id: string;
  userId: string;
  userName?: string;
  userType: "farmer" | "trader" | "factory";
  productType: "vegetables" | "fruits";
  productName: string;
  quantity: number;
  unit: "kg" | "ton";
  pricePerUnit: number;
  deliveryLocation: string;
  deliveryDate: string;
  status: "active" | "completed" | "in_progress";
  createdAt: string;
  offers?: Array<{
    id: string;
    userId: string;
    userName: string;
    userType: string;
    quantity: number;
    price: number;
    deliveryDate: string;
    deliveryLocation: string;
    status: "pending" | "accepted" | "rejected";
  }>;
}

const Orders = () => {
  const { currentUser, userProfile } = useAuth();
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [traderRequests, setTraderRequests] = useState<Order[]>([]);
  const [factoryRequests, setFactoryRequests] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [offerData, setOfferData] = useState({
    quantity: "",
    price: "",
    deliveryDate: "",
    deliveryLocation: "",
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser && userProfile) {
      fetchOrders();
    }
  }, [currentUser, userProfile]);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      if (!currentUser || !userProfile) return;

      // Common function to fetch orders
      const fetchCollection = async (collectionName: string, constraints: any[]) => {
        const q = query(collection(db, collectionName), ...constraints);
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Order[];
      };

      if (userProfile.userType === "farmer") {
        // Fetch farmer's own sell orders
        const myOrdersData = await fetchCollection("sellOrders", [
          where("userId", "==", currentUser.uid)
        ]);
        setMyOrders(myOrdersData);

        // Fetch active trader buy requests
        const traderRequestsData = await fetchCollection("buyRequests", [
          where("userType", "==", "trader"),
          where("status", "==", "active")
        ]);
        setTraderRequests(traderRequestsData);

        // Fetch active factory buy requests
        const factoryRequestsData = await fetchCollection("buyRequests", [
          where("userType", "==", "factory"),
          where("status", "==", "active")
        ]);
        setFactoryRequests(factoryRequestsData);
      } else {
        // For traders and factories
        // Fetch their own buy requests
        const myBuyRequestsData = await fetchCollection("buyRequests", [
          where("userId", "==", currentUser.uid)
        ]);
        setMyOrders(myBuyRequestsData);

        // Fetch active sell orders from farmers
        const farmerSellOrdersData = await fetchCollection("sellOrders", [
          where("status", "==", "active")
        ]);
        setTraderRequests(farmerSellOrdersData);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء جلب الطلبات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitOffer = async () => {
    if (!selectedOrder || !currentUser || !userProfile) return;

    if (!offerData.quantity || !offerData.price || !offerData.deliveryDate || !offerData.deliveryLocation) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع البيانات المطلوبة",
        variant: "destructive",
      });
      return;
    }

    try {
      const offer = {
        id: Date.now().toString(),
        userId: currentUser.uid,
        userName: userProfile.name || userProfile.companyName || "مستخدم",
        userType: userProfile.userType,
        quantity: parseFloat(offerData.quantity),
        price: parseFloat(offerData.price),
        deliveryDate: offerData.deliveryDate,
        deliveryLocation: offerData.deliveryLocation,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      const collectionName = selectedOrder.userType === "farmer" ? "sellOrders" : "buyRequests";
      const orderRef = doc(db, collectionName, selectedOrder.id);
      const currentOffers = selectedOrder.offers || [];
      
      await updateDoc(orderRef, {
        offers: [...currentOffers, offer]
      });

      toast({
        title: "تم بنجاح",
        description: "تم تقديم العرض بنجاح",
      });

      setOfferData({
        quantity: "",
        price: "",
        deliveryDate: "",
        deliveryLocation: "",
      });
      
      fetchOrders();
    } catch (error) {
      console.error("Error submitting offer:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تقديم العرض",
        variant: "destructive",
      });
    }
  };

  const handleOfferResponse = async (orderId: string, offerId: string, status: "accepted" | "rejected", orderType: "orders" | "buy_requests") => {
    try {
      const orderRef = doc(db, orderType, orderId);
      const order = [...myOrders, ...traderRequests, ...factoryRequests].find(o => o.id === orderId);
      
      if (order?.offers) {
        const updatedOffers = order.offers.map(offer => 
          offer.id === offerId ? { ...offer, status } : offer
        );
        
        await updateDoc(orderRef, { 
          offers: updatedOffers,
          ...(status === "accepted" && { status: "in_progress" })
        });
        
        toast({
          title: "تم بنجاح",
          description: status === "accepted" ? "تم قبول العرض وبدء التنفيذ" : "تم رفض العرض",
        });
        
        fetchOrders();
      }
    } catch (error) {
      console.error("Error updating offer:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث العرض",
        variant: "destructive",
      });
    }
  };

  const handleStartChat = (otherUserId: string) => {
    navigate(`/messages?userId=${otherUserId}`);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: "نشط", variant: "default" as const },
      completed: { label: "مكتمل", variant: "secondary" as const },
      in_progress: { label: "قيد التنفيذ", variant: "outline" as const },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const OrderCard = ({ order, showOfferButton = false, orderType = "orders" }: { 
    order: Order; 
    showOfferButton?: boolean; 
    orderType?: "orders" | "buy_requests" 
  }) => (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{order.productName}</CardTitle>
            <CardDescription>
              {order.userName && `بواسطة: ${order.userName}`}
            </CardDescription>
          </div>
          {getStatusBadge(order.status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <Label>النوع</Label>
            <p>{order.productType === "vegetables" ? "خضار" : "فاكهة"}</p>
          </div>
          <div>
            <Label>الكمية</Label>
            <p>{order.quantity} {order.unit === "kg" ? "كيلو" : "طن"}</p>
          </div>
          <div>
            <Label>السعر</Label>
            <p>{order.pricePerUnit} جنيه لكل {order.unit === "kg" ? "كيلو" : "طن"}</p>
          </div>
          <div>
            <Label>مكان التسليم</Label>
            <p>{order.deliveryLocation}</p>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                عرض التفاصيل
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>تفاصيل الطلب</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>نوع المنتج</Label>
                  <p>{order.productType === "vegetables" ? "خضار" : "فاكهة"}</p>
                </div>
                <div>
                  <Label>اسم المنتج</Label>
                  <p>{order.productName}</p>
                </div>
                <div>
                  <Label>الكمية</Label>
                  <p>{order.quantity} {order.unit === "kg" ? "كيلو" : "طن"}</p>
                </div>
                <div>
                  <Label>السعر لكل وحدة</Label>
                  <p>{order.pricePerUnit} جنيه</p>
                </div>
                <div>
                  <Label>مكان التسليم</Label>
                  <p>{order.deliveryLocation}</p>
                </div>
                <div>
                  <Label>تاريخ التسليم</Label>
                  <p>{new Date(order.deliveryDate).toLocaleDateString('ar-EG')}</p>
                </div>
                <div>
                  <Label>تاريخ الإنشاء</Label>
                  <p>{new Date(order.createdAt).toLocaleDateString('ar-EG')}</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {userProfile?.userType === "farmer" && order.offers && order.offers.length > 0 && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <DollarSign className="h-4 w-4 mr-2" />
                  عرض العروض ({order.offers.length})
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>العروض المقدمة</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {order.offers.map((offer) => (
                    <Card key={offer.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-medium">{offer.userName}</h4>
                            <p className="text-sm text-muted-foreground">
                              {offer.userType === "trader" ? "تاجر" : "شركة مجمدات"}
                            </p>
                          </div>
                          <Badge variant={offer.status === "accepted" ? "default" : offer.status === "rejected" ? "destructive" : "outline"}>
                            {offer.status === "pending" ? "قيد المراجعة" : 
                             offer.status === "accepted" ? "مقبول" : "مرفوض"}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <Label>الكمية</Label>
                            <p>{offer.quantity} {order.unit === "kg" ? "كيلو" : "طن"}</p>
                          </div>
                          <div>
                            <Label>السعر المقترح</Label>
                            <p>{offer.price} جنيه</p>
                          </div>
                          <div>
                            <Label>تاريخ التسليم</Label>
                            <p>{new Date(offer.deliveryDate).toLocaleDateString('ar-EG')}</p>
                          </div>
                          <div>
                            <Label>مكان التسليم</Label>
                            <p>{offer.deliveryLocation}</p>
                          </div>
                        </div>
                        {offer.status === "pending" && (
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              onClick={() => handleOfferResponse(order.id, offer.id, "accepted", orderType)}
                            >
                              قبول العرض
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleOfferResponse(order.id, offer.id, "rejected", orderType)}
                            >
                              رفض العرض
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleStartChat(offer.userId)}
                            >
                              <MessageCircle className="h-4 w-4 mr-2" />
                              مناقشة العرض
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          )}

          {showOfferButton && (
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" onClick={() => setSelectedOrder(order)}>
                  <DollarSign className="h-4 w-4 mr-2" />
                  تقديم عرض سعر
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>تقديم عرض سعر</DialogTitle>
                  <DialogDescription>
                    تقديم عرضك لشراء {order.productName}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>الكمية المطلوبة</Label>
                    <Input
                      type="number"
                      value={offerData.quantity}
                      onChange={(e) => setOfferData({...offerData, quantity: e.target.value})}
                      placeholder={`الكمية بالـ${order.unit === "kg" ? "كيلو" : "طن"}`}
                    />
                  </div>
                  <div>
                    <Label>السعر المقترح (جنيه مصري)</Label>
                    <Input
                      type="number"
                      value={offerData.price}
                      onChange={(e) => setOfferData({...offerData, price: e.target.value})}
                      placeholder="السعر لكل وحدة"
                    />
                  </div>
                  <div>
                    <Label>تاريخ التسليم</Label>
                    <Input
                      type="date"
                      value={offerData.deliveryDate}
                      onChange={(e) => setOfferData({...offerData, deliveryDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>مكان التسليم</Label>
                    <Input
                      value={offerData.deliveryLocation}
                      onChange={(e) => setOfferData({...offerData, deliveryLocation: e.target.value})}
                      placeholder="مكان التسليم"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSubmitOffer} className="flex-1">
                      تقديم العرض
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleStartChat(order.userId)}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      محادثة
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="text-center">جاري تحميل الطلبات...</div>
        </div>
      </Layout>
    );
  }

  if (userProfile?.userType === "farmer") {
    return (
      <Layout>
        <div className="container py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">إدارة الطلبات</h1>
            <Button onClick={() => navigate("/sell-product")}>
              <Plus className="h-4 w-4 mr-2" />
              عرض منتج للبيع
            </Button>
          </div>

          <Tabs defaultValue="my-orders" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="my-orders">طلباتي ({myOrders.length})</TabsTrigger>
              <TabsTrigger value="trader-requests">طلبات التجار ({traderRequests.length})</TabsTrigger>
              <TabsTrigger value="factory-requests">طلبات المصانع ({factoryRequests.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="my-orders">
              <div className="space-y-4">
                {myOrders.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <p>لا توجد طلبات حالياً</p>
                    </CardContent>
                  </Card>
                ) : (
                  myOrders.map(order => <OrderCard key={order.id} order={order} orderType="orders" />)
                )}
              </div>
            </TabsContent>

            <TabsContent value="trader-requests">
              <div className="space-y-4">
                {traderRequests.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <p>لا توجد طلبات من التجار حالياً</p>
                    </CardContent>
                  </Card>
                ) : (
                  traderRequests.map(request => 
                    <OrderCard 
                      key={request.id} 
                      order={request} 
                      showOfferButton 
                      orderType="buy_requests"
                    />
                  )
                )}
              </div>
            </TabsContent>

            <TabsContent value="factory-requests">
              <div className="space-y-4">
                {factoryRequests.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <p>لا توجد طلبات من المصانع حالياً</p>
                    </CardContent>
                  </Card>
                ) : (
                  factoryRequests.map(request => 
                    <OrderCard 
                      key={request.id} 
                      order={request} 
                      showOfferButton 
                      orderType="buy_requests"
                    />
                  )
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">إدارة الطلبات</h1>
          <Button onClick={() => navigate("/buy-product")}>
            <ShoppingCart className="h-4 w-4 mr-2" />
            طلب منتج للشراء
          </Button>
        </div>

        <Tabs defaultValue="my-orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="my-orders">طلباتي ({myOrders.length})</TabsTrigger>
            <TabsTrigger value="farmer-requests">طلبات المزارعين ({traderRequests.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="my-orders">
            <div className="space-y-4">
              {myOrders.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <p>لا توجد طلبات حالياً</p>
                  </CardContent>
                </Card>
              ) : (
                myOrders.map(order => <OrderCard key={order.id} order={order} orderType="buy_requests" />)
              )}
            </div>
          </TabsContent>

          <TabsContent value="farmer-requests">
            <div className="space-y-4">
              {traderRequests.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <p>لا توجد طلبات من المزارعين حالياً</p>
                  </CardContent>
                </Card>
              ) : (
                traderRequests.map(request => 
                  <OrderCard 
                    key={request.id} 
                    order={request} 
                    showOfferButton 
                    orderType="orders"
                  />
                )
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Orders;