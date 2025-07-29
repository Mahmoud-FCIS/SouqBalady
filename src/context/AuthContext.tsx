import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  User, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged, 
  sendPasswordResetEmail, 
  signInWithEmailAndPassword, 
  signOut 
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useToast } from "@/components/ui/use-toast";

export type UserType = "farmer" | "trader" | "factory";

interface UserProfile {
  uid: string;
  email: string;
  userType: UserType;
  createdAt?: string;
  updatedAt?: string;
  
  // Common fields for all users
  phone?: string;
  country?: string;
  governorate?: string;
  region?: string;
  
  // Farmer fields
  name?: string;
  nationalId?: string;
  nationalIdFrontImage?: string;
  nationalIdBackImage?: string;
  address?: string;
  
  // Trader fields
  shopName?: string;
  shopAddress?: string;
  taxNumber?: string;
  
  // Factory fields
  companyName?: string;
  companyAddress?: string;
  commercialRegisterImage?: string;
}

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  userLoading: boolean;
  profileLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, userType: UserType, profileData?: any) => Promise<User>;
  saveUserProfile: (profileData: Partial<UserProfile>) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const { toast } = useToast();

  // Monitor auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setUserLoading(false);
      
      if (user) {
        try {
          setProfileLoading(true);
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            setUserProfile(userDocSnap.data() as UserProfile);
          } else {
            setUserProfile(null);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          toast({
            title: "خطأ",
            description: "حدث خطأ أثناء جلب بيانات المستخدم",
            variant: "destructive",
          });
        } finally {
          setProfileLoading(false);
        }
      } else {
        setUserProfile(null);
        setProfileLoading(false);
      }
    });

    return unsubscribe;
  }, [toast]);

  // Register new user with complete profile data
  const register = async (email: string, password: string, userType: UserType, profileData?: any): Promise<User> => {
    try {
      // Check if email already exists before creating account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create comprehensive user profile with all provided data
      const completeProfile = {
        uid: userCredential.user.uid,
        email,
        userType,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        profileCompleted: !!profileData,
        ...profileData,
      };
      
      // Save complete profile to Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), completeProfile);
      
      // Sign out immediately after registration (user needs to login separately)
      await signOut(auth);
      
      return userCredential.user;
    } catch (error: any) {
      let message = "حدث خطأ أثناء إنشاء الحساب";
      if (error.code === "auth/email-already-in-use") {
        message = "البريد الإلكتروني مستخدم بالفعل";
      } else if (error.code === "auth/weak-password") {
        message = "كلمة المرور ضعيفة جدًا";
      } else if (error.code === "auth/invalid-email") {
        message = "البريد الإلكتروني غير صحيح";
      }
      
      throw error;
    }
  };

  // Save or update user profile
  const saveUserProfile = async (profileData: Partial<UserProfile>): Promise<void> => {
    if (!currentUser) {
      throw new Error("No authenticated user");
    }

    try {
      const userDocRef = doc(db, "users", currentUser.uid);
      const updatedData = {
        ...profileData,
        updatedAt: new Date().toISOString(),
        profileCompleted: true,
      };
      
      await setDoc(userDocRef, updatedData, { merge: true });
      
      // Update local state
      setUserProfile(prev => prev ? { ...prev, ...updatedData } : null);
      
      toast({
        title: "تم بنجاح",
        description: "تم حفظ بيانات الملف الشخصي بنجاح",
      });
    } catch (error: any) {
      console.error("Error saving user profile:", error);
      let message = "حدث خطأ أثناء حفظ بيانات الملف الشخصي";
      
      if (error.code === "permission-denied") {
        message = "ليس لديك صلاحية لتعديل هذه البيانات";
      } else if (error.code === "network-error") {
        message = "تحقق من اتصال الإنترنت وحاول مرة أخرى";
      }
      
      toast({
        title: "خطأ",
        description: message,
        variant: "destructive",
      });
      throw error;
    }
  };

  // Login
  const login = async (email: string, password: string): Promise<void> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحبًا بك في سوق بلدي",
      });
    } catch (error: any) {
      let message = "حدث خطأ أثناء تسجيل الدخول";
      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        message = "البريد الإلكتروني أو كلمة المرور غير صحيحة";
      }
      
      toast({
        title: "خطأ في تسجيل الدخول",
        description: message,
        variant: "destructive",
      });
      
      throw error;
    }
  };

  // Logout
  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      toast({
        title: "تم تسجيل الخروج بنجاح",
        description: "نتمنى رؤيتك مرة أخرى قريبًا",
      });
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تسجيل الخروج",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Reset password
  const resetPassword = async (email: string): Promise<void> => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: "تم إرسال بريد إلكتروني",
        description: "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني",
      });
    } catch (error: any) {
      let message = "حدث خطأ أثناء إرسال بريد إعادة تعيين كلمة المرور";
      if (error.code === "auth/user-not-found") {
        message = "لا يوجد حساب مرتبط بهذا البريد الإلكتروني";
      }
      
      toast({
        title: "خطأ",
        description: message,
        variant: "destructive",
      });
      
      throw error;
    }
  };

  const value = {
    currentUser,
    userProfile,
    userLoading,
    profileLoading,
    login,
    register,
    saveUserProfile,
    logout,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};