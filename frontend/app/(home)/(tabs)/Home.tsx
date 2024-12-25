// /screens/Home.tsx
import React from "react";
import { View, Text } from "react-native";
import TopNavigationBar from "../../Components/TopNavigationBar"; // Import the top nav component
import { useRouter } from "expo-router"; // For navigation
import NotificationScreen from "@/app/screens/NotificationScreen";

const HomeScreen = () => {
  const router = useRouter(); // Router hook to navigate programmatically

  const handleNotificationPress = () => {
    router.push("/screens/NotificationScreen"); // Navigate to NotificationScreen
  };

  const handlePostPress = () => {
    router.push("/screens/PostScreen"); // Navigate to PostScreen
  };
  const handleProfilePress = () => {
    router.push("/screens/ProfileScreen"); // Navigate to
  };
  return (
    <>
      {/* Top Navigation Bar */}
      <TopNavigationBar
        userName="John Doe" // Display the user's name
        onProfilePress={handleProfilePress} // Profile button logic
        onNotificationPress={handleNotificationPress}
        onPostPress={handlePostPress}
      />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Welcome to UniBond!</Text>
      </View>
    </>
  );
};

export default HomeScreen;
