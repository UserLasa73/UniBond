// HomeScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Alert, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/app/providers/AuthProvider";
import TopNavigationBar from "../../Components/TopNavigationBar";
import { supabase } from "../../../lib/supabse";
import PostItem from "../../screens/PostItem"; // Import the PostItem component

type Post = {
  id: number;
  content: string;
  likes: number;
  comments: { username: string; comment: string }[];
  is_public: boolean;
  user_id: string;
};

const HomeScreen: React.FC = () => {
  const router = useRouter();
  const { session } = useAuth();

  const [username, setUsername] = useState<string>("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (session) {
      getProfile();
      fetchPosts();
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

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("id, content, likes, comments, is_public, user_id")
        .or(`is_public.eq.true,user_id.eq.${session?.user?.id}`);

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
      Alert.alert("Error", "Could not fetch posts.");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: number) => {
    try {
      const post = posts.find((p) => p.id === postId);
      if (!post) throw new Error("Post not found");

      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, likes: p.likes + 1 } : p))
      );

      const { error } = await supabase
        .from("posts")
        .update({ likes: post.likes + 1 })
        .eq("id", postId);

      if (error) throw error;
    } catch (error) {
      console.error("Error liking post:", error);
      Alert.alert("Error", "Could not like the post.");
      fetchPosts();
    }
  };

  const handleCommentSubmit = async (postId: number, newComment: string) => {
    try {
      const post = posts.find((p) => p.id === postId);
      if (!post) throw new Error("Post not found");

      const updatedComments = [...post.comments, { username, comment: newComment }];
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, comments: updatedComments } : p
        )
      );

      const { error } = await supabase
        .from("posts")
        .update({ comments: updatedComments })
        .eq("id", postId);

      if (error) throw error;
    } catch (error) {
      console.error("Error adding comment:", error);
      Alert.alert("Error", "Could not add the comment.");
      fetchPosts();
    }
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
        data={posts}
        renderItem={({ item }) => (
          <PostItem
            post={item}
            username={username}
            onLike={handleLike}
            onCommentSubmit={handleCommentSubmit}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.postList}
      />
    </>
  );
};

const styles = StyleSheet.create({
  postList: {
    padding: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomeScreen;
