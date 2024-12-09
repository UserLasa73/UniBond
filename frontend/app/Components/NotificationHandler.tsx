import React, { useEffect } from "react";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

const NotificationHandler = () => {
  useEffect(() => {
    // Request permission for notifications on iOS
    const requestPermissions = async () => {
      if (Platform.OS === "ios") {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== "granted") {
          alert("Permission to receive notifications is required!");
        }
      }
    };

    requestPermissions();

    // Handle incoming notifications (when the app is in the background or closed)
    Notifications.addNotificationReceivedListener((notification) => {
      console.log("Notification received:", notification);
    });

    // Handle notification tap (opens app when clicked)
    Notifications.addNotificationResponseReceivedListener((response) => {
      console.log("Notification tapped:", response);
    });
  }, []);

  // Function to send a local notification
  const sendNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "New Notification!",
        body: "You have a new message.",
        data: { customData: "Some custom data" },
      },
      trigger: {
        seconds: 1, // Trigger after 1 second
        repeats: false, // Set to true for repeating notifications
      } as Notifications.NotificationTriggerInput, // Cast the trigger to the correct type
    });
  };

  return null; // This component doesn't render anything but handles notifications
};

export default NotificationHandler;
