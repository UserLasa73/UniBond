import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../providers/AuthProvider";
import { supabase } from "../lib/supabse";
import type { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { PostStackParamList } from "./PostNav";

const AddProjectScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation<StackNavigationProp<PostStackParamList>>();
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [timeline, setTimeline] = useState("");
  const [paymentDetails, setPaymentDetails] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  const handleInputChange = (
    setter: React.Dispatch<React.SetStateAction<any>>,
    setterName: string
  ) => {
    return (value: string) => {
      setter(value);
      setHasChanges(true);
    };
  };

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

  const handleProjectSubmit = async () => {
    if (!projectTitle || !projectDescription || !timeline || !paymentDetails) {
      alert("Please fill in all required fields!");
      return;
    }

    if (!user) {
      alert("User is not authenticated.");
      return;
    }

    const { id: userId } = user;
    const currentDate = new Date();
    const datePosted = currentDate.toLocaleDateString();
    const timePosted = currentDate.toLocaleTimeString();

    const { data, error } = await supabase.from("projects").insert([
      {
        user_id: userId,
        project_title: projectTitle,
        description: projectDescription,
        technologies: technologies,
        timeline: timeline,
        payment_details: paymentDetails,
        date_posted: datePosted,
        time_posted: timePosted,
      },
    ]);

    if (error) {
      alert("Error posting project: " + error.message);
    } else {
      alert("Project successfully posted!");
      navigation.navigate("PostScreen");
    }
  };

  const handleCancel = () => {
    setProjectTitle("");
    setProjectDescription("");
    setTechnologies("");
    setTimeline("");
    setPaymentDetails("");
    setHasChanges(false);
    navigation.navigate("PostScreen");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
        <Ionicons name="close" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.label}>Post a Project</Text>
      <TextInput
        style={styles.input}
        placeholder="Project Title"
        value={projectTitle}
        onChangeText={handleInputChange(setProjectTitle, "projectTitle")}
      />
      <TextInput
        style={[styles.input, { height: 100 }]}
        multiline
        placeholder="Project Description"
        value={projectDescription}
        onChangeText={handleInputChange(
          setProjectDescription,
          "projectDescription"
        )}
      />
      <TextInput
        style={styles.input}
        placeholder="Technologies (comma-separated)"
        value={technologies}
        onChangeText={handleInputChange(setTechnologies, "technologies")}
      />
      <TextInput
        style={styles.input}
        placeholder="Timeline"
        value={timeline}
        onChangeText={handleInputChange(setTimeline, "timeline")}
      />
      <TextInput
        style={styles.input}
        placeholder="Payment Details"
        value={paymentDetails}
        onChangeText={handleInputChange(setPaymentDetails, "paymentDetails")}
      />
      <TouchableOpacity style={styles.postButton} onPress={handleProjectSubmit}>
        <Text style={styles.postButtonText}>Post Project</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddProjectScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
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
