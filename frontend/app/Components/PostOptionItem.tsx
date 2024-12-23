import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";

interface PostOptionItemProps {
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
}

const PostOptionItem: React.FC<PostOptionItemProps> = ({
  label,
  icon,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <View style={styles.icon}>{icon}</View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

export default PostOptionItem;

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  icon: {
    marginRight: 10,
  },
  label: {
    fontSize: 16,
    color: "#333",
  },
});
