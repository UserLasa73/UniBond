import { useAuth } from "@/app/providers/AuthProvider";
import { router } from "expo-router";
import { ChannelList } from "stream-chat-expo";

export default function MainTabScreen() {
  const { user } = useAuth();
  return (
    <ChannelList
      filters={{ members: { $in: [user?.id] } }}
      onSelect={(channel) => router.push(`/channel/${channel.cid}`)}
    />
  );
}
