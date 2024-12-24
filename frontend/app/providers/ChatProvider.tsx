import * as React from "react";
import { StreamChat } from "stream-chat";
import { Chat, OverlayProvider } from "stream-chat-expo";
import { PropsWithChildren, useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "./AuthProvider";

export default function ChatProvider({ children }: PropsWithChildren) {
  const [isReady, SetIsReady] = React.useState(false);
  const { profile } = useAuth();
  if (!process.env.EXPO_PUBLIC_STREAM_API_KEY) {
    console.error(
      "Stream API key is missing. Check your environment variables."
    );
    return null;
  }
  const client = StreamChat.getInstance(process.env.EXPO_PUBLIC_STREAM_API_KEY);

  useEffect(() => {
    if (!profile) return;
    const connect = async () => {
      try {
        await client.connectUser(
          {
            id: profile?.id,
            name: profile?.full_name,
            image: "https://i.imgur.com/fR9Jz14.png",
          },
          client.devToken(profile?.id)
        );
        SetIsReady(true);

        // const channel = client.channel("messaging", "the_park", {
        //   name: "The Park",
        // });
        // await channel.create();
      } catch (error) {
        console.error("Error connecting user to Stream Chat:", error);
      }
    };

    connect();
    return () => {
      client.disconnectUser();
      SetIsReady(false);
    };
  }, [profile?.id]);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <OverlayProvider>
      <Chat client={client}>{children}</Chat>
    </OverlayProvider>
  );
}
