import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import {
  Channel,
  MessageInput,
  MessageList,
  useChatContext,
} from "stream-chat-react-native";
import { Channel as ChannelType } from "stream-chat";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function ChannelScreen() {
  const [channel, setChannel] = useState<ChannelType | null>(null);
  const { cid } = useLocalSearchParams<{ cid: string }>();
  const { client } = useChatContext();

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const channels = await client.queryChannels({ id: cid });
        if (channels.length > 0) {
          setChannel(channels[0]);
        } else {
          console.log("No channel found with the specified ID.");
        }
      } catch (error) {
        console.log("Error fetching channel:", error);
      }
    };

    if (cid) {
      fetchChannel();
    }
  }, [cid]);

  if (!channel) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <Channel channel={channel}>
        <MessageList />
        <MessageInput />
      </Channel>
    </SafeAreaProvider>
  );
}
