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
      checkUserDetails();
    } else {
      setLoading(false);
    }
  }, [user]);

  async function checkUserDetails() {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("has_completed_details")
        .eq("id", user?.id)
        .single();

      if (error) throw error;
      setIsNewUser(!data?.has_completed_details);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  if (isNewUser) {
    console.log("IS newuser", isNewUser);
    return <Redirect href="../screens/DetailsForStudents" />;
  }

  if (user) {
    return <Redirect href="/(home)/(tabs)/Home" />;
  }

  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
    </Stack>
  );
}
