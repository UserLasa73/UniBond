// /screens/Home.tsx
import React, { useEffect, useState } from "react";
import { View, Text, Alert } from "react-native";
import TopNavigationBar from "../../Components/TopNavigationBar"; // Import the top nav component
import { useRouter } from "expo-router"; // For navigation
import NotificationScreen from "@/app/screens/NotificationScreen";
import { useAuth } from "@/app/providers/AuthProvider";
import supabase from "@/lib/supabse";

const HomeScreen = () => {
  const router = useRouter(); // Router hook to navigate programmatically
  const { session } = useAuth();
  const [username, setUsername] = useState("");
  useEffect(() => {
    if (session) getProfile();
  }, [session]);
  async function getProfile() {
    try {
      const profileId = session?.user?.id;
      if (!profileId) throw new Error("No user on the session!");

      const { data, error } = await supabase
        .from("profiles")
        .select(`username`)
        .eq("id", profileId)
        .single();
      if (data) {
        setUsername(data.username);
      }

      if (error) throw error;
    } catch (error) {
      console.error("Error fetching profile:", error);
      if (error instanceof Error) Alert.alert("Error", error.message);
    }
  }
  const handleNotificationPress = () => {
    router.push("/screens/NotificationScreen"); // Navigate to NotificationScreen
  };

  const handlePostPress = () => {
    router.push("/screens/PostScreen"); // Navigate to PostScreen
  };
  const handleProfilePress = () => {
    router.push("/screens/ProfileScreen"); // Navigate to
  };
  return (
    <>
      {/* Top Navigation Bar */}
      <TopNavigationBar
        userName={username} // Display the user's name
        onProfilePress={handleProfilePress} // Profile button logic
        onNotificationPress={handleNotificationPress}
        onPostPress={handlePostPress}
      />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Welcome to UniBond!</Text>
      </View>
    </>
  );
};

export default HomeScreen;
