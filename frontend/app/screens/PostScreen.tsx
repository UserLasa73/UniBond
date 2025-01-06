import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { Video, ResizeMode } from "expo-av";
import { useRouter } from "expo-router";
import PostOptionItem from "../Components/PostOptionItem";
import usePostParams from "../hooks/usePostParams";

const PostScreen = () => {
  const router = useRouter();
  const { content, media } = usePostParams();
  const [showPreview, setShowPreview] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedVisibility, setSelectedVisibility] = useState("Anyone");

  const handleOptionPress = (screen: string) => {
    router.push(`/screens/${screen}`);
  };

  const handlePostPress = () => {
    console.log("Post submitted with content:", content, "and media:", media);
    setShowPreview(false); // Hide the preview after posting
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleOptionSelect = (option: string) => {
    setSelectedVisibility(option);
    setModalVisible(false); // Close modal after selection
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("../(home)/(tabs)/Home")}>
          <MaterialIcons name="close" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Share Post</Text>
        <TouchableOpacity onPress={handlePostPress}>
          <Text style={styles.postButton}>Post</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.userInfo}>
        <View style={styles.profileImage}>
          <MaterialIcons name="person" size={40} color="#fff" />
        </View>
        <View style={styles.userDetails}>
          <Text style={styles.userName}>John Doe</Text>
          <TouchableOpacity
            style={styles.visibilitySelector}
            onPress={toggleModal}
          >
            <MaterialIcons name="public" size={16} color="#000" />
            <Text style={styles.visibilityText}>{selectedVisibility}</Text>
            <MaterialIcons name="arrow-drop-down" size={16} color="#000" />
          </TouchableOpacity>
        </View>
        {/* Modal for dropdown */}
        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={toggleModal}
        >
          <TouchableOpacity
            style={styles.modalBackground}
            onPress={toggleModal}
          >
            <View style={styles.modalContainer}>
              <TouchableOpacity
                style={styles.option}
                onPress={() => handleOptionSelect("Anyone")}
              >
                <Text style={styles.optionText}>Anyone</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.option}
                onPress={() => handleOptionSelect("My Network")}
              >
                <Text style={styles.optionText}>My Network</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>

      <Text style={styles.promptText}>What do you want to talk about?</Text>

      {showPreview && (
        <View style={styles.container}>
          <Text>Preview:</Text>
          <Text style={styles.promptText}>Content: {content}</Text>
          {media?.uri ? (
            media.type === "image" ? (
              <Image source={{ uri: media.uri }} style={styles.imagePreview} />
            ) : media.type === "video" ? (
              <Video
                source={{ uri: media.uri }}
                style={styles.imagePreview}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
              />
            ) : (
              <Text>Unsupported media type</Text>
            )
          ) : (
            <Text>No media available</Text>
          )}
        </View>
      )}

      <View style={styles.options}>
        <PostOptionItem
          label="Add a Post"
          icon={<Ionicons name="image-outline" size={24} color="#000" />}
          onPress={() => handleOptionPress("AddPostScreen")}
        />
        <PostOptionItem
          label="Add a Project"
          icon={<Ionicons name="folder" size={24} color="#000" />}
          onPress={() => handleOptionPress("AddProjectScreen")}
        />
        <PostOptionItem
          label="Share a Job"
          icon={<MaterialIcons name="work-outline" size={24} color="#000" />}
          onPress={() => handleOptionPress("AddJobScreen")}
        />
        <PostOptionItem
          label="Share an Event"
          icon={<MaterialIcons name="event" size={24} color="#000" />}
          onPress={() => handleOptionPress("AddEventScreen")}
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
  placeholderText: {
    marginTop: 20,
    fontSize: 14,
    color: "#aaa",
  },
  options: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 20,
  },
  imagePreview: {
    width: 200,
    height: 200,
    marginTop: 8,
    borderRadius: 8,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    width: 200,
  },
  option: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  optionText: {
    fontSize: 16,
    color: "#000",
    textAlign: "center",
  },
});
