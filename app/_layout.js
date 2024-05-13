import React, { useEffect } from 'react'
import {Slot, useRouter, useSegments} from "expo-router";
import"../global.css";
import { AuthContexProvider,useAuth } from '../context/authContex';
import { MenuProvider } from 'react-native-popup-menu';

const MainLayout =()=>{
    const {isAuthenticated}=useAuth();
    const segments = useSegments();
    const router = useRouter();
    useEffect(()=>{
        if(typeof isAuthenticated =='undefined')return;
        const inApp = segments[0]=='(app)';
        if(isAuthenticated&&!inApp){

            router.replace('signIn');
        }else if(isAuthenticated==false){
            router.replace('signIn');
        }
    },[isAuthenticated])
    return<Slot />
}
export default function RootLayout() {
  return (
    <MenuProvider>
        <AuthContexProvider>
            <MainLayout />
        </AuthContexProvider>      

    </MenuProvider>
  )
}