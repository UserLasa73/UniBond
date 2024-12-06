import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Button, StyleSheet } from "react-native";

const notifications = [
  { id: "1", message: "You have a new message.", read: false },
  { id: "2", message: "Your profile has been updated.", read: false },
  { id: "3", message: "New job opportunity available.", read: false },
];

const NotificationScreen = () => {
  const [notificationList, setNotificationList] = useState(notifications);

  const markAsRead = (id: string) => {
    setNotificationList((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id
          ? { ...notification, read: true } // Mark the notification as read
          : notification
      )
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <FlatList
        data={notificationList}
        renderItem={({ item }) => (
          <View style={styles.notification}>
            <Text>{item.message}</Text>
            <Button
              title={item.read ? "Read" : "Mark as read"}
              onPress={() => markAsRead(item.id)}
              color={item.read ? "#8E8E93" : "#0078D7"} // Change button color based on read status
            />
          </View>
        )}
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
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default NotificationScreen;
