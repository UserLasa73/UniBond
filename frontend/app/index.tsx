import React from "react";
import { View, Text } from "react-native";
import { Link } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import GetStartedPage from "./Components/GetStart";
const index = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1, alignItems: "center" }}>
      <GetStartedPage />
    </GestureHandlerRootView>
  );
};

export default index;
