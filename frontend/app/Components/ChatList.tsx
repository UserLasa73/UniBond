import { SafeAreaView, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

const ChatList = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <View style={{}}>
          <Text>Aathif</Text>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};
export default ChatList;
