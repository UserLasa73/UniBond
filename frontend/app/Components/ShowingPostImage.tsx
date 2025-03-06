import { StyleSheet, View, Image, Text } from "react-native";

interface Props {
  mediaUrl: string | null;
  size?: number;
}

export default function ShowingPostImage({ mediaUrl, size = 200 }: Props) {
  const imageSize = { height: size, width: size };

  return (
    <View>
      {mediaUrl ? (
        <Image
          source={{ uri: mediaUrl }}
          style={[imageSize, styles.image]}
          accessibilityLabel="Post Image"
        />
      ) : (
        <View style={[imageSize, styles.noImage]}>
          <Text style={styles.noImageText}>No Image</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    borderRadius: 8,
    resizeMode: "cover",
  },
  noImage: {
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  noImageText: {
    color: "#888",
    fontSize: 14,
  },
});
