// /screens/Home.tsx
import React from "react";
import { View, Text } from "react-native";
import TopNavigationBar from "../Components/TopNavigationBar"; // Import the top nav component
import { useRouter } from "expo-router"; // For navigation

const HomeScreen = () => {
  const router = useRouter(); // Router hook to navigate programmatically

  const handleNotificationPress = () => {
    router.push("../screens/NotificationScreen"); // Navigate to NotificationScreen
  };

  return (
    <>
      {/* Top Navigation Bar */}
      <TopNavigationBar
        userName="John Doe" // Display the user's name
        onProfilePress={() => console.log("Profile pressed")} // Profile button logic
        onNotificationPress={handleNotificationPress} // Notification button logic
      />

      {/* Main content for Home screen */}
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Welcome to UniBond!</Text>
      </View>
    </>
  );
};

export default HomeScreen;
