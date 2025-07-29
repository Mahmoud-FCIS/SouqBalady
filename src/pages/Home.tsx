import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, ShoppingCart, BarChart3, Package, Clock, CheckCircle, TrendingUp, Activity } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
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
  status: "active" | "completed" | "in_progress";
  deliveryLocation: string;
  deliveryDate: string;
  createdAt: string;
}

interface Stats {
  new: number;
  completed: number;
  inProgress: number;
}

interface PriceData {
  productName: string;
  averagePrice: number;
  count: number;
  unit: "kg" | "ton";
}

const Home = () => {
  const { userProfile, currentUser } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats>({ new: 0, completed: 0, inProgress: 0 });
  const [buyRequests, setBuyRequests] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [selectedProductType, setSelectedProductType] = useState<"vegetables" | "fruits">("vegetables");
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [showAllPrices, setShowAllPrices] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser && userProfile) {
      fetchDashboardData();
      fetchPriceData();
    }
  }, [currentUser, userProfile]);

  useEffect(() => {
    fetchPriceData();
  }, [selectedProductType]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      if (userProfile?.userType === "farmer") {
        const farmersOrdersQuery = query(
          collection(db, "sellOrders"),
          where("userId", "==", currentUser?.uid),
          orderBy("createdAt", "desc"),
          limit(5)
        );
        const farmersOrdersSnapshot = await getDocs(farmersOrdersQuery);
        const farmersOrders = farmersOrdersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Order[];

        const allFarmersOrdersQuery = query(
          collection(db, "sellOrders"),
          where("userId", "==", currentUser?.uid)
        );
        const allFarmersOrdersSnapshot = await getDocs(allFarmersOrdersQuery);
        const allOrders = allFarmersOrdersSnapshot.docs.map(doc => doc.data());
        
        const newOrders = allOrders.filter(order => order.status === "active").length;
        const completedOrders = allOrders.filter(order => order.status === "completed").length;
        const inProgressOrders = allOrders.filter(order => order.status === "in_progress").length;

        const buyRequestsQuery = query(
          collection(db, "buyRequests"),
          where("status", "==", "active"),
          orderBy("createdAt", "desc"),
          limit(5)
        );
        const buyRequestsSnapshot = await getDocs(buyRequestsQuery);
        const buyRequestsData = buyRequestsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Order[];

        setOrders(farmersOrders);
        setBuyRequests(buyRequestsData);
        setStats({ new: newOrders, completed: completedOrders, inProgress: inProgressOrders });
      } else {
        const userRequestsQuery = query(
          collection(db, "buyRequests"),
          where("userId", "==", currentUser?.uid),
          orderBy("createdAt", "desc"),
          limit(5)
        );
        const userRequestsSnapshot = await getDocs(userRequestsQuery);
        const userRequests = userRequestsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Order[];

        const allUserRequestsQuery = query(
          collection(db, "buyRequests"),
          where("userId", "==", currentUser?.uid)
        );
        const allUserRequestsSnapshot = await getDocs(allUserRequestsQuery);
        const allRequests = allUserRequestsSnapshot.docs.map(doc => doc.data());
        
        const newRequests = allRequests.filter(req => req.status === "active").length;
        const completedRequests = allRequests.filter(req => req.status === "completed").length;
        const inProgressRequests = allRequests.filter(req => req.status === "in_progress").length;

        const farmerSellOrdersQuery = query(
          collection(db, "sellOrders"),
          where("status", "==", "active"),
          orderBy("createdAt", "desc"),
          limit(5)
        );
        const farmerSellOrdersSnapshot = await getDocs(farmerSellOrdersQuery);
        const farmerSellOrders = farmerSellOrdersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Order[];

        setOrders(userRequests);
        setBuyRequests(farmerSellOrders);
        setStats({ new: newRequests, completed: completedRequests, inProgress: inProgressRequests });
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPriceData = async () => {
    try {
      // Get today's date in UTC at 00:00:00
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);
      const startOfToday = today.toISOString();
      
      const ordersQuery = query(
        collection(db, "sellOrders"),
        where("productType", "==", selectedProductType),
        where("status", "==", "active"),
        where("createdAt", ">=", startOfToday) // Only today's orders
      );
      
      const ordersSnapshot = await getDocs(ordersQuery);
      const ordersData = ordersSnapshot.docs.map(doc => doc.data() as Order);

      const priceMap = new Map<string, { totalPrice: number; count: number; unit: "kg" | "ton" }>();
      
      ordersData.forEach(order => {
        const productName = order.productName;
        const price = order.pricePerUnit;
        const unit = order.unit;
        
        if (priceMap.has(productName)) {
          const existing = priceMap.get(productName)!;
          priceMap.set(productName, {
            totalPrice: existing.totalPrice + price,
            count: existing.count + 1,
            unit: existing.unit
          });
        } else {
          priceMap.set(productName, { 
            totalPrice: price, 
            count: 1,
            unit
          });
        }
      });

      const prices: PriceData[] = Array.from(priceMap.entries()).map(([productName, data]) => ({
        productName,
        averagePrice: Math.round(data.totalPrice / data.count),
        count: data.count,
        unit: data.unit
      })).sort((a, b) => b.count - a.count);

      setPriceData(prices);
    } catch (error) {
      console.error("Error fetching price data:", error);
    }
  };

  const getArabicUnit = (unit: "kg" | "ton") => {
    return unit === "kg" ? "كيلو" : "طن";
  };

  const SliderImages = [
    "/api/placeholder/800/300",
    "/api/placeholder/800/300",
    "/api/placeholder/800/300"
  ];

  const StatCard = ({ icon: Icon, title, value, color }: {
    icon: any;
    title: string;
    value: number;
    color: string;
  }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className={`p-3 rounded-full ${color} mr-4`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const OrderCard = ({ order }: { order: Order }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-medium">{order.productName}</h4>
          <Badge variant={order.status === "active" ? "default" : order.status === "completed" ? "secondary" : "outline"}>
            {order.status === "active" ? "نشط" : order.status === "completed" ? "مكتمل" : "قيد التنفيذ"}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-2">
          {order.quantity} {getArabicUnit(order.unit)} - {order.pricePerUnit} جنيه
        </p>
        {order.userName && (
          <p className="text-sm text-muted-foreground">
            بواسطة: {order.userName}
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-2">
          {new Date(order.createdAt).toLocaleDateString('ar-EG')}
        </p>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="text-center">جاري تحميل البيانات...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
        <section className="py-8">
          <div className="container">
            <Carousel className="w-full max-w-5xl mx-auto">
              <CarouselContent>
                {SliderImages.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="relative h-64 md:h-80 bg-gradient-to-r from-primary to-secondary rounded-lg overflow-hidden">
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="absolute inset-0 flex items-center justify-center text-white">
                        <div className="text-center">
                          <h2 className="text-3xl font-bold mb-4">مرحباً بك في سوق بلدي</h2>
                          <p className="text-lg">منصتك المفضلة للتجارة الزراعية</p>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </section>

        <div className="container py-8">
          <section className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  متوسط أسعار المنتجات اليوم
                </CardTitle>
                <CardDescription>
                  الأسعار محسوبة من عروض المزارعين اليوم فقط
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-4">
                  <Select value={selectedProductType} onValueChange={(value: "vegetables" | "fruits") => setSelectedProductType(value)}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vegetables">خضار</SelectItem>
                      <SelectItem value="fruits">فاكهة</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="اختر المنتج" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع المنتجات</SelectItem>
                      {priceData.map((item) => (
                        <SelectItem key={item.productName} value={item.productName}>
                          {item.productName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button 
                    variant="outline" 
                    onClick={() => setShowAllPrices(!showAllPrices)}
                  >
                    {showAllPrices ? "إخفاء الجدول" : "عرض الكل"}
                  </Button>
                </div>

                {selectedProduct && selectedProduct !== "all" && !showAllPrices && (
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2">{selectedProduct}</h3>
                    <p className="text-2xl font-bold text-primary">
                      {priceData.find(p => p.productName === selectedProduct)?.averagePrice || 0} جنيه / 
                      {getArabicUnit(priceData.find(p => p.productName === selectedProduct)?.unit || 'kg')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      محسوب من {priceData.find(p => p.productName === selectedProduct)?.count || 0} عرض
                    </p>
                  </div>
                )}

                {showAllPrices && (
                  <div className="mt-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>اسم المنتج</TableHead>
                          <TableHead>متوسط السعر</TableHead>
                          <TableHead>الوحدة</TableHead>
                          <TableHead>عدد العروض</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {priceData.map((item) => (
                          <TableRow key={item.productName}>
                            <TableCell className="font-medium">{item.productName}</TableCell>
                            <TableCell className="text-primary font-semibold">
                              {item.averagePrice} جنيه
                            </TableCell>
                            <TableCell>{getArabicUnit(item.unit)}</TableCell>
                            <TableCell>{item.count}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {priceData.length === 0 && (
                      <div className="text-center py-4 text-muted-foreground">
                        لا توجد بيانات أسعار متاحة لليوم الحالي
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </section>

          {userProfile?.userType === "farmer" ? (
            <>
              <div className="mb-8">
                <Button 
                  size="lg" 
                  onClick={() => navigate("/sell-product")}
                  className="w-full md:w-auto"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  عرض منتج للبيع
                </Button>
              </div>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-6">إحصائيات الطلبات</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <StatCard
                    icon={Clock}
                    title="الطلبات الجديدة"
                    value={stats.new}
                    color="bg-primary"
                  />
                  <StatCard
                    icon={TrendingUp}
                    title="قيد التنفيذ"
                    value={stats.inProgress}
                    color="bg-secondary"
                  />
                  <StatCard
                    icon={CheckCircle}
                    title="المكتملة"
                    value={stats.completed}
                    color="bg-tertiary"
                  />
                </div>
              </section>

              <section className="mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">طلباتي الأخيرة</h2>
                  <Button variant="outline" onClick={() => navigate("/orders")}>
                    عرض الكل
                  </Button>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {orders.length === 0 ? (
                    <Card className="col-span-full">
                      <CardContent className="text-center py-8">
                        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p>لا توجد طلبات حالياً</p>
                      </CardContent>
                    </Card>
                  ) : (
                    orders.map(order => <OrderCard key={order.id} order={order} />)
                  )}
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-6">آخر طلبات الشراء</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {buyRequests.length === 0 ? (
                    <Card className="col-span-full">
                      <CardContent className="text-center py-8">
                        <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p>لا توجد طلبات شراء جديدة</p>
                      </CardContent>
                    </Card>
                  ) : (
                    buyRequests.map(request => <OrderCard key={request.id} order={request} />)
                  )}
                </div>
              </section>
            </>
          ) : (
            <>
              <div className="mb-8">
                <Button 
                  size="lg" 
                  onClick={() => navigate("/buy-product")}
                  className="w-full md:w-auto"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  طلب منتج للشراء
                </Button>
              </div>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-6">إحصائيات الطلبيات</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <StatCard
                    icon={Clock}
                    title="الطلبيات الجديدة"
                    value={stats.new}
                    color="bg-primary"
                  />
                  <StatCard
                    icon={TrendingUp}
                    title="قيد التنفيذ"
                    value={stats.inProgress}
                    color="bg-secondary"
                  />
                  <StatCard
                    icon={CheckCircle}
                    title="المكتملة"
                    value={stats.completed}
                    color="bg-tertiary"
                  />
                </div>
              </section>

              <section className="mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">طلبياتي الأخيرة</h2>
                  <Button variant="outline" onClick={() => navigate("/orders")}>
                    عرض الكل
                  </Button>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {orders.length === 0 ? (
                    <Card className="col-span-full">
                      <CardContent className="text-center py-8">
                        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p>لا توجد طلبيات حالياً</p>
                      </CardContent>
                    </Card>
                  ) : (
                    orders.map(order => <OrderCard key={order.id} order={order} />)
                  )}
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-6">آخر عروض المزارعين</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {buyRequests.length === 0 ? (
                    <Card className="col-span-full">
                      <CardContent className="text-center py-8">
                        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p>لا توجد عروض حالياً</p>
                      </CardContent>
                    </Card>
                  ) : (
                    buyRequests.map(request => <OrderCard key={request.id} order={request} />)
                  )}
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Home;