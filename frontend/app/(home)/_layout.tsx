import { Redirect, Slot, Stack } from "expo-router";
import { useEffect } from "react";
import { StreamChat } from "stream-chat";
import { Chat, OverlayProvider } from "stream-chat-expo";
import ChatProvider from "../providers/ChatProvider";
import { useAuth } from "../providers/AuthProvider";

const client = StreamChat.getInstance("pdcu7kcrw67e");
export default function HomeLayout() {
  const { user } = useAuth();
  if (!user) {
    return <Redirect href="../Components/GetStart" />;
  }
  return (
    <OverlayProvider>
      <Chat client={client}>
        <ChatProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </ChatProvider>
      </Chat>
    </OverlayProvider>
  );
}
