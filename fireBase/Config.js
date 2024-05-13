// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getReactNativePersistence } from "@firebase/auth/dist/rn/index.js";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyC0aNqBdBsEqAtBDc_WxTUR7hA_QRAkn7E",
  authDomain: "project-398ae.firebaseapp.com",
  projectId: "project-398ae",
  storageBucket: "project-398ae.appspot.com",
  messagingSenderId: "991935170839",
  appId: "1:991935170839:web:80691dbf14b5d9704ecf52"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export { app, db, auth };
