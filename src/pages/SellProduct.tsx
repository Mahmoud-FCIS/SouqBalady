import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { createSellOrder, vegetables, fruits } from "@/lib/database-utils";
import { v4 as uuidv4 } from 'uuid';

const schema = z.object({
  productType: z.enum(["vegetables", "fruits"]),
  productName: z.string().min(1, "اسم المنتج مطلوب"),
  quantity: z.string().min(1, "الكمية مطلوبة"),
  unit: z.enum(["kg", "ton"]),
  pricePerUnit: z.string().min(1, "السعر مطلوب"),
  deliveryLocation: z.string().min(1, "مكان التسليم مطلوب"),
  deliveryDate: z.string().min(1, "تاريخ التسليم مطلوب"),
});

const SellProduct = () => {
  const { currentUser, userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const watchProductType = form.watch("productType");

  const handleSubmit = async (data: z.infer<typeof schema>) => {
    if (!currentUser || !userProfile) {
      toast({
        title: "خطأ",
        description: "يجب تسجيل الدخول أولاً",
        variant: "destructive",
      });
      return;
    }

    if (userProfile.userType !== "farmer") {
      toast({
        title: "خطأ",
        description: "هذه الخدمة متاحة للمزارعين فقط",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const sellId = uuidv4(); // Generate unique ID for the sell order
      
      const orderData = {
        sellId, // Add the generated sellId to the order data
        userId: currentUser.uid,
        userName: userProfile.name || "مزارع",
        userType: userProfile.userType as "farmer",
        productType: data.productType,
        productName: data.productName,
        quantity: parseFloat(data.quantity),
        unit: data.unit,
        pricePerUnit: parseFloat(data.pricePerUnit),
        deliveryLocation: data.deliveryLocation,
        deliveryDate: data.deliveryDate,
        status: "active" as const,
        createdAt: new Date().toISOString(), // Add creation timestamp
      };

      const createdOrder = await createSellOrder(orderData);

      toast({
        title: "تم بنجاح",
        description: `تم عرض المنتج للبيع بنجاح! رقم الطلب: ${sellId}`,
      });

      form.reset();
      navigate("/orders");
    } catch (error) {
      console.error("Error creating sell order:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء عرض المنتج للبيع",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 py-12">
        <div className="container max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">عرض منتج للبيع</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="productType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>نوع المنتج</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر نوع المنتج" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="vegetables">خضار</SelectItem>
                              <SelectItem value="fruits">فاكهة</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="productName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>اسم المنتج</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر المنتج" />
                            </SelectTrigger>
                            <SelectContent>
                              {(watchProductType === "vegetables" ? vegetables : fruits).map((product) => (
                                <SelectItem key={product} value={product}>
                                  {product}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الكمية المتاحة</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" step="0.1" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="unit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الوحدة</FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder="اختر الوحدة" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="kg">كيلو</SelectItem>
                                <SelectItem value="ton">طن</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="pricePerUnit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>السعر (جنيه مصري)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" step="0.01" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="deliveryLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>مكان التسليم</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="deliveryDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>تاريخ التسليم</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? "جاري النشر..." : "عرض المنتج للبيع"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default SellProduct;