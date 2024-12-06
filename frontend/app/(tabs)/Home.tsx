// /screens/Home.tsx
import React, { useState } from "react";
import { View, Text, Button } from "react-native";
import TopNavigationBar from "../Components/TopNavigationBar"; // Import the top nav component
import { useRouter } from "expo-router"; // For navigation
import SearchScreen from "../screens/SearchScreen"; // Import SearchScreen component

const HomeScreen = () => {
  const [isSearching, setIsSearching] = useState(false); // State to control visibility of TopNavigationBar and Tabs
  const router = useRouter(); // Router hook to navigate programmatically

  const handleSearchPress = () => {
    setIsSearching(true); // Hide both tabs and TopNavigationBar
  };

  const handleExitSearch = () => {
    setIsSearching(false); // Show both tabs and TopNavigationBar
  };

  const handleNotificationPress = () => {
    router.push("../screens/NotificationScreen"); // Navigate to NotificationScreen
  };

  return (
    <>
      {/* Conditionally render the Top Navigation Bar */}
      {!isSearching ? (
        <TopNavigationBar
          onProfilePress={() => console.log("Profile pressed")}
          onSearchPress={handleSearchPress} // Trigger search mode
          onNotificationPress={handleNotificationPress} // Show notification screen
        />
      ) : (
        // Render SearchScreen when isSearching is true
        <SearchScreen onExitSearch={handleExitSearch} />
      )}

      {!isSearching && (
        // Main content for Home screen when not in search mode
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text>Welcome to UniBond!</Text>
          
        </View>
      )}
    </>
  );
};

export default HomeScreen;
