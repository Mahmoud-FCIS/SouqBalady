import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBFble36gmVpt84G1SrXcVJDkUMfpjbOh8",
  authDomain: "souqbalady-f180c.firebaseapp.com",
  projectId: "souqbalady-f180c",
  storageBucket: "souqbalady-f180c.firebasestorage.app",
  messagingSenderId: "993033232655",
  appId: "1:993033232655:web:4d0bf863a5933e1db51e7a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;