import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if config is provided
const isConfigValid = !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY && process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== 'your_api_key';

let app;
let db: Firestore | any = null;
let auth: Auth | any = null;

if (!isConfigValid) {
  console.warn('Firebase configuration is missing or invalid. Please check your .env.local file.');
} else {
  try {
    // Initialize Firebase
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
  } catch (error) {
    console.error('Firebase initialization error', error);
  }
}

export { db, auth };
