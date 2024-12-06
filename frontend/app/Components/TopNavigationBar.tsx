// components/TopNavigationBar.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";

interface TopNavigationBarProps {
  onProfilePress?: () => void;
  onSearchPress?: () => void;
  onNotificationPress?: () => void;
}

const TopNavigationBar: React.FC<TopNavigationBarProps> = ({
  onProfilePress,
  onSearchPress,
  onNotificationPress,
}) => {
  return (
    <View style={styles.container}>
      {/* Profile Icon */}
      <TouchableOpacity onPress={onProfilePress}>
        <FontAwesome name="user" size={24} color="#000" />
      </TouchableOpacity>

      {/* Search Bar */}
      <TouchableOpacity style={styles.searchContainer} onPress={onSearchPress}>
        <MaterialIcons name="search" size={24} color="#555" />
        <Text style={styles.searchText}>Search</Text>
      </TouchableOpacity>

      {/* Notification Icon */}
      <TouchableOpacity onPress={onNotificationPress}>
        <MaterialIcons name="notifications" size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 10,
  },
  searchText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#555",
  },
});

export default TopNavigationBar;
