import React from "react";
import { View, Text } from "react-native";
import { Link } from "expo-router"; // Used for navigation

const Index = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8f9fa",
      }}
    >
      <Text style={{ fontSize: 32, fontWeight: "bold", color: "#0078D7" }}>
        UniBond
      </Text>
      <Link href="/Home">Home</Link> {/* This will navigate to the Home page */}
    </View>
  );
};

export default Index;
