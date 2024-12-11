import * as React from "react";
import { StreamChat } from "stream-chat";
import { Chat, OverlayProvider } from "stream-chat-react-native";
import { PropsWithChildren, useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function ChatProvider({ children }: PropsWithChildren) {
  const [isReady, SetIsReady] = React.useState(false);
  // Ensure API key is defined
  if (!process.env.EXPO_PUBLIC_STREAM_API_KEY) {
    console.error(
      "Stream API key is missing. Check your environment variables."
    );
    return null;
  }
  const client = StreamChat.getInstance(process.env.EXPO_PUBLIC_STREAM_API_KEY);

  // Initialize StreamChat client
  useEffect(() => {
    const connect = async () => {
      try {
        await client.connectUser(
          {
            id: "jlahey",
            name: "Jim Lahey",
            image: "https://i.imgur.com/fR9Jz14.png",
          },
          client.devToken("jlahey")
        );
        SetIsReady(true);
        // Optionally create a channel if necessary
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
  }, [client]);

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
