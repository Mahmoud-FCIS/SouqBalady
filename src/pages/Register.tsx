import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, UserType } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Upload, User, Store, Factory } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { countries, egyptGovernorates, regions } from "@/lib/database-utils";

const userTypeSchema = z.object({
  userType: z.enum(["farmer", "trader", "factory"] as const),
});

const farmerSchema = z.object({
  name: z.string().min(2, "الاسم بالكامل مطلوب"),
  nationalId: z.string().min(14, "الرقم القومي يجب أن يكون 14 رقم").max(14, "الرقم القومي يجب أن يكون 14 رقم"),
  country: z.string().min(1, "البلد مطلوب"),
  governorate: z.string().min(1, "المحافظة مطلوبة"),
  region: z.string().min(1, "المنطقة مطلوبة"),
  address: z.string().min(10, "العنوان بالتفصيل مطلوب (10 أحرف على الأقل)"),
  phone: z.string().min(11, "رقم الهاتف مطلوب (11 رقم على الأقل)"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
  agreeToTerms: z.boolean().refine(val => val === true, "يجب الموافقة على الشروط والأحكام"),
});

const traderSchema = z.object({
  name: z.string().min(2, "الاسم بالكامل مطلوب"),
  nationalId: z.string().min(14, "الرقم القومي يجب أن يكون 14 رقم").max(14, "الرقم القومي يجب أن يكون 14 رقم"),
  country: z.string().min(1, "البلد مطلوب"),
  governorate: z.string().min(1, "المحافظة مطلوبة"),
  region: z.string().min(1, "المنطقة مطلوبة"),
  address: z.string().min(10, "العنوان بالكامل مطلوب"),
  shopName: z.string().min(2, "اسم المحل مطلوب"),
  shopAddress: z.string().min(1, "عنوان المحل مطلوب"),
  taxNumber: z.string().min(5, "الرقم الضريبي مطلوب"),
  phone: z.string().min(11, "رقم الهاتف مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
  agreeToTerms: z.boolean().refine(val => val === true, "يجب الموافقة على الشروط والأحكام"),
});

const factorySchema = z.object({
  companyName: z.string().min(3, "اسم الشركة مطلوب (3 أحرف على الأقل)"),
  companyAddress: z.string().min(1, "عنوان الشركة مطلوب"),
  taxNumber: z.string().min(5, "الرقم الضريبي مطلوب"),
  country: z.string().min(1, "البلد مطلوب"),
  governorate: z.string().min(1, "المحافظة مطلوبة"),
  region: z.string().min(1, "المنطقة مطلوبة"),
  phone: z.string().min(11, "رقم الهاتف مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
  agreeToTerms: z.boolean().refine(val => val === true, "يجب الموافقة على الشروط والأحكام"),
});

const Register = () => {
  const [step, setStep] = useState(1);
  const [selectedUserType, setSelectedUserType] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(false);
  const { register, saveUserProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const userTypeForm = useForm<z.infer<typeof userTypeSchema>>({
    resolver: zodResolver(userTypeSchema),
  });

  const getFormSchema = () => {
    switch (selectedUserType) {
      case "farmer":
        return farmerSchema;
      case "trader":
        return traderSchema;
      case "factory":
        return factorySchema;
      default:
        return farmerSchema;
    }
  };

  const detailsForm = useForm({
    resolver: zodResolver(getFormSchema()),
  });

  const handleUserTypeSubmit = (data: z.infer<typeof userTypeSchema>) => {
    setSelectedUserType(data.userType);
    setStep(2);
  };

  const handleDetailsSubmit = async (data: any) => {
    if (!selectedUserType) return;
    if (!data.agreeToTerms) {
      toast({
        title: "خطأ",
        description: "يجب الموافقة على الشروط والأحكام أولاً",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    try {
      toast({
        title: "جاري إنشاء الحساب...",
        description: "يرجى الانتظار قليلاً",
      });

      // Prepare profile data without password
      const { password, agreeToTerms, ...profileData } = data;
      
      // Register user with complete profile data
      await register(data.email, password, selectedUserType, {
        ...profileData,
        userType: selectedUserType,
      });

      toast({
        title: "تم إنشاء الحساب بنجاح!",
        description: "يمكنك الآن تسجيل الدخول باستخدام بياناتك",
      });

      navigate("/login");
    } catch (error: any) {
      console.error("Registration error:", error);
      
      let errorMessage = "حدث خطأ أثناء إنشاء الحساب، يرجى المحاولة مرة أخرى";
      
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "البريد الإلكتروني مستخدم بالفعل، يرجى استخدام بريد إلكتروني آخر";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "كلمة المرور ضعيفة جدًا، يرجى اختيار كلمة مرور أقوى";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "البريد الإلكتروني غير صحيح";
      } else if (error.code === "permission-denied") {
        errorMessage = "لا توجد صلاحية لإنشاء الحساب، يرجى المحاولة لاحقاً";
      } else if (error.code === "network-error") {
        errorMessage = "تحقق من اتصال الإنترنت وحاول مرة أخرى";
      }
      
      toast({
        title: "فشل في إنشاء الحساب",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const UserTypeCard = ({ type, icon: Icon, title, description }: {
    type: UserType;
    icon: any;
    title: string;
    description: string;
  }) => (
    <Card 
      className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
        selectedUserType === type ? "ring-2 ring-primary shadow-lg bg-primary/10" : "hover:border-primary/50"
      }`}
      onClick={() => userTypeForm.setValue("userType", type)}
    >
      <CardContent className="flex flex-col items-center p-6">
        <Icon className="h-16 w-16 text-primary mb-4" />
        <h3 className="text-lg font-semibold text-center">{title}</h3>
        <p className="text-sm text-muted-foreground text-center mt-2">{description}</p>
      </CardContent>
    </Card>
  );

  if (step === 1) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 py-12">
          <div className="container max-w-4xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-primary mb-4">إنشاء حساب جديد</h1>
              <p className="text-muted-foreground">اختر نوع حسابك للبدء</p>
            </div>

            <Form {...userTypeForm}>
              <form onSubmit={userTypeForm.handleSubmit(handleUserTypeSubmit)} className="space-y-8">
                <FormField
                  control={userTypeForm.control}
                  name="userType"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid md:grid-cols-3 gap-6">
                        <UserTypeCard
                          type="farmer"
                          icon={User}
                          title="مزارع"
                          description="بيع المنتجات الطازجة مباشرة من المزرعة"
                        />
                        <UserTypeCard
                          type="trader"
                          icon={Store}
                          title="تاجر"
                          description="شراء وتوزيع المنتجات الزراعية"
                        />
                        <UserTypeCard
                          type="factory"
                          icon={Factory}
                          title="شركة مجمدات"
                          description="معالجة وتجميد المنتجات الزراعية"
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-center">
                  <Button type="submit" size="lg" className="px-12">
                    متابعة
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 py-12">
        <div className="container max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-4">إكمال بيانات التسجيل</h1>
            <p className="text-muted-foreground">
              {selectedUserType === "farmer" && "بيانات المزارع"}
              {selectedUserType === "trader" && "بيانات التاجر"}
              {selectedUserType === "factory" && "بيانات شركة المجمدات"}
            </p>
          </div>

          <Card>
            <CardContent className="p-6">
              <Form {...detailsForm}>
                <form onSubmit={detailsForm.handleSubmit(handleDetailsSubmit)} className="space-y-6">
                  {selectedUserType === "farmer" && (
                    <>
                      <FormField
                        control={detailsForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>الاسم بالكامل</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={detailsForm.control}
                        name="nationalId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>الرقم القومي</FormLabel>
                            <FormControl>
                              <Input {...field} maxLength={14} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="space-y-4">
                        <Label>صورة البطاقة (وجه وظهر)</Label>
                        <div className="grid grid-cols-2 gap-4">
                          <Button variant="outline" className="h-24 flex-col">
                            <Upload className="h-6 w-6 mb-2" />
                            وجه البطاقة
                          </Button>
                          <Button variant="outline" className="h-24 flex-col">
                            <Upload className="h-6 w-6 mb-2" />
                            ظهر البطاقة
                          </Button>
                        </div>
                      </div>
                    </>
                  )}

                  {selectedUserType === "trader" && (
                    <>
                      <FormField
                        control={detailsForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>الاسم بالكامل</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={detailsForm.control}
                        name="nationalId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>الرقم القومي</FormLabel>
                            <FormControl>
                              <Input {...field} maxLength={14} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="space-y-4">
                        <Label>صورة البطاقة (وجه وظهر)</Label>
                        <div className="grid grid-cols-2 gap-4">
                          <Button variant="outline" className="h-24 flex-col">
                            <Upload className="h-6 w-6 mb-2" />
                            وجه البطاقة
                          </Button>
                          <Button variant="outline" className="h-24 flex-col">
                            <Upload className="h-6 w-6 mb-2" />
                            ظهر البطاقة
                          </Button>
                        </div>
                      </div>

                      <FormField
                        control={detailsForm.control}
                        name="shopName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>اسم المحل</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={detailsForm.control}
                        name="shopAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>عنوان المحل</FormLabel>
                            <FormControl>
                              <Select onValueChange={field.onChange} value={field.value}>
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
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={detailsForm.control}
                        name="taxNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>الرقم الضريبي</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  {selectedUserType === "factory" && (
                    <>
                      <FormField
                        control={detailsForm.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>اسم الشركة</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={detailsForm.control}
                        name="companyAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>عنوان الشركة</FormLabel>
                            <FormControl>
                              <Select onValueChange={field.onChange} value={field.value}>
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
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={detailsForm.control}
                        name="taxNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>الرقم الضريبي</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="space-y-4">
                        <Label>صورة السجل التجاري</Label>
                        <Button variant="outline" className="h-24 w-full flex-col">
                          <Upload className="h-6 w-6 mb-2" />
                          رفع السجل التجاري
                        </Button>
                      </div>
                    </>
                  )}

                  {(selectedUserType === "farmer" || selectedUserType === "trader" || selectedUserType === "factory") && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={detailsForm.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>البلد</FormLabel>
                              <FormControl>
                                <Select onValueChange={field.onChange} value={field.value}>
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
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={detailsForm.control}
                          name="governorate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>المحافظة</FormLabel>
                              <FormControl>
                                <Select onValueChange={field.onChange} value={field.value}>
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
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={detailsForm.control}
                          name="region"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>المنطقة</FormLabel>
                              <FormControl>
                                <Select onValueChange={field.onChange} value={field.value}>
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
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {(selectedUserType === "farmer" || selectedUserType === "trader") && (
                        <FormField
                          control={detailsForm.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>العنوان بالتفصيل</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      <FormField
                        control={detailsForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>رقم الهاتف</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={detailsForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>البريد الإلكتروني</FormLabel>
                            <FormControl>
                              <Input {...field} type="email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={detailsForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>كلمة المرور</FormLabel>
                            <FormControl>
                              <Input {...field} type="password" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={detailsForm.control}
                        name="agreeToTerms"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                أوافق على{" "}
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="link" className="p-0 h-auto text-primary">
                                      الشروط والأحكام
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                    <DialogHeader>
                                      <DialogTitle>الشروط والأحكام</DialogTitle>
                                      <DialogDescription>
                                        يرجى قراءة الشروط والأحكام بعناية قبل الموافقة
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 text-sm">
                                      <p>
                                        <strong>1. القبول بالشروط:</strong> باستخدام منصة "سوق بلدي"، فإنك توافق على الالتزام بهذه الشروط والأحكام.
                                      </p>
                                      <p>
                                        <strong>2. استخدام المنصة:</strong> يجب استخدام المنصة لأغراض تجارية مشروعة فقط وعدم انتهاك أي قوانين محلية أو دولية.
                                      </p>
                                      <p>
                                        <strong>3. المسؤولية:</strong> المنصة تعمل كوسيط بين المزارعين والتجار، وليست مسؤولة عن جودة المنتجات أو العمليات التجارية.
                                      </p>
                                      <p>
                                        <strong>4. الخصوصية:</strong> نحن ملتزمون بحماية خصوصيتك وبياناتك الشخصية وفقاً لسياسة الخصوصية الخاصة بنا.
                                      </p>
                                      <p>
                                        <strong>5. التعديل:</strong> نحتفظ بالحق في تعديل هذه الشروط في أي وقت مع إشعار مسبق.
                                      </p>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </FormLabel>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        className="w-full" 
                        size="lg"
                        disabled={loading || !detailsForm.watch("agreeToTerms")}
                      >
                        {loading ? "جاري إنشاء الحساب..." : "إنشاء الحساب"}
                      </Button>
                    </>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Register;