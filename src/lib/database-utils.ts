import { collection, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Order/Product listing interfaces
export interface SellOrder {
  id?: string;
  userId: string;
  userName: string;
  userType: "farmer";
  productType: "vegetables" | "fruits";
  productName: string;
  quantity: number;
  unit: "kg" | "ton";
  pricePerUnit: number;
  deliveryLocation: string;
  deliveryDate: string;
  status: "active" | "in_progress" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
  offers: Offer[];
}

export interface BuyRequest {
  id?: string;
  userId: string;
  userName: string;
  userType: "trader" | "factory";
  productType: "vegetables" | "fruits";
  productName: string;
  quantity: number;
  unit: "kg" | "ton";
  pricePerUnit: number;
  deliveryLocation: string;
  deliveryDate: string;
  country: string;
  governorate: string;
  region: string;
  status: "active" | "in_progress" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
  offers: Offer[];
}

export interface Offer {
  id: string;
  offeredBy: string;
  offererName: string;
  offererType: "farmer" | "trader" | "factory";
  quantity: number;
  pricePerUnit: number;
  deliveryDate: string;
  deliveryLocation: string;
  message?: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}

// Database operations
export const createSellOrder = async (orderData: Omit<SellOrder, 'id' | 'createdAt' | 'updatedAt' | 'offers'>) => {
  try {
    const order = {
      ...orderData,
      offers: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, "sellOrders"), order);
    return { id: docRef.id, ...order };
  } catch (error) {
    console.error("Error creating sell order:", error);
    throw new Error("فشل في إنشاء طلب البيع");
  }
};

export const createBuyRequest = async (requestData: Omit<BuyRequest, 'id' | 'createdAt' | 'updatedAt' | 'offers'>) => {
  try {
    const request = {
      ...requestData,
      offers: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, "buyRequests"), request);
    return { id: docRef.id, ...request };
  } catch (error) {
    console.error("Error creating buy request:", error);
    throw new Error("فشل في إنشاء طلب الشراء");
  }
};

export const addOfferToOrder = async (
  orderId: string, 
  offer: Omit<Offer, 'id' | 'createdAt'>,
  isSelOrder: boolean = true
) => {
  try {
    const collection_name = isSelOrder ? "sellOrders" : "buyRequests";
    const orderRef = doc(db, collection_name, orderId);
    
    const offerWithId = {
      ...offer,
      id: `offer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };

    // This would require reading the document first, then updating with the new offer
    // For now, we'll implement this in the component that calls it
    return offerWithId;
  } catch (error) {
    console.error("Error adding offer:", error);
    throw new Error("فشل في إضافة العرض");
  }
};

export const updateOfferStatus = async (
  orderId: string,
  offerId: string,
  status: "accepted" | "rejected",
  isSellOrder: boolean = true
) => {
  try {
    const collection_name = isSellOrder ? "sellOrders" : "buyRequests";
    // Implementation would update the specific offer status within the offers array
    // This requires array manipulation in Firestore
    return { success: true };
  } catch (error) {
    console.error("Error updating offer status:", error);
    throw new Error("فشل في تحديث حالة العرض");
  }
};

// Product and price utilities
export const vegetables = [
  "طماطم", "خيار", "فلفل", "باذنجان", "كوسة", "بصل", "ثوم", "جزر", 
  "بطاطس", "بطاطا", "فاصوليا", "بازلاء", "ملوخية", "سبانخ", "جرجير", 
  "خس", "كرنب", "قرنبيط", "بروكلي", "فجل"
];

export const fruits = [
  "تفاح", "موز", "برتقال", "مانجو", "عنب", "فراولة", "خوخ", "مشمش", 
  "كمثرى", "أناناس", "بطيخ", "شمام", "تين", "رمان", "جوافة", "كيوي", 
  "ليمون", "يوسفي", "تمر"
];

export const countries = [
  "مصر", "السعودية", "الإمارات", "الكويت", "قطر", "البحرين", "عمان", 
  "الأردن", "لبنان", "العراق", "المغرب", "الجزائر", "تونس", "ليبيا"
];

export const egyptGovernorates = [
  "القاهرة", "الجيزة", "الإسكندرية", "الدقهلية", "الشرقية", "القليوبية", 
  "كفر الشيخ", "الغربية", "المنوفية", "البحيرة", "الإسماعيلية", "بورسعيد", 
  "السويس", "شمال سيناء", "جنوب سيناء", "الفيوم", "بني سويف", "المنيا", 
  "أسيوط", "سوهاج", "قنا", "الأقصر", "أسوان", "البحر الأحمر", "الوادي الجديد", "مطروح"
];

export const regions = [
  "وسط البلد", "المعادي", "الزمالك", "مدينة نصر", "الهرم", "فيصل", 
  "المهندسين", "الدقي", "العجوزة", "المقطم", "التجمع الخامس", "الشيخ زايد", 
  "6 أكتوبر", "العبور", "بدر", "الشروق", "النزهة", "مصر الجديدة", "شبرا الخيمة"
];