import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ShowProfileEdit() {
  const [fullname, setFullname] = useState("");
  return (
    <SafeAreaView>
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <TouchableOpacity
          style={{ position: "absolute", left: 0 }}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          {fullname || "Profile"}
        </Text>
      </View>
    </SafeAreaView>
  );
}
