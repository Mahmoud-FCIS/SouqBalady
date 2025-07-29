import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ShoppingCart, Package, MapPin, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import Layout from "@/components/layout/Layout";
import { createBuyRequest, vegetables, fruits, countries, egyptGovernorates, regions } from "@/lib/database-utils";
import { v4 as uuidv4 } from 'uuid';

const BuyProduct = () => {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [productType, setProductType] = useState<"vegetables" | "fruits" | "">("");
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [price, setPriceValue] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [deliveryDate, setDeliveryDate] = useState<Date>();
  const [country, setCountry] = useState("");
  const [governorate, setGovernorate] = useState("");
  const [region, setRegion] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser || !userProfile) {
      toast({
        title: "خطأ",
        description: "يجب تسجيل الدخول أولاً",
        variant: "destructive",
      });
      return;
    }

    if (userProfile.userType === "farmer") {
      toast({
        title: "خطأ",
        description: "هذه الخدمة متاحة للتجار وشركات المجمدات فقط",
        variant: "destructive",
      });
      return;
    }

    if (!productType || !productName || !quantity || !unit || !price || !deliveryLocation || !deliveryDate) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const buyId = uuidv4(); // Generate unique ID for the buy request
      
      const requestData = {
        buyId, // Add the generated buyId to the request data
        userId: currentUser.uid,
        userType: userProfile.userType as "trader" | "factory",
        userName: userProfile.name || userProfile.companyName || "غير محدد",
        productType,
        productName,
        quantity: parseFloat(quantity),
        unit: unit as "kg" | "ton",
        pricePerUnit: parseFloat(price),
        deliveryLocation,
        deliveryDate: format(deliveryDate, "yyyy-MM-dd"),
        country,
        governorate,
        region,
        status: "active" as const,
        createdAt: new Date().toISOString(),
      };

      const createdRequest = await createBuyRequest(requestData);

      toast({
        title: "تم بنجاح",
        description: `تم إرسال طلب الشراء بنجاح! رقم الطلب: ${buyId}`,
      });

      // Reset form
      setProductType("");
      setProductName("");
      setQuantity("");
      setUnit("");
      setPriceValue("");
      setDeliveryLocation("");
      setDeliveryDate(undefined);
      setCountry("");
      setGovernorate("");
      setRegion("");

      navigate("/orders");
    } catch (error) {
      console.error("Error creating buy request:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إرسال طلب الشراء",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    navigate("/login");
    return null;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="backdrop-blur-sm bg-background/95 shadow-xl border-primary/20">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <ShoppingCart className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-3xl font-bold text-primary">
                    طلب منتج للشراء
                  </CardTitle>
                </div>
                <p className="text-muted-foreground">
                  اطلب المنتجات التي تحتاجها من المزارعين مباشرة
                </p>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* نوع المنتج */}
                  <div className="space-y-2">
                    <Label className="text-base font-semibold flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      نوع المنتج
                    </Label>
                    <Select value={productType} onValueChange={(value: "vegetables" | "fruits") => {
                      setProductType(value);
                      setProductName("");
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر نوع المنتج" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vegetables">خضار</SelectItem>
                        <SelectItem value="fruits">فاكهة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* اسم المنتج */}
                  {productType && (
                    <div className="space-y-2">
                      <Label className="text-base font-semibold">اسم المنتج</Label>
                      <Select value={productName} onValueChange={setProductName}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر المنتج" />
                        </SelectTrigger>
                        <SelectContent>
                          {(productType === "vegetables" ? vegetables : fruits).map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* الكمية والوحدة */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-base font-semibold">الكمية المطلوبة</Label>
                      <Input
                        type="number"
                        placeholder="أدخل الكمية"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="text-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-base font-semibold">الوحدة</Label>
                      <Select value={unit} onValueChange={setUnit}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الوحدة" />
                        </SelectTrigger>
                         <SelectContent>
                           <SelectItem value="kg">كيلو</SelectItem>
                           <SelectItem value="ton">طن</SelectItem>
                         </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* السعر */}
                  <div className="space-y-2">
                    <Label className="text-base font-semibold flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      السعر المطلوب (جنيه مصري لكل {unit || "وحدة"})
                    </Label>
                    <Input
                      type="number"
                      placeholder="أدخل السعر"
                      value={price}
                      onChange={(e) => setPriceValue(e.target.value)}
                      className="text-lg"
                    />
                  </div>

                  {/* الموقع */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-base font-semibold">البلد</Label>
                      <Select value={country} onValueChange={setCountry}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر البلد" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country} value={country}>
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-base font-semibold">المحافظة</Label>
                      <Select value={governorate} onValueChange={setGovernorate}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر المحافظة" />
                        </SelectTrigger>
                        <SelectContent>
                          {egyptGovernorates.map((gov) => (
                            <SelectItem key={gov} value={gov}>
                              {gov}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-base font-semibold">المنطقة</Label>
                      <Select value={region} onValueChange={setRegion}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر المنطقة" />
                        </SelectTrigger>
                        <SelectContent>
                          {regions.map((region) => (
                            <SelectItem key={region} value={region}>
                              {region}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* مكان التسليم */}
                  <div className="space-y-2">
                    <Label className="text-base font-semibold flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      مكان التسليم بالتفصيل
                    </Label>
                    <Input
                      placeholder="أدخل عنوان التسليم بالتفصيل"
                      value={deliveryLocation}
                      onChange={(e) => setDeliveryLocation(e.target.value)}
                      className="text-lg"
                    />
                  </div>

                  {/* تاريخ التسليم */}
                  <div className="space-y-2">
                    <Label className="text-base font-semibold flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      تاريخ التسليم المطلوب
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal text-lg",
                            !deliveryDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="ml-2 h-4 w-4" />
                          {deliveryDate ? (
                            format(deliveryDate, "PPP", { locale: ar })
                          ) : (
                            <span>اختر تاريخ التسليم</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={deliveryDate}
                          onSelect={setDeliveryDate}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full py-6 text-lg"
                    disabled={loading}
                  >
                    {loading ? "جاري الإرسال..." : "إرسال طلب الشراء"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BuyProduct;