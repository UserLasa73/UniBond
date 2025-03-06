import { useState } from "react";
import { supabase } from "../lib/supabse";
import { useAuth } from "../providers/AuthProvider";
import { Alert, View, Text, TextInput, Button, StyleSheet } from "react-native";
import PostImage from "../Components/PostImage";

export default function CreatePostScreen() {
  const { session } = useAuth();
  const [content, setContent] = useState<string>("");
  const [mediaUrl, setMediaUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Handle post creation
  async function createPost() {
    try {
      setLoading(true);
      if (!session) {
        throw new Error("User not authenticated");
      }

      const { user } = session;

      const { data, error } = await supabase.from("posts").insert([
        {
          user_id: user?.id,
          content,
          media_url: mediaUrl,
          likes: 0,
          comments: [],
          is_public: true,
        },
      ]);

      if (error) throw error;

      Alert.alert("Post created successfully!");
      setContent("");  // Clear the content input field
      setMediaUrl("");  // Clear the image URL
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Error", error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a Post</Text>

      <TextInput
        style={styles.input}
        placeholder="Write something..."
        value={content}
        onChangeText={setContent}
      />

      <PostImage onUpload={(url) => setMediaUrl(url)} />

      <Button title={loading ? "Creating..." : "Create Post"} onPress={createPost} disabled={loading || !content || !mediaUrl} />

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: { height: 100, borderColor: "#ccc", borderWidth: 1, padding: 10, marginBottom: 20, textAlignVertical: "top" },
});
