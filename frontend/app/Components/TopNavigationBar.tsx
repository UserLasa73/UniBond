import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

interface TopNavigationBarProps {
  userName: string;
  onProfilePress?: () => void;
  onNotificationPress?: () => void;
  onSendPress?: () => void;
}

const TopNavigationBar: React.FC<TopNavigationBarProps> = ({
  userName,
  onProfilePress,
  onNotificationPress,
  onSendPress,
}) => {
  return (
    <View style={styles.container}>
      {/* Profile Icon */}
      <TouchableOpacity
        onPress={onProfilePress}
        style={styles.profileContainer}
      >
        <FontAwesome name="user" size={24} color="#000" />
      </TouchableOpacity>

      {/* User Name */}
      <Text style={styles.userName}>{userName}</Text>

      {/* Notification and Send Icons */}
      <View style={styles.iconGroup}>
        <TouchableOpacity onPress={onNotificationPress} style={styles.icon}>
          <MaterialIcons name="notifications" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onSendPress} style={styles.icon}>
          <MaterialIcons name="send" size={24} color="#000" />
        </TouchableOpacity>
      </View>
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
  profileContainer: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    flex: 3,
    textAlign: "center",
  },
  iconGroup: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-end",
  },
  icon: {
    marginLeft: 10,
  },
});

export default TopNavigationBar;
