import React, { useRef, useState } from "react";
import { View, Image, Text, TextInput, Pressable, Alert, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Foundation } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import CustomKeyBoardView from "../components/CustomKeyBoardView";
import Loading from "../components/Loading";
import { login } from "../fireBase/auth"; // Import signInWithEmailAndPassword function
import { resetPass } from "../fireBase/auth"; // Import resetPass function
import { getAuth } from "firebase/auth";

export default function SignIn() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const emailRef = useRef("");
  const passwordRef = useRef("");

  const handleLogin = async () => {
    if (!emailRef.current || !passwordRef.current) {
      Alert.alert("Sign in", "Please fill all the fields");
      return;
    }

    setLoading(true);

    try {
      await login(emailRef.current, passwordRef.current);
      setLoading(false);
      console.log("User logged in successfully");
      // router.replace("home");
    } catch (error) {
      setLoading(false);
      let errorMessage =
        "An error occurred while signing in. Please try again.";

      // Customize error messages based on error codes or types
      if (error.code === "auth/user-not-found") {
        errorMessage = "User not found. Please check your email and try again.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password. Please try again.";
      } else if (error.code === "auth/invalid-login-credentials") {
        errorMessage = "Incorrect Credentials. Please check again.";
      }

      console.error("Error logging in:", error.message);
      Alert.alert("Sign In", errorMessage);
    }
  };

  const handleLoginAndNavigate = async () => {
    const username = await handleLogin();
    if (username !== null) {
      const auth = getAuth();
      const user = auth.currentUser;
      const userId = user.uid;
      if (userId === "EhdaXO8JiMM5cRdmFOdopspIuQf2" || userId === "Ewc0uJR0AkY85t4zh6JALWuo9ez1") {
        router.replace("/Admin");
      } else {
        router.replace("home");
      }
    }
  };

  const handleForgotPass = async () => {
    try {
      await resetPass(emailRef.current); // Call resetPass function
      Alert.alert(
        "Forgot Password",
        "Please check your email to reset your password"
      );
    } catch (error) {
      console.error("Error sending password reset email:", error);
      Alert.alert("Forgot Password", "Error sending password reset email");
    }
  };

  return (
    <CustomKeyBoardView>
      <StatusBar style="dark" />
      <View style={{ paddingTop: 64, paddingHorizontal: 20, flex: 1,marginTop:20 }}>
        <Pressable onPress={() => router.push("home2")} style={styles.homeButton}>
          <Text style={{ color: "white", fontWeight: "bold" }}>continue with out sign</Text>
        </Pressable>
        <View style={{ alignItems: "center" }}>
          <Image
            style={{ height: 250, width: 320, resizeMode: "contain" }}
            source={require("../assets/images/login.png")}
          />
        </View>
        <View style={{ marginTop: 20 }}>
          <Text
            style={{
              fontSize: 32,
              fontWeight: "bold",
              textAlign: "center",
              color: "#333",
            }}
          >
            Sign In
          </Text>
          <View style={{ marginTop: 20 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#f2f2f2",
                borderRadius: 20,
                paddingHorizontal: 16,
                height: 56,
              }}
            >
              <Foundation
                name="mail"
                size={20}
                color="gray"
                style={{ marginRight: 10 }}
              />
              <TextInput
                onChangeText={(value) => (emailRef.current = value)}
                style={{
                  fontSize: 16,
                  flex: 1,
                  fontWeight: "bold",
                  color: "#333",
                }}
                placeholder="Email address"
                placeholderTextColor={"gray"}
              />
            </View>
            <View style={{ marginTop: 10 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#f2f2f2",
                  borderRadius: 20,
                  paddingHorizontal: 16,
                  height: 56,
                }}
              >
                <Foundation
                  name="lock"
                  size={20}
                  color="gray"
                  style={{ marginRight: 10 }}
                />
                <TextInput
                  onChangeText={(value) => (passwordRef.current = value)}
                  style={{
                    fontSize: 16,
                    flex: 1,
                    fontWeight: "bold",
                    color: "#333",
                  }}
                  secureTextEntry
                  placeholder="Password"
                  placeholderTextColor={"gray"}
                />
              </View>
            </View>
            <View style={{ marginTop: 20 }}>
              {loading ? (
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <Loading size={48} />
                </View>
              ) : (
                <Pressable
                  onPress={handleLoginAndNavigate}
                  style={{
                    backgroundColor: "#ca6128",
                    borderRadius: 20,
                    height: 56,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{ fontSize: 20, color: "white", fontWeight: "bold" }}
                  >
                    Submit
                  </Text>
                </Pressable>
              )}
            </View>
            <Pressable onPress={handleForgotPass}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "bold",
                  color: "#ca6128",
                  textAlign: "right",
                  marginTop: 5,
                }}
              >
                Forgot Password ?
              </Text>
            </Pressable>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 20,
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: "bold", color: "#777" }}>
                Don't have an account?{" "}
              </Text>
              <Pressable onPress={() => router.push("signUp")}>
                <Text
                  style={{ fontSize: 14, fontWeight: "bold", color: "#ca6128" }}
                >
                  Sign up
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </CustomKeyBoardView>
  );
}

const styles = StyleSheet.create({
  homeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    padding: 10,
    backgroundColor: "#ca6128",
    borderRadius: 8,
  },
});
