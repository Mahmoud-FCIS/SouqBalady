import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Home from "./Home";

const Index = () => {
  const { currentUser, userLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userLoading) {
      if (!currentUser) {
        navigate("/");
      }
    }
  }, [currentUser, userLoading, navigate]);

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return <Home />;
};

export default Index;
