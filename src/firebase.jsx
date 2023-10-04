import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBzrSIvw3e6bPVCKK0sQ0YqAT4OM5IewZ0",
  authDomain: "chat2-176db.firebaseapp.com",
  projectId: "chat2-176db",
  storageBucket: "chat2-176db.appspot.com",
  messagingSenderId: "112598579821",
  appId: "1:112598579821:web:f4768ddd9033dc4feddd64",
  measurementId: "G-XPYWXE9QHR"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore()
