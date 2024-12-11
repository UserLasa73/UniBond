import ChatProvider from "@/app/providers/ChatProvider";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { StreamChat } from "stream-chat";

export default function HomeLayout() {
  // Ensure API key is defined
  if (!process.env.EXPO_PUBLIC_STREAM_API_KEY) {
    console.error(
      "Stream API key is missing. Check your environment variables."
    );
    return null;
  }

  // Initialize StreamChat client
  const client = StreamChat.getInstance(process.env.EXPO_PUBLIC_STREAM_API_KEY);

  // Cleanup client on unmount if necessary
  useEffect(() => {
    return () => {
      client.disconnectUser?.();
    };
  }, []);

  return (
    <ChatProvider>
      <Stack />
    </ChatProvider>
  );
}
