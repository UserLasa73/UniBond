import { useEffect, useState } from "react";
import { ActivityIndicator, View, Text } from "react-native";
import { supabase } from "../lib/supabse";
import { useAuth } from "../providers/AuthProvider";
import { useChatContext } from "stream-chat-expo";
import { useLocalSearchParams, router } from "expo-router";

export default function UserScreen() {
  const { userId } = useLocalSearchParams(); // Get userId from search params
  const { client } = useChatContext();
  const { user: me } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndStartChat = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single(); // Fetch the specific user profile

      if (error || !profile) {
        console.error("Error fetching user:", error || "User not found");
        setLoading(false);
        return;
      }

      try {
        const channel = client.channel("messaging", {
          members: [me?.id, profile.id],
        });
        await channel.watch();
        router.replace(`/(home)/channel/${channel.cid}`); // Redirect to chat
      } catch (chatError) {
        console.error("Error starting chat:", chatError);
      }

      setLoading(false);
    };

    fetchUserAndStartChat();
  }, [userId, client, me]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>No user found or unable to start chat.</Text>
    </View>
  );
}
