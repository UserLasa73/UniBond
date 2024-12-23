import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

const AddPostScreen = () => {
  const [content, setContent] = useState("");

  const handlePostSubmit = () => {
    if (content.trim() === "") {
      alert("Post content cannot be empty!");
      return;
    }
    console.log("Post submitted:", content);
    // Add logic to send post to the server
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Create a Post</Text>
      <TextInput
        style={styles.input}
        multiline
        placeholder="What do you want to share?"
        value={content}
        onChangeText={setContent}
      />
      <Button title="Post" onPress={handlePostSubmit} />
    </View>
  );
};

export default AddPostScreen;

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
    height: 150,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    textAlignVertical: "top",
    marginBottom: 20,
  },
});
