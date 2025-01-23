
import { initializeApp, getApps } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCuzkeD9BHf086KrpozY5iDHu-bR0DvK0k",
  authDomain: "norfakan.firebaseapp.com",
  projectId: "norfakan",
  storageBucket: "norfakan.firebasestorage.app",
  messagingSenderId: "144026146495",
  appId: "1:144026146495:web:e1f0d23f10da130e0dd80a",
  measurementId: "G-2W2BGHL7GB"
};

const FIREBASE_APP = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
    persistence: getReactNativePersistence(AsyncStorage)
});
export const FIREBASE_FIRESTORE = getFirestore(FIREBASE_APP);

