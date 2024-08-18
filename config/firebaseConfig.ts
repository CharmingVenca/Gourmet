import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, initializeAuth } from "firebase/auth";
import { getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyDZWpTZsuhgemijwilyTBFgCt6lcVkhHO8",
  authDomain: "klimes-gourmet.firebaseapp.com",
  projectId: "klimes-gourmet",
  storageBucket: "klimes-gourmet.appspot.com",
  messagingSenderId: "1055810086325",
  appId: "1:1055810086325:web:c4a55a817e81e6240825fc",
  measurementId: "G-S1TFE6SDG5"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Firebase Auth with React Native persistence only on non-web platforms
const auth = Platform.OS !== 'web' ? initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
}) : getAuth(app);

export { app, db, auth };