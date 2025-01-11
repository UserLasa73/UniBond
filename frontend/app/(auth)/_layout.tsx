import { Stack } from "expo-router";
import { Redirect } from "expo-router";
import { useAuth } from "../providers/AuthProvider";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabse";
import { ActivityIndicator, View } from "react-native";

export default function AuthLayout() {
  const { user } = useAuth();
  const [isNewUser, setIsNewUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      checkUserDetails(); // Check user details on login
    } else {
      setLoading(false);
      setIsNewUser(true); // Reset when user logs out
    }
  }, [user]);

  // This function checks if the user has completed the required details
  async function checkUserDetails() {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("has_completed_details")
        .eq("id", user?.id)
        .single();

      if (error) throw error;

      // If user has completed details, set `isNewUser` to false
      setIsNewUser(!data?.has_completed_details);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false); // Stop the loading state once done
    }
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  // If user has not completed details or is new, redirect to DetailsForStudents
  if (!isNewUser) {
    return <Redirect href="../screens/DetailsForStudents" />;
  }

  // If the user is authenticated and has completed details, redirect to the home page
  if (user) {
    return <Redirect href="/(home)/(tabs)/Home" />;
  }

  // If user is not logged in, show login screen
  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
    </Stack>
  );
}
