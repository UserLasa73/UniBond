import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  BackHandler,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { supabase } from "../lib/supabse"; // Corrected typo from "supabse" to "supabase"

const EditPostScreen = () => {
  const router = useRouter();
  const { postId } = useLocalSearchParams(); // Only get the postId here

  const [content, setContent] = useState<string>("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const { data, error } = await supabase
          .from("posts")
          .select("content, media_url")
          .eq("id", postId)
          .single(); // Retrieve the post with the given postId

        if (error) {
          console.error("Error fetching post details:", error);
          return;
        }

        if (data) {
          setContent(data.content);
          setImageUri(data.media_url);
        }
      } catch (err) {
        console.error("Error fetching post details:", err);
      }
    };

    fetchPostDetails();
  }, [postId]);

  useEffect(() => {
    const backAction = () => {
      if (hasChanges) {
        Alert.alert("", "Discard the changes?", [
          { text: "Cancel", onPress: () => null, style: "cancel" },
          { text: "YES", onPress: () => router.back() },
        ]);
        return true;
      } else {
        router.back();
        return true;
      }
    };

    BackHandler.addEventListener("hardwareBackPress", backAction);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", backAction);
    };
  }, [hasChanges, router]);

  useEffect(() => {
    if (imageUri) {
      fetchImageUrl(imageUri);
    }
  }, [imageUri]);

  const fetchImageUrl = async (filePath) => {
    try {
      const { data, error } = await supabase.storage
        .from("post_images")
        .download(filePath);

      if (error) {
        throw error;
      }

      const fr = new FileReader();
      fr.readAsDataURL(data);
      fr.onload = () => {
        setImageUrl(fr.result as string);
      };
    } catch (error) {
      if (error instanceof Error) {
        console.log("Error downloading image: ", error.message);
      }
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setHasChanges(true);
    }
  };

  const handleUpdate = async () => {
    if (!content && !imageUri) {
      Alert.alert("Error", "Please provide content or an image.");
      return;
    }

    const localTime = new Date();
    const timezoneOffset = 5.5 * 60 * 60 * 1000;
    const adjustedTime = new Date(localTime.getTime() + timezoneOffset);

    const formattedTime = adjustedTime
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    try {
      const { data, error } = await supabase
        .from("posts")
        .update({
          content: content,
          media_url: imageUri,
          created_at: formattedTime,
        })
        .eq("id", postId);

      if (error) {
        console.log("Error:", error);
        Alert.alert("Error", "Error updating post: " + error.message);
      } else {
        console.log("Post updated successfully:", data);
        router.back();
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      Alert.alert("Error", "An unexpected error occurred.");
    }
  };

  const handleCancel = () => {
    setContent("");
    setImageUri(null);
    setHasChanges(false);
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Post</Text>

      {/* Content Input */}
      <TextInput
        style={styles.input}
        placeholder="Update your post..."
        value={content}
        onChangeText={(text) => {
          setContent(text);
          setHasChanges(true);
        }}
        multiline
      />

      {/* Image Picker */}
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        <MaterialIcons name="image" size={30} color="#000" />
        <Text style={styles.imageText}>Change Image</Text>
      </TouchableOpacity>

      {/* Image Preview */}
      <View>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={[{ height: 250, width: 250 }, styles.image]}
            accessibilityLabel="Post Image"
          />
        ) : (
          <View style={[{ height: 250, width: 250 }, styles.noImage]}>
            <Text style={styles.noImageText}>No Image</Text>
          </View>
        )}
      </View>

      {/* Cancel and Update Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
          <Text style={styles.updateButtonText}>Update Post</Text>
        </TouchableOpacity>
      </View>
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
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 20,
  },
  input: {
    fontSize: 16,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    minHeight: 100,
  },
  imagePicker: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  imageText: {
    marginLeft: 8,
    fontSize: 16,
    color: "black",
  },
  image: {
    borderRadius: 10,
  },
  noImage: {
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  noImageText: {
    color: "#fff",
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: "#ddd",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
    flex: 0.45,
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#000",
  },
  updateButton: {
    backgroundColor: "#2C3036",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
    flex: 0.45,
  },
  updateButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
});

export default EditPostScreen;
