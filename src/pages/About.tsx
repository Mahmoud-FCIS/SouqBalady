import React from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, Users, Target, Heart, Shield, Award } from "lucide-react";

const About = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
        {/* Hero Section */}
        <section className="py-20 text-center">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
                عن سوق بلدي
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                منصة رقمية رائدة تهدف إلى ربط المزارعين مباشرة بالتجار ومصانع المجمدات،
                لضمان وصول المنتجات الطازجة بأفضل الأسعار وأعلى جودة.
              </p>
            </div>
          </div>
        </section>

        {/* Vision & Mission Section */}
        <section className="py-16">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors">
                <CardHeader className="text-center">
                  <Target className="h-16 w-16 text-primary mx-auto mb-4" />
                  <CardTitle className="text-2xl">رؤيتنا</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground leading-relaxed">
                    أن نكون المنصة الأولى في المنطقة العربية لربط المزارعين بالتجار،
                    ونساهم في تطوير القطاع الزراعي وتحسين دخل المزارعين وضمان وصول 
                    المنتجات الطازجة للمستهلكين بأفضل الأسعار.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-secondary/20 hover:border-secondary/40 transition-colors">
                <CardHeader className="text-center">
                  <Heart className="h-16 w-16 text-secondary mx-auto mb-4" />
                  <CardTitle className="text-2xl">مهمتنا</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground leading-relaxed">
                    تسهيل التجارة الإلكترونية في القطاع الزراعي من خلال منصة آمنة وسهلة الاستخدام،
                    تمكن المزارعين من عرض منتجاتهم مباشرة للتجار ومصانع المجمدات،
                    مما يحقق العدالة في الأسعار ويقلل الوسطاء.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Values Section */}
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary mb-4">قيمنا</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                نحن نؤمن بمجموعة من القيم الأساسية التي توجه عملنا وتحدد طريقة تفاعلنا مع عملائنا
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle>الثقة والأمان</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    نضمن بيئة آمنة وموثوقة لجميع المعاملات التجارية مع حماية كاملة لبيانات المستخدمين
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Users className="h-12 w-12 text-secondary mx-auto mb-4" />
                  <CardTitle>الشراكة المثمرة</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    نبني علاقات طويلة الأمد مع شركائنا لتحقيق النمو المستدام والفائدة المشتركة
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Award className="h-12 w-12 text-tertiary mx-auto mb-4" />
                  <CardTitle>الجودة والتميز</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    نسعى للتميز في كل ما نقدمه من خدمات ونضمن أعلى معايير الجودة في المنتجات
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="py-16 bg-white/50">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary mb-4">كيف نعمل؟</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                عملية بسيطة وفعالة تربط بين المزارعين والتجار ومصانع المجمدات
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">التسجيل والانضمام</h3>
                <p className="text-muted-foreground">
                  يقوم المزارعون والتجار ومصانع المجمدات بإنشاء حساباتهم على المنصة
                  وتعبئة بياناتهم الأساسية
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-secondary">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">عرض وطلب المنتجات</h3>
                <p className="text-muted-foreground">
                  المزارعون يعرضون منتجاتهم، بينما التجار والمصانع يطلبون ما يحتاجونه
                  مع تحديد الكميات والأسعار
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-tertiary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-tertiary">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">التفاوض والاتفاق</h3>
                <p className="text-muted-foreground">
                  يتم التفاوض على الأسعار والشروط من خلال المنصة حتى الوصول
                  لاتفاق يرضي جميع الأطراف
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary mb-4">مميزات سوق بلدي</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                مجموعة من المميزات التي تجعل منصتنا الخيار الأمثل للمزارعين والتجار
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "سهولة الاستخدام",
                  description: "واجهة بسيطة ومفهومة للجميع",
                  icon: "🎯"
                },
                {
                  title: "أسعار عادلة",
                  description: "تقليل الوسطاء يعني أسعار أفضل",
                  icon: "💰"
                },
                {
                  title: "تواصل مباشر",
                  description: "محادثات مباشرة بين البائع والمشتري",
                  icon: "💬"
                },
                {
                  title: "دعم فني",
                  description: "فريق دعم متاح على مدار الساعة",
                  icon: "🛟"
                },
                {
                  title: "منتجات طازجة",
                  description: "من المزرعة مباشرة إلى المستهلك",
                  icon: "🌱"
                },
                {
                  title: "شفافية كاملة",
                  description: "معلومات واضحة عن كل منتج",
                  icon: "📊"
                },
                {
                  title: "تسليم سريع",
                  description: "ترتيب التسليم بأسرع وقت ممكن",
                  icon: "🚚"
                },
                {
                  title: "ضمان الجودة",
                  description: "معايير صارمة لضمان جودة المنتجات",
                  icon: "✅"
                }
              ].map((feature, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-16 bg-primary/5">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary mb-4">إنجازاتنا</h2>
              <p className="text-muted-foreground">أرقام تتحدث عن نجاحنا</p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                { number: "1000+", label: "مزارع مسجل", color: "text-primary" },
                { number: "500+", label: "تاجر نشط", color: "text-secondary" },
                { number: "50+", label: "شركة مجمدات", color: "text-tertiary" },
                { number: "10000+", label: "طلب مكتمل", color: "text-brown" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className={`text-4xl font-bold mb-2 ${stat.color}`}>
                    {stat.number}
                  </div>
                  <p className="text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16">
          <div className="container">
            <Card className="max-w-2xl mx-auto text-center border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">تواصل معنا</CardTitle>
                <CardDescription>
                  هل لديك أسئلة أو اقتراحات؟ نحن هنا للمساعدة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  فريقنا مستعد للإجابة على جميع استفساراتك ومساعدتك في الاستفادة القصوى من منصة سوق بلدي
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <Badge variant="outline">الدعم الفني</Badge>
                  <Badge variant="outline">استشارات مجانية</Badge>
                  <Badge variant="outline">مساعدة في التسجيل</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default About;