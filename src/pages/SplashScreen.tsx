import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "@/assets/logo.png";

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto redirect to welcome page after animation completes (3 seconds)
    const timer = setTimeout(() => {
      navigate("/welcome");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 to-tertiary/20">
      <motion.div
        className="flex flex-col items-center justify-center"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
        }}
      >
        <motion.img
          src={logo}
          alt="سوق بلدي"
          className="w-40 h-40 md:w-56 md:h-56"
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, 2, -2, 0],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.h1
          className="mt-6 text-3xl md:text-4xl font-bold text-primary"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          سوق بلدي
        </motion.h1>
        <motion.p
          className="mt-3 text-lg text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          ربط المزارعين بالتجار وبمصانع المجمدات
        </motion.p>
        
        <motion.div
          className="mt-8 flex space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <span className="w-3 h-3 bg-primary rounded-full animate-pulse"></span>
          <span className="w-3 h-3 bg-secondary rounded-full animate-pulse" style={{ animationDelay: "300ms" }}></span>
          <span className="w-3 h-3 bg-tertiary rounded-full animate-pulse" style={{ animationDelay: "600ms" }}></span>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SplashScreen;