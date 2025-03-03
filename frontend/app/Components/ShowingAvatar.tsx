import { useState, useEffect } from "react";
import { supabase } from "../lib/supabse";
import { StyleSheet, View, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";

interface Props {
  size: number;
  url: string | null;
  onUpload: (filePath: string) => void;
  gender?: "male" | "female"; // Add gender as a prop
}

export default function ShowingAvatar({
  url,
  size = 150,
  onUpload,
  gender = "male", // Default to male if gender is not provided
}: Props) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const avatarSize = { height: size, width: size };

  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage
        .from("avatars")
        .download(path);

      if (error) {
        throw error;
      }

      const fr = new FileReader();
      fr.readAsDataURL(data);
      fr.onload = () => {
        setAvatarUrl(fr.result as string);
      };
    } catch (error) {
      if (error instanceof Error) {
        console.log("Error downloading image: ", error.message);
      }
    }
  }

  // Default avatar images based on gender
  const defaultMaleAvatar = require("../Constatnts/Male.jpg"); // Replace with your male avatar path
  const defaultFemaleAvatar = require("../Constatnts/Female.jpg"); // Replace with your female avatar path

  return (
    <View>
      {avatarUrl ? (
        <Image
          source={{ uri: avatarUrl }}
          accessibilityLabel="Avatar"
          style={[avatarSize, styles.avatar, styles.image]}
        />
      ) : (
        <Image
          source={gender === "male" ? defaultMaleAvatar : defaultFemaleAvatar}
          accessibilityLabel="Default Avatar"
          style={[avatarSize, styles.avatar, styles.image]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 5,
    overflow: "hidden",
    maxWidth: "100%",
    resizeMode: "stretch",
    height: 150,
    width: 150,
    marginBottom: 20,
  },
  image: {
    objectFit: "cover",
    paddingTop: 0,
    borderRadius: 999,
  },
  noImage: {
    backgroundColor: "#333",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "rgb(200, 200, 200)",
    borderRadius: 5,
  },
});
