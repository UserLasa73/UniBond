import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

type Media = {
  uri: string;
  type?: string;
};

const AddPostScreen = () => {
  const router = useRouter();
  const [content, setContent] = useState<string>("");
  const [media, setMedia] = useState<Media | null>(null);

  const handlePostSubmit = () => {
    if (content.trim() === "") {
      Alert.alert("Error", "Post content cannot be empty!");
      return;
    }
    const mediaUri = media?.uri ?? null;

    router.push({
      pathname: "/screens/PostScreen",
      params: { content, media: mediaUri },
    });
  };

  const handleCancel = () => {
    setContent("");
    setMedia(null);
    router.back();
  };

  const handleMediaPicker = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Required",
        "You need to allow access to your media library."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets?.length) {
      const asset = result.assets[0];
      setMedia({ uri: asset.uri, type: asset.type });
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
        <Ionicons name="close" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.label}>Create a Post</Text>
      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={handleMediaPicker}>
          <Ionicons name="image-outline" size={24} style={styles.icon} />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          multiline
          placeholder="What do you want to share?"
          value={content}
          onChangeText={setContent}
        />
      </View>

      {media && (
        <View style={styles.mediaPreview}>
          {media.type === "image" ? (
            <Image source={{ uri: media.uri }} style={styles.imagePreview} />
          ) : (
            <Text style={styles.videoPreviewText}>Video selected</Text>
          )}
        </View>
      )}

      <TouchableOpacity style={styles.postButton} onPress={handlePostSubmit}>
        <Text style={styles.postButtonText}>Post</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddPostScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    position: "relative",
  },
  cancelButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 20,
  },
  icon: {
    marginRight: 10,
    marginTop: 8,
  },
  input: {
    flex: 1,
    textAlignVertical: "top",
    minHeight: 150,
  },
  mediaPreview: {
    marginBottom: 20,
    alignItems: "center",
  },
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 5,
  },
  videoPreviewText: {
    fontSize: 16,
    color: "#555",
  },
  postButton: {
    backgroundColor: "#2C3036",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  postButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
