// components/TopNavigationBar.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

interface TopNavigationBarProps {
  userName: string;
  onProfilePress?: () => void;
  onNotificationPress?: () => void;
}

const TopNavigationBar: React.FC<TopNavigationBarProps> = ({
  userName,
  onProfilePress,
  onNotificationPress,
}) => {
  return (
    <View style={styles.container}>
      {/* Profile Icon */}
      <TouchableOpacity onPress={onProfilePress}>
        <FontAwesome name="user" size={24} color="#000" />
      </TouchableOpacity>

      {/* User Name */}
      <Text style={styles.userName}>{userName}</Text>

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
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
});

export default TopNavigationBar;
