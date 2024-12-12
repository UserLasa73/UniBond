import ChatProvider from "@/app/providers/ChatProvider";
import { Stack } from "expo-router";
import { Text } from "react-native";

export default function HomeLayout() {
  return (
    <ChatProvider>
      <Stack />
      <Text>dhfjdhf</Text>
    </ChatProvider>
  );
}
