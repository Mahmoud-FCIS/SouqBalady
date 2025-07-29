import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import logo from "@/assets/logo.png";
import heroImage from "@/assets/hero.jpg";
import userTypesImage from "@/assets/user-types.png";
import { CheckCircle2, Users, TrendingUp, ShieldCheck, Leaf, ThumbsUp } from "lucide-react";

const Welcome = () => {
  const navigate = useNavigate();

  const fadeInUpVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.5,
      },
    }),
  };

  const testimonials = [
    {
      name: "أحمد محمود",
      role: "مزارع",
      content: "ساعدني سوق بلدي في بيع محاصيلي بسعر أفضل وبدون وسطاء. أشكركم على هذه الخدمة المميزة!",
      rating: 5,
    },
    {
      name: "سارة حسن",
      role: "تاجر خضار وفواكه",
      content: "أصبح من السهل الحصول على منتجات طازجة مباشرة من المزارعين بأسعار منافسة وجودة عالية.",
      rating: 4,
    },
    {
      name: "محمد عبدالله",
      role: "مدير مصنع مجمدات",
      content: "نجحنا في تأمين احتياجاتنا من المنتجات الزراعية بشكل مستمر وبجودة ممتازة من خلال المنصة.",
      rating: 5,
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="سوق بلدي" 
            className="w-full h-full object-cover object-center" 
          />
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        </div>
        
        <div className="container mx-auto px-4 py-20 relative z-10 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-6 flex justify-center"
            >
              <img src={logo} alt="سوق بلدي" className="h-28 w-auto" />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            >
              سوق بلدي
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-xl md:text-2xl mb-8 leading-relaxed"
            >
              منصة مبتكرة تربط المزارعين مباشرة بالتجار ومصانع المجمدات، لتحقيق أقصى فائدة للجميع وتعزيز سلاسل التوريد المحلية
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button 
                variant="hero-solid" 
                size="lg" 
                onClick={() => navigate("/register")}
                className="text-lg"
              >
                انضم إلينا
              </Button>
              <Button 
                variant="hero" 
                size="lg" 
                onClick={() => navigate("/login")}
                className="text-lg"
              >
                تسجيل الدخول
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gradient-to-br from-background to-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <motion.h2
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUpVariant}
              className="text-3xl md:text-4xl font-bold mb-4 text-primary"
            >
              نبذة عن سوق بلدي
            </motion.h2>
            <motion.div
              custom={1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUpVariant}
              className="w-20 h-1 bg-secondary mx-auto mb-8"
            ></motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <motion.div
              custom={2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUpVariant}
              className="bg-card p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center card-hover"
            >
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Leaf className="text-primary" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-4">رؤيتنا</h3>
              <p className="text-muted-foreground">
                أن نكون المنصة الرائدة في ربط المزارعين بالتجار ومصانع المجمدات في الشرق الأوسط، مما يساهم في تحسين سلاسل التوريد الزراعية وتعزيز الاقتصاد المحلي
              </p>
            </motion.div>

            <motion.div
              custom={3}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUpVariant}
              className="bg-card p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center card-hover"
            >
              <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="text-secondary" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-4">مهمتنا</h3>
              <p className="text-muted-foreground">
                توفير منصة موثوقة وسهلة الاستخدام تمكن المزارعين من بيع منتجاتهم مباشرة للتجار ومصانع المجمدات، مما يقلل الوسطاء ويزيد الأرباح لجميع الأطراف
              </p>
            </motion.div>

            <motion.div
              custom={4}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUpVariant}
              className="bg-card p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center card-hover"
            >
              <div className="bg-tertiary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="text-tertiary" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-4">قيمنا</h3>
              <p className="text-muted-foreground">
                الشفافية والنزاهة في جميع تعاملاتنا، الالتزام بجودة الخدمة، الابتكار المستمر، والمساهمة في تنمية المجتمعات الزراعية
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-brown/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <motion.h2
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUpVariant}
              className="text-3xl md:text-4xl font-bold mb-4 text-primary"
            >
              لماذا تختار سوق بلدي؟
            </motion.h2>
            <motion.div
              custom={1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUpVariant}
              className="w-20 h-1 bg-secondary mx-auto mb-8"
            ></motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="order-2 md:order-1">
              <div className="space-y-6">
                <motion.div
                  custom={2}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInUpVariant}
                  className="flex gap-4 items-start"
                >
                  <div className="shrink-0">
                    <CheckCircle2 className="text-primary mt-1" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">تواصل مباشر</h3>
                    <p className="text-muted-foreground">
                      منصتنا تتيح التواصل المباشر بين المزارعين والتجار ومصانع المجمدات دون وسطاء، مما يوفر الوقت والمال للجميع
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  custom={3}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInUpVariant}
                  className="flex gap-4 items-start"
                >
                  <div className="shrink-0">
                    <CheckCircle2 className="text-primary mt-1" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">أسعار عادلة</h3>
                    <p className="text-muted-foreground">
                      يحصل المزارعون على أسعار أفضل لمنتجاتهم، بينما يحصل التجار والمصانع على منتجات بأسعار منافسة وجودة عالية
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  custom={4}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInUpVariant}
                  className="flex gap-4 items-start"
                >
                  <div className="shrink-0">
                    <CheckCircle2 className="text-primary mt-1" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">جودة مضمونة</h3>
                    <p className="text-muted-foreground">
                      نحرص على ضمان جودة المنتجات من خلال نظام تقييم المستخدمين ومراقبة الجودة
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  custom={5}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInUpVariant}
                  className="flex gap-4 items-start"
                >
                  <div className="shrink-0">
                    <CheckCircle2 className="text-primary mt-1" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">منصة آمنة وسهلة الاستخدام</h3>
                    <p className="text-muted-foreground">
                      واجهة سهلة الاستخدام مع أمان عالي للبيانات والمعاملات، تناسب جميع المستخدمين
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>

            <motion.div
              custom={6}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUpVariant}
              className="order-1 md:order-2 flex items-center justify-center"
            >
              <img 
                src={userTypesImage} 
                alt="أنواع المستخدمين" 
                className="max-w-full rounded-lg shadow-xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <motion.h2
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUpVariant}
              className="text-3xl md:text-4xl font-bold mb-4 text-primary"
            >
              آراء وتقييمات عملائنا
            </motion.h2>
            <motion.div
              custom={1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUpVariant}
              className="w-20 h-1 bg-secondary mx-auto mb-8"
            ></motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                custom={index + 2}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUpVariant}
                className="bg-card p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-border card-hover"
              >
                <div className="mb-4 flex">
                  {[...Array(5)].map((_, i) => (
                    <ThumbsUp
                      key={i}
                      size={18}
                      className={i < testimonial.rating ? "text-tertiary" : "text-muted"}
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center">
                    <Users className="text-primary" size={20} />
                  </div>
                  <div className="mr-3">
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-tertiary text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUpVariant}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            ابدأ معنا اليوم
          </motion.h2>
          <motion.p
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUpVariant}
            className="text-xl max-w-2xl mx-auto mb-8"
          >
            انضم إلى مجتمع سوق بلدي واستفد من الفرص المتاحة للمزارعين والتجار ومصانع المجمدات
          </motion.p>
          <motion.div
            custom={2}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUpVariant}
          >
            <Button 
              variant="hero" 
              size="xl" 
              onClick={() => navigate("/register")}
              className="text-lg shadow-lg"
            >
              ابدأ الآن
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Welcome;