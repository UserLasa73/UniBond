import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  BackHandler,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useAuth } from "../providers/AuthProvider";
import PostOptionItem from "../Components/PostOptionItem";
import { useRoute, useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { PostStackParamList } from "./PostNav";
import { router } from "expo-router";

interface PostData {
  content?: string;
  imageUri?: string;
}

const PostScreen = () => {
  const route = useRoute();
  const navigation = useNavigation<StackNavigationProp<PostStackParamList>>();
  const { profile } = useAuth();

  const [postData, setPostData] = useState<PostData | null>(
    route.params || null
  );
  const [showPreview, setShowPreview] = useState(!!postData);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedVisibility, setSelectedVisibility] = useState("Anyone");

  const storageUrl =
    "https://jnqvgrycauzjnvepqorq.supabase.co/storage/v1/object/public/avatars/";
  const imageUrl = profile.avatar_url
    ? `${storageUrl}${profile.avatar_url}`
    : null;

  useEffect(() => {
    const backAction = () => {
      router.push("../(home)/(tabs)/Home");
      return true;
    };

    BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", backAction);
    };
  }, [navigation]);

  const handlePostPress = () => {
    setShowPreview(false);
  };

  const toggleModal = () => {
    setModalVisible((prev) => !prev);
  };

  const handleOptionSelect = (option: string) => {
    setSelectedVisibility(option);
    toggleModal();
  };

  const handleCancelPreview = () => {
    setShowPreview(false);
  };

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="close" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Share Post</Text>
        <TouchableOpacity onPress={handlePostPress}>
          <Text style={styles.postButton}>Post</Text>
        </TouchableOpacity>
      </View>

      {/* User Info Section */}
      <View style={styles.userInfo}>
        <View style={styles.profileImage}>
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={{ width: 50, height: 50, borderRadius: 25 }}
            />
          ) : (
            <MaterialIcons name="person" size={40} color="#fff" />
          )}
        </View>
        <View style={styles.userDetails}>
          <Text style={styles.userName}>
            {profile?.username || "Guest User"}
          </Text>
          <TouchableOpacity
            style={styles.visibilitySelector}
            onPress={toggleModal}
          >
            <MaterialIcons name="public" size={16} color="#000" />
            <Text style={styles.visibilityText}>{selectedVisibility}</Text>
            <MaterialIcons name="arrow-drop-down" size={16} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.promptText}>What do you want to talk about?</Text>

      {/* Conditionally Render Preview */}
      {postData && (postData.content || postData.imageUri) && (
        <View style={styles.previewContainer}>
          {/* Cancel Button */}
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancelPreview}
          >
            <Text style={styles.cancelText}>X</Text>
          </TouchableOpacity>

          {postData.content ? (
            <Text style={styles.promptText}>{postData.content}</Text>
          ) : null}
          {postData.imageUri ? (
            <Image
              source={{ uri: postData.imageUri }}
              style={styles.imagePreview}
              onError={(error) =>
                console.log("Image load error:", error.nativeEvent)
              }
            />
          ) : null}
        </View>
      )}

      {/* Post Options */}
      <View style={styles.options}>
        <PostOptionItem
          label="Add a Post"
          icon={<Ionicons name="image-outline" size={24} color="#000" />}
          onPress={() => navigation.navigate("AddPostScreen")}
        />
        <PostOptionItem
          label="Add a Project"
          icon={<Ionicons name="folder" size={24} color="#000" />}
          onPress={() => navigation.navigate("AddProjectScreen")}
        />
        <PostOptionItem
          label="Share a Job"
          icon={<MaterialIcons name="work-outline" size={24} color="#000" />}
          onPress={() => navigation.navigate("AddJobScreen")}
        />
        <PostOptionItem
          label="Share an Event"
          icon={<MaterialIcons name="event" size={24} color="#000" />}
          onPress={() => navigation.navigate("AddEventScreen")}
        />
      </View>

      {/* Visibility Selector Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={toggleModal}
      >
        <TouchableOpacity
          style={styles.modalBackground}
          onPress={toggleModal}
          activeOpacity={1}
        >
          <View style={styles.modalContainer}>
            {["Anyone", "My Network"].map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.option}
                onPress={() => handleOptionSelect(option)}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

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
  previewContainer: {
    borderColor: "#ddd",
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    marginBottom: 16,
    position: "relative",
  },
  cancelButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#FF4040",
    borderRadius: 20,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
  },
  options: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 20,
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
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
});

export default PostScreen;
