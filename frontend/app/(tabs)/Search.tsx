// /screens/Home.tsx
import React, { useState } from "react";
import { View, Text, Button } from "react-native";
import TopNavigationBar from "../Components/TopNavigationBar"; // Import the top nav component
import { useRouter } from "expo-router"; // For navigation
import SearchScreen from "../screens/SearchScreen"; // Import SearchScreen component

const Search = () => {
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
    <SearchScreen />
  );
};

export default Search;
