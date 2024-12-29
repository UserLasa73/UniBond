import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";

type Media = {
  uri: string;
  type?: string;
};

const AddJobScreen = () => {
  const router = useRouter();
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [location, setLocation] = useState("");
  const [media, setMedia] = useState<Media | null>(null);

  const handleJobSubmit = () => {
    if (!jobTitle || !jobDescription) {
      Alert.alert("Error", "Please fill in all required fields!");
      return;
    }
    console.log("Job submitted:", {
      jobTitle,
      jobDescription,
      location,
      media,
    });
    // Add logic to send job details to the server
  };

  const handleCancel = () => {
    setJobTitle("");
    setJobDescription("");
    setLocation("");
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
      mediaTypes: ImagePicker.MediaTypeOptions.All, // Allow all media types
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
      <Text style={styles.label}>Post a Job</Text>
      <TextInput
        style={styles.input}
        placeholder="Job Title"
        value={jobTitle}
        onChangeText={setJobTitle}
      />
      <View style={styles.descriptionContainer}>
        <TouchableOpacity onPress={handleMediaPicker}>
          <Ionicons name="image-outline" size={24} style={styles.icon} />
        </TouchableOpacity>
        <TextInput
          style={styles.descriptionInput}
          multiline
          placeholder="Job Description"
          value={jobDescription}
          onChangeText={setJobDescription}
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
      <TextInput
        style={styles.input}
        placeholder="Location (optional)"
        value={location}
        onChangeText={setLocation}
      />
      <TouchableOpacity style={styles.postButton} onPress={handleJobSubmit}>
        <Text style={styles.postButtonText}>Post Job</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddJobScreen;

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
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  descriptionContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  icon: {
    marginRight: 10,
    marginTop: 8,
  },
  descriptionInput: {
    flex: 1,
    textAlignVertical: "top",
    minHeight: 100, // Minimum height for Job Description
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
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
