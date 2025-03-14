import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../providers/AuthProvider";
import { supabase } from "../lib/supabse";

const AddJobScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [skills, setSkills] = useState("");
  const [deadline, setDeadline] = useState("");
  const [jobPhone, setJobPhone] = useState("");
  const [jobEmail, setJobEmail] = useState("");
  const [jobWebsite, setJobWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [media, setMedia] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Media picker for image selection
  const handleMediaPicker = useCallback(async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission Required", "You need to allow access to your media library.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets?.length) {
      const asset = result.assets[0]; // Access the first asset
      setMedia(asset.uri); // Set the URI of the image
    }
  }, []);

  // Function to upload the image to Supabase storage
  const uploadImage = async (imageUri: string) => {
    try {
      const fileExt = imageUri.split(".").pop();
      const imageName = `${Date.now()}.${fileExt}`;
      const response = await fetch(imageUri);
      const fileData = await response.arrayBuffer();

      const { data, error } = await supabase.storage
        .from("job_Images")
        .upload(`${imageName}`, fileData);

      if (error) throw new Error(error.message);

      return data?.path; // Return the stored image name
    } catch (error) {
      console.error("Image upload error:", error);
      return null;
    }
  };

  // Function to handle job posting
  const handleJobSubmit = useCallback(async () => {
    if (!title || !company) {
      Alert.alert("Error", "Please fill all the required fields.");
      return;
    }

    setIsLoading(true);
    let imageName = null;

    try {
      if (media) {
        console.log("Uploading image...");
        imageName = await uploadImage(media);
      }

      console.log("Inserting job data...");
      const { error } = await supabase.from("jobs").insert([
        {
          title,
          company,
          location,
          type,
          skills,
          deadline: deadline.trim() === "" ? null : deadline,
          job_phone: jobPhone,
          job_email: jobEmail,
          job_website: jobWebsite,
          description,
          image_url: imageName ? imageName : null, // Store only the image name
          user_id: user?.id,
        },
      ]);

      if (error) throw new Error(error.message);

      Alert.alert("Success", "Job posted successfully!");
      navigation.goBack();
    } catch (error: any) {
      Alert.alert("Error", error.message);
      console.error("Job submission error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [title, company, location, type, skills, deadline, jobPhone, jobEmail, jobWebsite, description, media, user, navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          {isLoading && <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />}

          <Text style={styles.label}>Post a Job</Text>

          <Text style={styles.label}>Job Title <Text style={styles.required}>*</Text> </Text>
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
          />
          <Text style={styles.label}>Company <Text style={styles.required}>*</Text> </Text>
          <TextInput
            style={styles.input}
            placeholder="Company"
            value={company}
            onChangeText={setCompany}
          />
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            placeholder="Location"
            value={location}
            onChangeText={setLocation}
          />
          <Text style={styles.label}>Job Type</Text>
          <TextInput
            style={styles.input}
            placeholder="Job Type (e.g., Full-time)"
            value={type}
            onChangeText={setType}
          />
          <Text style={styles.label}>Skills</Text>
          <TextInput
            style={styles.input}
            placeholder="Skills (comma separated)"
            value={skills}
            onChangeText={setSkills}
          />
          <Text style={styles.label}>Application Deadline</Text>
          <TextInput
            style={styles.input}
            placeholder="Application Deadline"
            value={deadline}
            onChangeText={setDeadline}
          />
          <Text style={styles.label}>Phone (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Phone (optional)"
            value={jobPhone}
            onChangeText={setJobPhone}
          />
          <Text style={styles.label}>Email (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Email (optional)"
            value={jobEmail}
            onChangeText={setJobEmail}
          />
          <Text style={styles.label}>Website (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Website (optional)"
            value={jobWebsite}
            onChangeText={setJobWebsite}
          />
          <Text style={styles.label}>Job Description</Text>
          <TextInput
            style={styles.input}
            placeholder="Job Description"
            value={description}
            onChangeText={setDescription}
          />

          <TouchableOpacity onPress={handleMediaPicker}>
            <Ionicons name="image-outline" size={24} />
            <Text>Select Image</Text>
          </TouchableOpacity>

          {media && <Image source={{ uri: media }} style={styles.imagePreview} />}

          <TouchableOpacity style={styles.postButton} onPress={handleJobSubmit}>
            <Text style={styles.postButtonText}>Post Job</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddJobScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 20,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    marginTop: 10,
  },
  required: {
    color: "red",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 5,
    marginVertical: 10,
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
  },
});
