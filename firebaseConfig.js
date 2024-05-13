import { initializeApp } from "firebase/app";
import {initializeAuth,getReactNativePersistence, getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, collection,doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  confirmPasswordReset,
  signInWithCredential,
  FacebookAuthProvider,
  sendEmailVerification
} from "firebase/auth";
import { get } from "firebase/database";

// Listen for authentication state to change.
// onAuthStateChanged(auth, (user) => {
//   if (user != null) {
//     console.log("We are authenticated now!");
//   }

// });

async function register(email,password,userName){
 const cred= await createUserWithEmailAndPassword(auth,email,password);
  await sendEmailVerification(auth.currentUser,{
    handleCodeInApp:true,
    url:"http://fir-764ee.firebaseapp.com"
  });
  await setDoc(doc(db, "users", cred.user.uid), {
        userName: userName,
        email: email,
        Todos:[],
      });
  console.log("Document created successfully");


  return cred;
}
async function login(email,password){
  const cred = await signInWithEmailAndPassword(auth,email,password);
  if(!cred.user.emailVerified){
    throw new Error('not emailVerified')
  }
  return cred;
}
async function getInfo(uid){
  const docRef = doc(db, "users", uid);
    const docSnapshot = await getDoc(docRef);
    
    if (docSnapshot.exists()) {
      const user = docSnapshot.data();
      return user;
    } else {
      // Document does not exist
      return null;
    }
  }
async function updateInfo(uid,todo){
  await updateDoc(doc(db,"/users",uid),{
    Todo:todo
   });
}
async function resetPass(email){
  await sendPasswordResetEmail(auth,email);
}
export {register,login,getInfo,updateInfo,resetPass};
// export { register, login,resetPass,getInfo,updateInfo };

// Initialize Firebase App
const firebaseConfig = {
  apiKey: "AIzaSyC0aNqBdBsEqAtBDc_WxTUR7hA_QRAkn7E",
  authDomain: "project-398ae.firebaseapp.com",
  projectId: "project-398ae",
  storageBucket: "project-398ae.appspot.com",
  messagingSenderId: "991935170839",
  appId: "1:991935170839:web:80691dbf14b5d9704ecf52"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with React Native Persistence
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)      
  });
// Initialize Firestore
const db = getFirestore(app);

// Reference to collections
const usersRef = collection(db, 'users');
const roomRef = collection(db, 'rooms');

export { auth, db, usersRef, roomRef };
