// /screens/Home.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import TopNavigationBar from "../../Components/TopNavigationBar"; // Import the top nav component
import { useRouter } from "expo-router"; // For navigation
import NotificationScreen from "@/app/screens/NotificationScreen";
import { useAuth } from "@/app/providers/AuthProvider";
import supabase from "@/lib/supabse";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  const navigation = useNavigation();
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
    router.push("/screens/ShowProfileEdit"); // Navigate to
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
        <TouchableOpacity
          style={styles.DonateButton}
          onPress={() => {
            router.push("/screens/DonationScreen");
          }}
        >
          <Image source={require("../../Constatnts/Donate Icon.png")} />

          <Text style={{ color: "#000", fontWeight: "bold" }}>Donate</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default HomeScreen;
const styles = StyleSheet.create({
  DonateButton: {
    borderWidth: 1,
    borderColor: "#EBF2FA",
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    position: "absolute",
    top: 600, // Consider replacing this with a more responsive positioning like `bottom`.
    right: 20,
    height: 70,
    backgroundColor: "#EBF2FA",
    borderRadius: 100,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Shadow for Android
    elevation: 5,
  },
});
