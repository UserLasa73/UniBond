// /components/PushNotificationSetup.tsx
import { useEffect, useState } from "react";
import * as Notifications from "expo-notifications";

const PushNotificationSetup = () => {
  const [pushToken, setPushToken] = useState<string | null>(null);

  useEffect(() => {
    const getPushToken = async () => {
      const { data } = await Notifications.getExpoPushTokenAsync();
      setPushToken(data); // Store this token on your server for sending notifications
    };

    getPushToken();

    // Handle incoming notifications
    Notifications.addNotificationReceivedListener((notification) => {
      console.log("Notification received:", notification);
    });

    // Handle notification tap
    Notifications.addNotificationResponseReceivedListener((response) => {
      console.log("Notification tapped:", response);
    });
  }, []);

  return null;
};

export default PushNotificationSetup;
