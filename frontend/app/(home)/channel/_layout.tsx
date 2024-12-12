import { Stack } from "expo-router";

export default function ChatStack() {
  return (
    <Stack>
      <Stack.Screen name="[cid]" options={{ headerShown: false }} />
    </Stack>
  );
}
