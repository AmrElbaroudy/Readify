import { View, Text, ActivityIndicator } from "react-native";
import React from "react";

export default function StartPage() {
  return (
    <View className="flix-1 justify-center item-center">
      <ActivityIndicator size="large" color="gray" />
    </View>
  );
}
