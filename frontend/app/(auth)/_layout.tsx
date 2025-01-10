import { Redirect, Slot, Stack } from "expo-router";
import { useAuth } from "../providers/AuthProvider";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabse";

export default function AuthLayout() {
  const { user } = useAuth();
  const [isNewUser, setIsNewUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      checkUserDetails();
    } else {
      setLoading(false); // No user logged in, stop loading
    }
  }, [user]);

  async function checkUserDetails() {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, has_completed_details")
        .eq("id", user?.id)
        .single();

      if (error) throw error;

      // Assuming `has_completed_details` is a boolean flag
      if (!data?.has_completed_details) {
        setIsNewUser(true);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return null; // Render nothing or a loading spinner
  }

  if (isNewUser) {
    return <Redirect href="/DetailsForStudents" />;
  }

  if (user) {
    return <Redirect href="../(home)/(tabs)/Home" />;
  }

  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
    </Stack>
  );
}
