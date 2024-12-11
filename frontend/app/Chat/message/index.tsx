import { ChannelList } from "stream-chat-react-native";
import { router } from "expo-router";
export default function ChatList() {
  return (
    <ChannelList
      onSelect={(channel) => router.push(`/channel/${channel.cid}`)}
    />
  );
}
