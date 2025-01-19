import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  BackHandler,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { PostStackParamList } from "./PostNav";
import { useAuth } from "../providers/AuthProvider";
import { supabase } from "../lib/supabse";
import type { StackNavigationProp } from "@react-navigation/stack";

type Media = {
  uri: string;
  type?: string;
};

const AddJobScreen = () => {
  const navigation = useNavigation<StackNavigationProp<PostStackParamList>>();
  const { user } = useAuth();
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [location, setLocation] = useState("");
  const [media, setMedia] = useState<Media | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const backAction = () => {
      if (hasChanges) {
        Alert.alert("", "Discard the changes?", [
          { text: "Cancel", onPress: () => null, style: "cancel" },
          { text: "YES", onPress: () => navigation.navigate("PostScreen") },
        ]);
        return true;
      } else {
        navigation.navigate("PostScreen");
        return true;
      }
    };

    BackHandler.addEventListener("hardwareBackPress", backAction);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", backAction);
    };
  }, [hasChanges, navigation]);

  const handleJobSubmit = async () => {
    if (!jobTitle || (!jobDescription && !media)) {
      Alert.alert(
        "Error",
        "Please provide a job title and either a description or media."
      );
      return;
    }

    if (!user) {
      Alert.alert("Error", "User not authenticated.");
      return;
    }

    setIsLoading(true);

    let imageUrl = null;

    try {
      if (media) {
        const fileExt = media.uri.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const response = await fetch(media.uri);
        const fileData = await response.blob();

        const { error: uploadError } = await supabase.storage
          .from("job_images")
          .upload(`jobs/${fileName}`, fileData);

        if (uploadError) throw new Error(uploadError.message);

        const { data: publicUrlData } = supabase.storage
          .from("job_images")
          .getPublicUrl(`jobs/${fileName}`);

        imageUrl = publicUrlData?.publicUrl;
      }

      const { error } = await supabase.from("jobs").insert([
        {
          jobTitle,
          jobDescription,
          location,
          imageUrl,
          userId: user.id,
          datePosted: new Date().toISOString(),
        },
      ]);

      if (error) throw new Error(error.message);

      Alert.alert("Success", "Job posted successfully!");
      navigation.navigate("PostScreen");
    } catch (error) {
      console.error("Job submission error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setJobTitle("");
    setJobDescription("");
    setLocation("");
    setMedia(null);
    navigation.goBack();
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
      setMedia({ uri: asset.uri, type: asset.type || "image/jpeg" });
      setHasChanges(true);
    }
  };

  return (
    <View style={styles.container}>
      {isLoading && (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={styles.loadingIndicator}
        />
      )}
      <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
        <Ionicons name="close" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.label}>Post a Job</Text>
      <TextInput
        style={styles.input}
        placeholder="Job Title"
        value={jobTitle}
        onChangeText={(text) => {
          setJobTitle(text);
          setHasChanges(true);
        }}
      />
      <View style={styles.descriptionContainer}>
        <TouchableOpacity onPress={handleMediaPicker}>
          <Ionicons name="image-outline" size={24} style={styles.icon} />
        </TouchableOpacity>
        <TextInput
          style={styles.descriptionInput}
          multiline
          placeholder="Job Description (optional if media is selected)"
          value={jobDescription}
          onChangeText={(text) => {
            setJobDescription(text);
            setHasChanges(true);
          }}
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
        onChangeText={(text) => {
          setLocation(text);
          setHasChanges(true);
        }}
      />
      <TouchableOpacity style={styles.postButton} onPress={handleJobSubmit}>
        <Text style={styles.postButtonText}>Post</Text>
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
    minHeight: 100,
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
  loadingIndicator: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -12.5 }, { translateY: -12.5 }],
  },
});
