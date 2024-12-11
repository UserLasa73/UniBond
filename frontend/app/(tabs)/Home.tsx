// /screens/Home.tsx
import React from "react";
import { View, Text } from "react-native";
import TopNavigationBar from "../Components/TopNavigationBar"; // Import the top nav component
import { useRouter } from "expo-router"; // For navigation
import HomeLayout from "../Chat/message/_layout";
import ChannelStack from "../Chat/channel/_layout";

const HomeScreen = () => {
  const router = useRouter(); // Router hook to navigate programmatically

  const handleNotificationPress = () => {
    router.push("../screens/NotificationScreen"); // Navigate to NotificationScreen
  };
  const handleSendPress = () => {
    router.push("../Chat/channel/_layout.tsx");
  };

  return (
    <>
      {/* Top Navigation Bar */}
      <TopNavigationBar
        userName="John Doe" // Display the user's name
        onProfilePress={() => console.log("Profile pressed")} // Profile button logic
        onNotificationPress={handleNotificationPress}
        onSendPress={handleSendPress} // Notification button logic
      />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Welcome to UniBond!</Text>
      </View>
    </>
  );
};

export default HomeScreen;
