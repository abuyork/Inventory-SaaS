import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCSdpauUcexjbROrmo76IcmKYjJsL7Xprs",
  authDomain: "inventory-dp.firebaseapp.com",
  projectId: "inventory-dp",
  storageBucket: "inventory-dp.firebasestorage.app",
  messagingSenderId: "881084832410",
  appId: "1:881084832410:web:34b5d8f7e5a64a898b1d23"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); 