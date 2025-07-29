import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ArrowRight } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="text-center space-y-6 p-8">
        <div className="space-y-4">
          <h1 className="text-8xl font-bold text-primary/60">404</h1>
          <h2 className="text-3xl font-bold text-foreground">الصفحة غير موجودة</h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها إلى مكان آخر
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button size="lg" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              العودة للرئيسية
            </Button>
          </Link>
          <Link to="/welcome">
            <Button variant="outline" size="lg" className="flex items-center gap-2">
              <ArrowRight className="h-4 w-4" />
              صفحة الترحيب
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
