import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

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
export const auth = getAuth(app);

// Enable offline persistence
enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      console.log('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.log('The current browser doesn\'t support persistence.');
    }
}); 