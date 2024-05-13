import { View, Image, Text, TextInput, Pressable, Alert } from 'react-native';
import React, { useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Foundation } from '@expo/vector-icons';
import Loading from '../components/Loading';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import CustomKeyBoardView from '../components/CustomKeyBoardView';
import { register , sendVerificationEmail} from '../fireBase/auth';
// import { sendEmailVerification } from 'firebase/auth';

export default function SignUp() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const emailRef = useRef("");
    const passwordRef = useRef("");
    const usernameRef = useRef("");

    const handleRegister = async () => {
        if (!emailRef.current || !passwordRef.current || !usernameRef.current) {
            Alert.alert('Sign up', "Please fill all the fields");
            return;
        }
        setLoading(true);
        try {
            const response = await register(emailRef.current, passwordRef.current , usernameRef.current);
            
            // If registration is successful
            if (response.success) {
                // Send verification email
                await sendVerificationEmail(); // Ensure sendVerificationEmail is correctly implemented
                setLoading(false);
                Alert.alert('Sign Up', 'Registration successful. Please check your email for verification.');
                // Redirect to sign-in page
                router.push('signIn'); // Ensure router.push is correctly configured
            } else {
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
            console.error('Error registering user:', error);
    
           
            if (error.code === 'auth/email-already-in-use') {
                Alert.alert('Sign Up', 'The email address is already in use. Please use a different email address.');
            } else if (error.code === 'auth/weak-password') {
                Alert.alert('Sign Up', 'The password is too weak. Please use a stronger password.');
            } else if (error.code === 'auth/network-request-failed') {
                Alert.alert('Sign Up', 'Bad Connection. Please check your connection.');
            } 
            else {
                Alert.alert('Sign Up', 'An error occurred during registration. Please try again later.');
            }
        }
    }
    
    

    return (
        <CustomKeyBoardView>
            <StatusBar style="dark" />
            <View style={{ paddingTop: 50, paddingHorizontal: 20, flex: 1 }}>
                <View style={{ alignItems: "center" }}>
                    <Image style={{ height: 250, width: 320, resizeMode: "contain" }} source={require('../assets/images/Signup.jpg')} />
                </View>
                <View style={{ marginTop: 20 }}>
                    <Text style={{ fontSize: 32, fontWeight: "bold", textAlign: "center", color: "#333" }}>Sign up</Text>
                    <View style={{ marginTop: 20 }}>
                        <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#f2f2f2", borderRadius: 20, paddingHorizontal: 16, height: 56 }}>
                            <FontAwesome name="user" size={20} color="gray" style={{marginRight:10}} />
                            <TextInput
                                onChangeText={value => usernameRef.current = value}
                                style={{ fontSize: 16, flex: 1, fontWeight: "bold", color: "#333" }}
                                placeholder='Username'
                                placeholderTextColor={'gray'} />
                        </View>
                        <View style={{ marginTop: 10 }}>
                            <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#f2f2f2", borderRadius: 20, paddingHorizontal: 16, height: 56 }}>
                                <Foundation name="mail" size={20} color="gray"style={{marginRight:10}} />
                                <TextInput
                                    onChangeText={value => emailRef.current = value}
                                    style={{ fontSize: 16, flex: 1, fontWeight: "bold", color: "#333" }}
                                    placeholder='Email address'
                                    placeholderTextColor={'gray'} />
                            </View>
                        </View>
                        <View style={{ marginTop: 10 }}>
                            <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#f2f2f2", borderRadius: 20, paddingHorizontal: 16, height: 56 }}>
                                <Foundation name="lock" size={20} color="gray"style={{marginRight:10}} />
                                <TextInput
                                    onChangeText={value => passwordRef.current = value}
                                    style={{ fontSize: 16, flex: 1, fontWeight: "bold", color: "#333" }}
                                    secureTextEntry
                                    placeholder='Password'
                                    placeholderTextColor={'gray'} />
                            </View>
                        </View>
                        <View style={{ marginTop: 20 }}>
                            {loading ? (
                                <View style={{ justifyContent: "center", alignItems: "center" }}>
                                    <Loading size={48} />
                                </View>
                            ) : (
                                <Pressable onPress={handleRegister} style={{ backgroundColor: "#ca6128", borderRadius: 20, height: 56, justifyContent: "center", alignItems: "center" }}>
                                    <Text style={{ fontSize: 20, color: "white", fontWeight: "bold" }}>Sign Up</Text>
                                </Pressable>
                            )}
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 20 }}>
                            <Text style={{ fontSize: 14, fontWeight: "bold", color: "#777" }}>Already have an account? </Text>
                            <Pressable onPress={() => router.push('signIn')}>
                                <Text style={{ fontSize: 14, fontWeight: "bold", color: "#ca6128" }}>Sign In</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </View>
        </CustomKeyBoardView>
    );
}
