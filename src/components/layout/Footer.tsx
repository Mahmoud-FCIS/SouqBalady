import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube, MessageSquare } from "lucide-react";
import logo from "@/assets/logo.png";
import developerLogo from "@/assets/developer-logo.png";

const Footer = () => {
  return (
    <footer className="bg-brown text-brown-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and About */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="سوق بلدي" className="h-16 w-auto" />
              <span className="font-bold text-2xl">سوق بلدي</span>
            </Link>
            <p className="text-sm text-center md:text-right max-w-xs">
              منصة رقمية تربط المزارعين مباشرة بالتجار ومصانع المجمدات لتحقيق أقصى فائدة للجميع وتعزيز التجارة المحلية
            </p>
            
            {/* Developer section - added under the description */}
            <div className="flex flex-row-reverse items-center justify-center md:justify-start gap-2 mt-2">
              <a 
                href="https://magdy-soft.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <img 
                  src={developerLogo} 
                  alt="Developer Logo" 
                  className="h-20 w-auto"  // Made logo bigger
                />
              </a>
              <span className="text-sm font-medium">المطوِّرون</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <h3 className="font-bold text-xl mb-3">روابط سريعة</h3>
            <Link to="/about" className="text-sm hover:underline">عن سوق بلدي</Link>
            <Link to="/contact" className="text-sm hover:underline">اتصل بنا</Link>
            <Link to="/register" className="text-sm hover:underline">انضم إلينا</Link>
            <Link to="/login" className="text-sm hover:underline">تسجيل الدخول</Link>
            <Link to="/privacy" className="text-sm hover:underline">سياسة الخصوصية</Link>
            <Link to="/terms" className="text-sm hover:underline">الشروط والأحكام</Link>
          </div>

          {/* Social Media */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <h3 className="font-bold text-xl mb-3">تابعونا</h3>
            <div className="flex gap-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-brown-foreground/10 p-2 rounded-full hover:bg-brown-foreground/20 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={24} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-brown-foreground/10 p-2 rounded-full hover:bg-brown-foreground/20 transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={24} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-brown-foreground/10 p-2 rounded-full hover:bg-brown-foreground/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={24} />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-brown-foreground/10 p-2 rounded-full hover:bg-brown-foreground/20 transition-colors"
                aria-label="YouTube"
              >
                <Youtube size={24} />
              </a>
              <a 
                href="https://wa.me/123456789" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-brown-foreground/10 p-2 rounded-full hover:bg-brown-foreground/20 transition-colors"
                aria-label="WhatsApp"
              >
                <MessageSquare size={24} />
              </a>
            </div>
            <p className="text-sm mt-4">
              تواصل معنا عبر وسائل التواصل الاجتماعي للحصول على أحدث الأخبار والعروض
            </p>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-brown-foreground/20 text-center">
          <p className="text-sm">© {new Date().getFullYear()} سوق بلدي. جميع الحقوق محفوظة</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;