import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, User, MessageCircle, Package, Home, Sun, Moon, Info, Phone, LogOut } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTheme } from "@/context/ThemeContext";
import logo from "@/assets/logo.png";

const Header = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
      setMobileMenuOpen(false);
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="سوق بلدي" className="h-10 w-auto" />
          <span className="font-bold text-xl text-primary">سوق بلدي</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {currentUser ? (
            <>
              <Link to="/home" className="animated-underline text-foreground">
                <Home className="inline-block ml-1" size={18} />
                الرئيسية
              </Link>
              <Link to="/orders" className="animated-underline text-foreground">
                <Package className="inline-block ml-1" size={18} />
                الطلبات
              </Link>
              <Link to="/messages" className="animated-underline text-foreground">
                <MessageCircle className="inline-block ml-1" size={18} />
                الرسائل
              </Link>
              <Link to="/contact" className="animated-underline text-foreground">
                <Phone className="inline-block ml-1" size={18} />
                اتصل بنا
              </Link>
              <Link to="/about" className="animated-underline text-foreground">
                <Info className="inline-block ml-1" size={18} />
                عن الموقع
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="mr-2"
                aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </Button>
              <div className="relative">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline-primary" className="gap-2">
                      <User size={18} />
                      حسابي
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      <User className="ml-2 h-4 w-4" />
                      الملف الشخصي
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="ml-2 h-4 w-4" />
                      تسجيل الخروج
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          ) : (
            <>
              <Link to="/contact" className="animated-underline text-foreground">
                <Phone className="inline-block ml-1" size={18} />
                اتصل بنا
              </Link>
              <Link to="/about" className="animated-underline text-foreground">
                <Info className="inline-block ml-1" size={18} />
                عن الموقع
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="mr-2"
                aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </Button>
              <div className="flex items-center gap-2">
                <Button variant="outline-primary" onClick={() => navigate("/login")}>
                  تسجيل الدخول
                </Button>
                <Button variant="primary" onClick={() => navigate("/register")}>
                  انضم إلينا
                </Button>
              </div>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-background border-t border-border"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              {currentUser ? (
                <>
                  <Link 
                    to="/home" 
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-muted"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Home size={18} />
                    <span>الرئيسية</span>
                  </Link>
                  <Link 
                    to="/orders" 
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-muted"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Package size={18} />
                    <span>الطلبات</span>
                  </Link>
                  <Link 
                    to="/messages" 
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-muted"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <MessageCircle size={18} />
                    <span>الرسائل</span>
                  </Link>
                  <Link 
                    to="/contact" 
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-muted"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Phone size={18} />
                    <span>اتصل بنا</span>
                  </Link>
                  <Link 
                    to="/about" 
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-muted"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Info size={18} />
                    <span>عن الموقع</span>
                  </Link>
                  <Link 
                    to="/profile" 
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-muted"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User size={18} />
                    <span>الملف الشخصي</span>
                  </Link>
                  <Button variant="outline" onClick={handleLogout}>
                    تسجيل الخروج
                  </Button>
                </>
              ) : (
                <>
                  <Link 
                    to="/contact" 
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-muted"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Phone size={18} />
                    <span>اتصل بنا</span>
                  </Link>
                  <Link 
                    to="/about" 
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-muted"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Info size={18} />
                    <span>عن الموقع</span>
                  </Link>
                  <Button 
                    variant="outline-primary" 
                    onClick={() => {
                      navigate("/login");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full"
                  >
                    تسجيل الدخول
                  </Button>
                  <Button 
                    variant="primary" 
                    onClick={() => {
                      navigate("/register");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full"
                  >
                    انضم إلينا
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;