import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router"; // For navigation
//import hekko from '../(tabs)/Home'

const notifications = [
  { id: "1", type: "message", message: "You have a new message.", read: false, path: "../(tabs)/Home" },
  { id: "2", type: "profile", message: "Your profile has been updated.", read: false, path: "../(tabs)/Home" },
  { id: "3", type: "job", message: "New job opportunity available.", read: false, path: "../(tabs)/Jobs" },
  { id: "4", type: "comment", message: "Someone commented on your post.", read: false, path: "../(tabs)/Home" },
  { id: "5", type: "like", message: "Your post got a new like.", read: false, path: "/tabs/home" },
  { id: "6", type: "project", message: "A new project has been assigned to you.", read: false, path: "../(tabs)/Projects" },
];

const NotificationScreen = () => {
  const [notificationList, setNotificationList] = useState(notifications);
  const router = useRouter();

  const handleRemoveNotification = (id: string) => {
    setNotificationList((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    );
  };

  const handleNavigate = (path:any ) => {
    router.push(path); // Navigate to the corresponding path
  };

  const renderNotification = ({ item }: { item: typeof notifications[0] }) => {
    let backgroundColor;
    switch (item.type) {
      case "message":
        backgroundColor = "#E6F7FF";
        break;
      case "profile":
        backgroundColor = "#FFFBE6";
        break;
      case "job":
        backgroundColor = "#F6FFE6";
        break;
      case "comment":
        backgroundColor = "#FFF0F6";
        break;
      case "like":
        backgroundColor = "#F9F9F9";
        break;
      case "project":
        backgroundColor = "#E6FFF9";
        break;
      default:
        backgroundColor = "#FFF";
    }

    return (
      <View style={[styles.notification, { backgroundColor }]}>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => handleNavigate(item.path)} // Navigate to the relevant tab
        >
          <Text>{item.message}</Text>
          
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleRemoveNotification(item.id)}>
          <MaterialIcons name="delete" size={24} color="red" /> {/* Delete Icon */}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <FlatList
        data={notificationList}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  notification: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default NotificationScreen;
