import React from "react";
import { View, Text } from "react-native";
import { Link } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
const index = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1, alignItems: "center" }}>
      <Text style={{ fontSize: 32, fontWeight: "bold", color: "#0078D7" }}>
        UniBond
      </Text>
      <Link href="/Home">Home</Link>
    </GestureHandlerRootView>
  );
};

export default index;
