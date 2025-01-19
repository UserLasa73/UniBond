import { useAuth } from "@/app/providers/AuthProvider";
import { Link, router, Stack } from "expo-router";
import { ChannelList } from "stream-chat-expo";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import UserScreen from "../user";

export default function MainTabScreen() {
  const { user } = useAuth();

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
        }}
      />
      <ChannelList
        filters={{ members: { $in: [user?.id] } }}
        onSelect={(channel) => router.push(`/channel/${channel.cid}`)}
      />
    </>
  );
}
