import { useState } from "react";
import { supabase } from "../lib/supabse";
import { Alert, View, Button, Image, StyleSheet,Text} from "react-native";
import * as ImagePicker from "expo-image-picker";

const [postImageUrl, setpostImageUrl] = useState<string | null>(null);

interface PostImageProps {
  onUpload: (imageUrl: string) => void;
}

export default function PostImage({ onUpload }: PostImageProps) {
  const [uploading, setUploading] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);

  async function uploadImage() {
    try {
      setUploading(true);

      // Open the image picker to select an image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false,
        allowsEditing: true,
        quality: 1,
        exif: false,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        console.log("User canceled image picker.");
        return;
      }

      const image = result.assets[0];
      if (!image.uri) {
        throw new Error("No image URI!");
      }

      // Fetch the image as an array buffer
      const arraybuffer = await fetch(image.uri).then((res) => res.arrayBuffer());

      // Generate a path for the image
      const fileExt = image.uri.split(".").pop()?.toLowerCase() ?? "jpeg";
      const path = `${Date.now()}.${fileExt}`;

      // Upload image to Supabase storage
      const { data, error } = await supabase.storage
        .from("post_images")
        .upload(path, arraybuffer, {
          contentType: image.mimeType ?? "image/jpeg",
        });

      if (error) {
        throw error;
      }

      // Return the image URL upon successful upload
      const imageUrl = data?.path;
      setImageUri(imageUrl || "");
      onUpload(imageUrl || "");
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
        <Image source={{ uri: `https://your-supabase-url/storage/v1/object/public/post_images/${imageUri}` }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Button title="Pick an Image" onPress={uploadImage} disabled={uploading} />
        </View>
      )}
      {uploading && <View style={styles.loader}><Text>Uploading...</Text></View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center" },
  image: { width: 200, height: 200, marginTop: 10 },
  imagePlaceholder: { width: 200, height: 200, justifyContent: "center", alignItems: "center", backgroundColor: "#f0f0f0" },
  loader: { marginTop: 10 },
});
