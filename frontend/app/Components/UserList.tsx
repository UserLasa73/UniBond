import { View, Text, Pressable } from "react-native";
import { useChatContext } from "stream-chat-expo";
import { useAuth } from "../providers/AuthProvider";
import { router } from "expo-router";

const UserList = ({ user }) => {
  const { client } = useChatContext();
  const { user: me } = useAuth();
  const onPress = async () => {
    const channel = client.channel("messaging", {
      members: [me?.id, user.id],
    });
    await channel.watch();
    router.replace(`/(home)/channel/${channel.cid}`);
  };
  return (
    <Pressable
      onPress={onPress}
      style={{
        padding: 15,
        backgroundColor: "#fff",
      }}
    >
      <Text style={{ fontWeight: "bold" }}>{user.full_name}</Text>
    </Pressable>
  );
};
export default UserList;
