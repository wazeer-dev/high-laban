import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, updateDoc, doc, setDoc } from "firebase/firestore";

// TODO: REPLACE WITH YOUR FIREBASE CONFIGURATION
// 1. Go to console.firebase.google.com
// 2. Click "Project Settings" -> "General" -> "Your apps"
// 3. Copy the config object and paste it below
const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

export const isConfigured = () => {
    return firebaseConfig.apiKey !== "YOUR_API_KEY_HERE";
};

import { getStorage } from "firebase/storage";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Collection References
export const COLLECTIONS = {
    PRODUCTS: 'products',
    ORDERS: 'orders',
    CUSTOMERS: 'customers'
};
