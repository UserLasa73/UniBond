import { useLocalSearchParams } from "expo-router";

interface Media {
  uri: string;
  type?: string;
  duration?: number; // added duration for videos
}

const usePostParams = () => {
  const { content, media: mediaParam } = useLocalSearchParams();

  let media: Media | null = null;

  if (typeof mediaParam === "string") {
    try {
      const parsed = JSON.parse(mediaParam);
      if (parsed && typeof parsed === "object" && "uri" in parsed) {
        media = parsed as Media;
      }
    } catch (error) {
      console.error("Error parsing media parameter:", error);
    }
  }

  return { content, media };
};

export default usePostParams;
