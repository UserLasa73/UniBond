import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import PostOptionItem from "../Components/PostOptionItem";

const PostScreen = () => {
  const router = useRouter();

  const handleOptionPress = (option: string) => {
    console.log(`${option} selected`);
    //navigation or functionality for the selected option
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="close" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Share Post</Text>
        <TouchableOpacity onPress={() => console.log("Post pressed")}>
          <Text style={styles.postButton}>Post</Text>
        </TouchableOpacity>
      </View>

      {/* User Info Section */}
      <View style={styles.userInfo}>
        <View style={styles.profileImage}>
          <MaterialIcons name="person" size={40} color="#fff" />
        </View>
        <View style={styles.userDetails}>
          <Text style={styles.userName}>Rebecca Max</Text>
          <TouchableOpacity style={styles.visibilitySelector}>
            <MaterialIcons name="public" size={16} color="#000" />
            <Text style={styles.visibilityText}>Anyone</Text>
            <MaterialIcons name="arrow-drop-down" size={16} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Prompt Section */}
      <Text style={styles.promptText}>What do you want to talk about?</Text>

      {/* Post Options */}
      <View style={styles.options}>
        <PostOptionItem
          label="Add a Post"
          icon={<Ionicons name="image-outline" size={24} color="#000" />}
          onPress={() => handleOptionPress("Add a Post")}
        />
        <PostOptionItem
          label="Add a Project"
          icon={<Ionicons name="folder" size={24} color="#000" />}
          onPress={() => handleOptionPress("Add a Project")}
        />
        <PostOptionItem
          label="Share a Job"
          icon={<MaterialIcons name="work-outline" size={24} color="#000" />}
          onPress={() => handleOptionPress("Share a Job")}
        />
        <PostOptionItem
          label="Share an Event"
          icon={<MaterialIcons name="event" size={24} color="#000" />}
          onPress={() => handleOptionPress("Share an Event")}
        />
      </View>
    </View>
  );
};

export default PostScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  postButton: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007BFF",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  userDetails: {
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  visibilitySelector: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
  },
  visibilityText: {
    fontSize: 14,
    color: "#000",
    marginLeft: 4,
    marginRight: 4,
  },
  promptText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 16,
  },
  options: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 20,
  },
});
