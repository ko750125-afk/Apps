import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
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

let db: Firestore | null = null;
let auth: Auth | null = null;
let app: FirebaseApp | null = null;

// Only initialize if we have the minimum required config
const hasConfig = !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY && !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

if (typeof window !== 'undefined' || hasConfig) {
  try {
    if (getApps().length > 0) {
      app = getApp();
    } else if (hasConfig) {
      app = initializeApp(firebaseConfig);
      console.log("🚀 Firebase Initialized with Project ID:", firebaseConfig.projectId);
    }

    if (app) {
      db = getFirestore(app);
      auth = getAuth(app);
    }
  } catch (error) {
    console.error('❌ Firebase initialization error:', error);
  }
} else {
  console.warn("⚠️ Firebase config is missing. Authentication will be disabled.");
}

export { db, auth, app };
