import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

const AddJobScreen = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [location, setLocation] = useState("");

  const handleJobSubmit = () => {
    if (!jobTitle || !jobDescription) {
      alert("Please fill in all required fields!");
      return;
    }
    console.log("Job submitted:", { jobTitle, jobDescription, location });
    // Add logic to send job details to the server
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Post a Job</Text>
      <TextInput
        style={styles.input}
        placeholder="Job Title"
        value={jobTitle}
        onChangeText={setJobTitle}
      />
      <TextInput
        style={[styles.input, { height: 100 }]}
        multiline
        placeholder="Job Description"
        value={jobDescription}
        onChangeText={setJobDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Location (optional)"
        value={location}
        onChangeText={setLocation}
      />
      <Button title="Post Job" onPress={handleJobSubmit} />
    </View>
  );
};

export default AddJobScreen;

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
