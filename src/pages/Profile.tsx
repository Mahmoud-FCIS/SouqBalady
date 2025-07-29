import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { User, Save, Edit3, MapPin, Phone, Mail, Building, CreditCard, Lock, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { updatePassword } from "firebase/auth";

const Profile = () => {
  const { userProfile, saveUserProfile, profileLoading, currentUser } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [formData, setFormData] = useState({
    name: "",
    nationalId: "",
    country: "",
    governorate: "",
    region: "",
    address: "",
    phone: "",
    shopName: "",
    shopAddress: "",
    companyName: "",
    companyAddress: "",
    taxNumber: "",
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || "",
        nationalId: userProfile.nationalId || "",
        country: userProfile.country || "",
        governorate: userProfile.governorate || "",
        region: userProfile.region || "",
        address: userProfile.address || "",
        phone: userProfile.phone || "",
        shopName: userProfile.shopName || "",
        shopAddress: userProfile.shopAddress || "",
        companyName: userProfile.companyName || "",
        companyAddress: userProfile.companyAddress || "",
        taxNumber: userProfile.taxNumber || "",
      });
    }
  }, [userProfile]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      await saveUserProfile(formData);
      setIsEditing(false);
      toast({
        title: "تم بنجاح",
        description: "تم حفظ التغييرات بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ التغييرات",
        variant: "destructive",
      });
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "خطأ",
        description: "كلمة المرور الجديدة غير متطابقة",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "خطأ",
        description: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
        variant: "destructive",
      });
      return;
    }

    try {
      if (currentUser) {
        await updatePassword(currentUser, passwordData.newPassword);
        setIsChangingPassword(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        toast({
          title: "تم بنجاح",
          description: "تم تغيير كلمة المرور بنجاح",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تغيير كلمة المرور",
        variant: "destructive",
      });
    }
  };

  const getUserTypeLabel = (userType: string) => {
    switch (userType) {
      case "farmer": return "مزارع";
      case "trader": return "تاجر";
      case "factory": return "شركة مجمدات";
      default: return userType;
    }
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-6">
            <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">لم يتم العثور على الملف الشخصي</h3>
            <p className="text-muted-foreground">يرجى تسجيل الدخول مرة أخرى</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="shadow-xl border-0 bg-card/95 backdrop-blur">
            <CardHeader className="text-center pb-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-right">الملف الشخصي</CardTitle>
                  <p className="text-muted-foreground text-right">
                    {getUserTypeLabel(userProfile.userType)}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-center gap-3 flex-wrap">
                {!isEditing && !isChangingPassword ? (
                  <>
                    <Button 
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      className="gap-2"
                    >
                      <Edit3 className="h-4 w-4" />
                      تعديل البيانات
                    </Button>
                    <Button 
                      onClick={() => setIsChangingPassword(true)}
                      variant="outline"
                      className="gap-2"
                    >
                      <Lock className="h-4 w-4" />
                      تغيير كلمة المرور
                    </Button>
                  </>
                ) : isEditing ? (
                  <div className="flex gap-3">
                    <Button 
                      onClick={handleSave}
                      className="gap-2"
                    >
                      <Save className="h-4 w-4" />
                      حفظ التغييرات
                    </Button>
                    <Button 
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          name: userProfile.name || "",
                          nationalId: userProfile.nationalId || "",
                          country: userProfile.country || "",
                          governorate: userProfile.governorate || "",
                          region: userProfile.region || "",
                          address: userProfile.address || "",
                          phone: userProfile.phone || "",
                          shopName: userProfile.shopName || "",
                          shopAddress: userProfile.shopAddress || "",
                          companyName: userProfile.companyName || "",
                          companyAddress: userProfile.companyAddress || "",
                          taxNumber: userProfile.taxNumber || "",
                        });
                      }}
                      variant="outline"
                    >
                      إلغاء
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <Button 
                      onClick={handlePasswordChange}
                      className="gap-2"
                    >
                      <Save className="h-4 w-4" />
                      حفظ كلمة المرور
                    </Button>
                    <Button 
                      onClick={() => {
                        setIsChangingPassword(false);
                        setPasswordData({
                          currentPassword: "",
                          newPassword: "",
                          confirmPassword: "",
                        });
                      }}
                      variant="outline"
                    >
                      إلغاء
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Password Change Section */}
              {isChangingPassword && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Lock className="h-5 w-5 text-primary" />
                    تغيير كلمة المرور
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="newPassword">كلمة المرور الجديدة</Label>
                      <div className="relative">
                        <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData(prev => ({
                            ...prev,
                            newPassword: e.target.value
                          }))}
                          className="pr-10 pl-10"
                          placeholder="كلمة المرور الجديدة"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
                      <div className="relative">
                        <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData(prev => ({
                            ...prev,
                            confirmPassword: e.target.value
                          }))}
                          className="pr-10 pl-10"
                          placeholder="تأكيد كلمة المرور"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!isChangingPassword && (
                <>
                  {/* Basic Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      المعلومات الأساسية
                    </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <div className="relative">
                      <Mail className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        value={userProfile.email}
                        disabled
                        className="pr-10 bg-muted/50"
                      />
                    </div>
                  </div>

                  {userProfile.userType === "factory" ? (
                    <div>
                      <Label htmlFor="companyName">اسم الشركة</Label>
                      <Input
                        id="companyName"
                        value={formData.companyName}
                        onChange={(e) => handleInputChange("companyName", e.target.value)}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-muted/50" : ""}
                      />
                    </div>
                  ) : (
                    <div>
                      <Label htmlFor="name">الاسم بالكامل</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-muted/50" : ""}
                      />
                    </div>
                  )}

                  {userProfile.userType !== "factory" && (
                    <div>
                      <Label htmlFor="nationalId">الرقم القومي</Label>
                      <Input
                        id="nationalId"
                        value={formData.nationalId}
                        onChange={(e) => handleInputChange("nationalId", e.target.value)}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-muted/50" : ""}
                      />
                    </div>
                  )}

                  <div>
                    <Label htmlFor="phone">رقم الهاتف</Label>
                    <div className="relative">
                      <Phone className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        disabled={!isEditing}
                        className={`pr-10 ${!isEditing ? "bg-muted/50" : ""}`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Location Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  معلومات الموقع
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="country">البلد</Label>
                    <Select 
                      value={formData.country} 
                      onValueChange={(value) => handleInputChange("country", value)}
                      disabled={!isEditing}
                    >
                      <SelectTrigger className={!isEditing ? "bg-muted/50" : ""}>
                        <SelectValue placeholder="اختر البلد" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="egypt">مصر</SelectItem>
                        <SelectItem value="saudi">السعودية</SelectItem>
                        <SelectItem value="uae">الإمارات</SelectItem>
                        <SelectItem value="jordan">الأردن</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="governorate">المحافظة</Label>
                    <Select 
                      value={formData.governorate} 
                      onValueChange={(value) => handleInputChange("governorate", value)}
                      disabled={!isEditing}
                    >
                      <SelectTrigger className={!isEditing ? "bg-muted/50" : ""}>
                        <SelectValue placeholder="اختر المحافظة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cairo">القاهرة</SelectItem>
                        <SelectItem value="giza">الجيزة</SelectItem>
                        <SelectItem value="alexandria">الإسكندرية</SelectItem>
                        <SelectItem value="beheira">البحيرة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="region">المنطقة</Label>
                    <Select 
                      value={formData.region} 
                      onValueChange={(value) => handleInputChange("region", value)}
                      disabled={!isEditing}
                    >
                      <SelectTrigger className={!isEditing ? "bg-muted/50" : ""}>
                        <SelectValue placeholder="اختر المنطقة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nasr-city">مدينة نصر</SelectItem>
                        <SelectItem value="heliopolis">مصر الجديدة</SelectItem>
                        <SelectItem value="maadi">المعادي</SelectItem>
                        <SelectItem value="zamalek">الزمالك</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mt-4">
                  <Label htmlFor="address">العنوان بالتفصيل</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-muted/50" : ""}
                  />
                </div>
              </div>

              {/* Business Information */}
              {(userProfile.userType === "trader" || userProfile.userType === "factory") && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Building className="h-5 w-5 text-primary" />
                      معلومات العمل
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {userProfile.userType === "trader" && (
                        <>
                          <div>
                            <Label htmlFor="shopName">اسم المحل</Label>
                            <Input
                              id="shopName"
                              value={formData.shopName}
                              onChange={(e) => handleInputChange("shopName", e.target.value)}
                              disabled={!isEditing}
                              className={!isEditing ? "bg-muted/50" : ""}
                            />
                          </div>
                          <div>
                            <Label htmlFor="shopAddress">عنوان المحل</Label>
                            <Input
                              id="shopAddress"
                              value={formData.shopAddress}
                              onChange={(e) => handleInputChange("shopAddress", e.target.value)}
                              disabled={!isEditing}
                              className={!isEditing ? "bg-muted/50" : ""}
                            />
                          </div>
                        </>
                      )}

                      {userProfile.userType === "factory" && (
                        <div>
                          <Label htmlFor="companyAddress">عنوان الشركة</Label>
                          <Input
                            id="companyAddress"
                            value={formData.companyAddress}
                            onChange={(e) => handleInputChange("companyAddress", e.target.value)}
                            disabled={!isEditing}
                            className={!isEditing ? "bg-muted/50" : ""}
                          />
                        </div>
                      )}

                      <div>
                        <Label htmlFor="taxNumber">الرقم الضريبي</Label>
                        <div className="relative">
                          <CreditCard className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="taxNumber"
                            value={formData.taxNumber}
                            onChange={(e) => handleInputChange("taxNumber", e.target.value)}
                            disabled={!isEditing}
                            className={`pr-10 ${!isEditing ? "bg-muted/50" : ""}`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;