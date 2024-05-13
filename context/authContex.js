import { createContext, useContext, useEffect, useState } from "react";
import{ onAuthStateChanged,createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut } from 'firebase/auth'
import {auth, db} from "../firebaseConfig";
import {doc,getDoc,setDoc} from 'firebase/firestore';
export const AuthContext = createContext();

export const AuthContexProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(undefined);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth,(user)=>{
            // console.log('got user',user);
            if(user){
                setIsAuthenticated(true);
                setUser(user);
                updateUserData(user.uid);
            }else{
                setIsAuthenticated(false);
                setUser(null);
            }
        })
        return unsub;
    }, []);
    const updateUserData = async(userid)=>{
        const docRef =doc(db,'users',userid);
        const docSnap = await getDoc(docRef);
        if(docSnap.exists()){
            let data = docSnap.data();
            setUser({...user,username: data.username,profileUrl:data.profileUrl,userid:data.userId})
        }
    }
    const login = async (email, password) => {
        try {
            const response = await signInWithEmailAndPassword(auth,email,password);
            return{success:true}

        } catch (e) {
            let msg = e.message;
            if(msg.includes('(auth/invalid-email)'))msg='invalid email'
            if(msg.includes('(auth/invalid-credential)'))msg='Wrong mail'
           return{success:false,msg};        }
    }

    const logout = async () => {
        try {
            await signOut(auth);
            return{success:true}
        } catch (e) {
            return{success: false,msg:e.message,error:e};
        }
    }

    // const register = async (email, password, username) => {
    //     try {
    //         const response = await createUserWithEmailAndPassword(auth,email,password);
    //         console.log ('response:',response?.user);
    //         // setUser(response?.user);
    //         // setIsAuthenticated(true);
    //         await setDoc(doc(db,"users",response?.user?.uid),{
    //             username,userId:response?.user?.uid
    //         });
    //         return {success:true,data : response?.user};
    //     } catch (e) {
    //         let msg = e.message;
    //         if(msg.includes('(auth/invalid-email)'))msg='invalid email'
    //         if(msg.includes('(auth/email-already-in-use)'))msg='email already used'
    //        return{success:false,msg};
    //     }
    // }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}
export const useAuth =()=>{
    const value = useContext(AuthContext);
    if(!value){
        throw new Error ('useauth must be wrapped inside authcontextprovider');
    }
    return value;
}
