import React, { useEffect, useState } from "react";
import {
  View,
  Alert,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Text,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/app/providers/AuthProvider";
import TopNavigationBar from "../../Components/TopNavigationBar";
import { supabase } from "../../../lib/supabse";
import PostItem from "../../screens/PostItem";

type Post = {
  id: number;
  content: string;
  likes: number;
  comments: { username: string; comment: string }[];
  is_public: boolean;
  user_id: string;
};

type Event = {
  id: number;
  event_name: string;
  event_date: string;
  event_location: string;
  event_description: string;
};

const HomeScreen: React.FC = () => {
  const router = useRouter();
  const { session } = useAuth();

  const [username, setUsername] = useState<string>("");
  const [combinedData, setCombinedData] = useState<(Post | Event)[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (session) {
      getProfile();
      fetchCombinedData();
    }
  }, [session]);

  const getProfile = async () => {
    try {
      const profileId = session?.user?.id;
      if (!profileId) throw new Error("No user on the session!");

      const { data, error } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", profileId)
        .single();

      if (error) throw error;
      setUsername(data.username || "Anonymous");
    } catch (error) {
      console.error("Error fetching profile:", error);
      Alert.alert("Error", "Could not fetch user profile.");
    }
  };

  const fetchCombinedData = async () => {
    setLoading(true);
    try {
      const [postsResponse, eventsResponse] = await Promise.all([
        supabase
          .from("posts")
          .select("id, content, likes, comments, is_public, user_id")
          .or(`is_public.eq.true,user_id.eq.${session?.user?.id}`),
        supabase
          .from("events")
          .select(
            "id, event_name, event_date, event_location, event_description"
          ),
      ]);

      if (postsResponse.error || eventsResponse.error) {
        throw new Error(
          postsResponse.error?.message || eventsResponse.error?.message
        );
      }

      const posts = postsResponse.data.map((post: Post) => ({
        ...post,
        type: "post",
      }));
      const events = eventsResponse.data.map((event: Event) => ({
        ...event,
        type: "event",
      }));

      setCombinedData([...events, ...posts]); // Events first, then posts
    } catch (error) {
      console.error("Error fetching data:", error);
      Alert.alert("Error", "Could not fetch data.");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: number) => {
    try {
      setCombinedData((prev) =>
        prev.map((item) =>
          item.type === "post" && item.id === postId
            ? { ...item, likes: item.likes + 1 }
            : item
        )
      );

      const { error } = await supabase
        .from("posts")
        .update({
          likes: (combinedData.find((p) => p.id === postId) as Post).likes + 1,
        })
        .eq("id", postId);

      if (error) throw error;
    } catch (error) {
      console.error("Error liking post:", error);
      Alert.alert("Error", "Could not like the post.");
    }
  };

  const handleCommentSubmit = async (postId: number, newComment: string) => {
    try {
      setCombinedData((prev) =>
        prev.map((item) =>
          item.type === "post" && item.id === postId
            ? {
                ...item,
                comments: [...item.comments, { username, comment: newComment }],
              }
            : item
        )
      );

      const { error } = await supabase
        .from("posts")
        .update({
          comments: [
            ...(combinedData.find((p) => p.id === postId) as Post).comments,
            { username, comment: newComment },
          ],
        })
        .eq("id", postId);

      if (error) throw error;
    } catch (error) {
      console.error("Error adding comment:", error);
      Alert.alert("Error", "Could not add the comment.");
    }
  };

  const renderItem = ({ item }: { item: Post | Event }) => {
    if (item.type === "event") {
      const event = item as Event;
      return (
        <View style={styles.eventItem}>
          <Text style={styles.eventTitle}>{event.event_name}</Text>
          <Text style={styles.eventDetails}>Date: {event.event_date}</Text>
          <Text style={styles.eventDetails}>
            Location: {event.event_location}
          </Text>
          <Text style={styles.eventDetails}>
            Description: {event.event_description}
          </Text>
        </View>
      );
    } else if (item.type === "post") {
      const post = item as Post;
      return (
        <PostItem
          post={post}
          username={username}
          onLike={handleLike}
          onCommentSubmit={handleCommentSubmit}
        />
      );
    }
    return null;
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <>
      <TopNavigationBar
        userName={username}
        onProfilePress={() => router.push("/screens/ShowProfileEdit")}
        onNotificationPress={() => router.push("/screens/NotificationScreen")}
        onPostPress={() => router.push("/screens/PostScreen")}
      />

      <FlatList
        data={combinedData}
        renderItem={renderItem}
        keyExtractor={(item) =>
          `${item.type === "event" ? "event" : "post"}-${item.id}`
        }
        contentContainerStyle={styles.combinedList}
      />
    </>
  );
};

const styles = StyleSheet.create({
  combinedList: {
    padding: 16,
  },
  eventItem: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  eventDetails: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomeScreen;
