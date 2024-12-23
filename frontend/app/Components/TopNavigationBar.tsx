import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

interface TopNavigationBarProps {
  userName: string;
  onProfilePress?: () => void;
  onNotificationPress?: () => void;
  onPostPress?: () => void;
}

const TopNavigationBar: React.FC<TopNavigationBarProps> = ({
  userName,
  onProfilePress,
  onNotificationPress,
  onPostPress,
}) => {
  return (
    <View style={styles.container}>
      {/* Profile Icon */}
      <TouchableOpacity onPress={onProfilePress} style={styles.profileImage}>
        <MaterialIcons name="person" size={24} color="#2C3036" />
      </TouchableOpacity>

      {/*User Name */}
      <Text style={styles.userName}>{userName}</Text>

      {/*Notification and Post Icons */}
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={onNotificationPress} style={styles.icon}>
          <MaterialIcons name="notifications" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onPostPress} style={styles.icon}>
          <MaterialIcons name="add-circle" size={24} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginLeft: 15,
  },
});

export default TopNavigationBar;
