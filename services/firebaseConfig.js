
import { initializeApp, getApps } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyC47ESG17qWyPL1O-Y9I4rYeY80AiNrf8Q",
  authDomain: "norfakan.firebaseapp.com",
  projectId: "norfakan",
  storageBucket: "norfakan.firebasestorage.app",
  messagingSenderId: "144026146495",
  appId: "1:144026146495:web:6ff2ab27e5e649820dd80a",
  measurementId: "G-3SN98RW6RB"
};

const FIREBASE_APP = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
    persistence: getReactNativePersistence(AsyncStorage)
});
export const FIREBASE_FIRESTORE = getFirestore(FIREBASE_APP);