import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

const AddProjectScreen = () => {
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [technologies, setTechnologies] = useState("");

  const handleProjectSubmit = () => {
    if (!projectTitle || !projectDescription) {
      alert("Please fill in all required fields!");
      return;
    }
    console.log("Project submitted:", {
      projectTitle,
      projectDescription,
      technologies,
    });
    // Add logic to send project details to the server
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Post a Project</Text>
      <TextInput
        style={styles.input}
        placeholder="Project Title"
        value={projectTitle}
        onChangeText={setProjectTitle}
      />
      <TextInput
        style={[styles.input, { height: 100 }]}
        multiline
        placeholder="Project Description"
        value={projectDescription}
        onChangeText={setProjectDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Technologies (comma-separated)"
        value={technologies}
        onChangeText={setTechnologies}
      />
      <Button title="Post Project" onPress={handleProjectSubmit} />
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
});
