import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import HomeHeader from "../../components/HomeHeader";

import HomeHeader2 from "../../components/HomeHeader2";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function _layout() {
  const handleSignOut = async () => {
    try {
      router.replace("/signIn");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };
  return (
    <Stack>
      <Stack.Screen
        name="home"
        options={{
          header: () => <HomeHeader />,
        }}
      />
            <Stack.Screen
        name="home2"
        options={{
          header: () => <HomeHeader2 />,
        }}
      />
      <Stack.Screen
        name="Admin"
        options={{
          headerTitle: "Welcome Boss",
          headerRight: () => (
            <TouchableOpacity
              style={{
                backgroundColor: "#874f1f",
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 18,
                marginTop: 20,
                alignSelf: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.23,
                shadowRadius: 2.62,
              }}
              onPress={handleSignOut}
            >
              <MaterialCommunityIcons name="logout" size={24} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}
