import { useState } from "react";
import { supabase } from "../lib/supabse";
import { Alert, View, Button, Image, StyleSheet, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";

interface PostImageProps {
  onUpload: (imageUrl: string) => void;
}

export default function PostImage({ onUpload }: PostImageProps) {
  const [uploading, setUploading] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  
  async function uploadImage() {
    try {
      setUploading(true);

      // Open image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return;
      }

      const image = result.assets[0];
      if (!image.uri) {
        throw new Error("No image URI!");
      }

      // Convert image to a Blob
      const response = await fetch(image.uri);
      const blob = await response.blob();

      // Generate a unique file path
      const fileExt = image.uri.split(".").pop()?.toLowerCase() ?? "jpeg";
      const fileName = `${Date.now()}.${fileExt}`;

      // Upload image to Supabase
      const { data, error } = await supabase.storage
        .from("post_images")
        .upload(fileName, blob, {
          contentType: image.mimeType ?? "image/jpeg",
        });

      if (error) {
        throw error;
      }

      // Construct the full URL
      const fullImageUrl = `https://your-supabase-url/storage/v1/object/public/post_images/${data.path}`;
      
      setImageUri(fullImageUrl);
      onUpload(fullImageUrl); // Send full URL back to parent component
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setUploading(false);
    }
  }

  return (
    <View style={styles.container}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} />
      ) : (
        <Button title="Pick an Image" onPress={uploadImage} disabled={uploading} />
      )}
      {uploading && <Text>Uploading...</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center" },
  image: { width: 200, height: 200, marginTop: 10 },
});
