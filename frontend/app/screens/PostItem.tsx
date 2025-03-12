import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  FlatList,
  Animated,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../lib/supabse"; // Import the Supabase client

const PostItem = ({ post, username, onLike, onCommentSubmit }) => {
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const bounceAnim = new Animated.Value(1);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const postImageSize = 300;


  useEffect(() => {
    if (post.media_url) {
      fetchImageUrl(post.media_url);
    }
  }, [post.media_url]);

  // Fetch the image URL directly from Supabase Storage
  const fetchImageUrl = async (filePath) => {

    // const { data, error } = await supabase.storage
    //   .from("post_images")
    //   .getPublicUrl(filePath);

    // if (error) {
    //   console.error("Error fetching image:", error);
    // } else {
    //   setImageUrl(data.media_url);
    //   console.log("test"+data.media_url)
    // }

    try {
      const { data, error } = await supabase.storage
        .from("post_images")
        .download(filePath);
      
      if (error) {
        throw error;
      }

      const fr = new FileReader();
      fr.readAsDataURL(data);
      fr.onload = () => {
        setImageUrl(fr.result as string);
      };
    } catch (error) {
      if (error instanceof Error) {
        console.log("Error downloading image: ", error.message);
      }
    }
  };


  const handleCommentSubmit = () => {
    if (!newComment.trim()) {
      alert("Comment cannot be empty!");
      return;
    }

    try {
      onCommentSubmit(post.id, newComment);
      setNewComment("");
      setShowComments(false);
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to add comment. Please try again.");
    }
  };

  const handleLikeToggle = () => {
    const newHasLiked = !hasLiked;
    const newLikeCount = newHasLiked ? likeCount + 1 : likeCount - 1;

    setHasLiked(newHasLiked);
    setLikeCount(newLikeCount);

    Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(bounceAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      onLike(post.id, newHasLiked);
    } catch (error) {
      console.error("Error updating like count:", error);
      setHasLiked(!newHasLiked);
      setLikeCount(likeCount);
      alert("Failed to update like. Please try again.");
    }
  };
 

  const storageUrl =
  "https://jnqvgrycauzjnvepqorq.supabase.co/storage/v1/object/public/post_images//"; // Storage URL for post images



  return (
    <View style={styles.postContainer}>
      {/* Display the content of the post */}
      <Text style={styles.postContent}>{post.content}</Text>

      {/* Display the post image if media_url is present */}
      <View>
        {imageUrl ? (
          <Image
            source={{ uri:imageUrl}}
            style={[{ height: postImageSize, width: postImageSize }, styles.image]}
            accessibilityLabel="Post Image"
          />
        ) : (

          <View style={[{ height: postImageSize, width: postImageSize }, styles.noImage]}>
            <Text style={styles.noImageText}>No Image</Text>
          </View>
        )}
      </View>

      <View style={styles.postActions}>
        {/* Like button */}
        <TouchableOpacity onPress={handleLikeToggle} style={styles.actionButton}>
          <Animated.View style={{ transform: [{ scale: bounceAnim }] }}>
            <Ionicons name="heart" size={24} color={hasLiked ? "red" : "gray"} />
          </Animated.View>
          <Text>{likeCount}</Text>
        </TouchableOpacity>

        {/* Comment button */}
        <TouchableOpacity onPress={() => setShowComments(!showComments)} style={styles.actionButton}>
          <Ionicons name="chatbubble" size={24} color="gray" />
          <Text>{post.comments.length}</Text>
        </TouchableOpacity>
      </View>

      {/* Comments Section */}
      {showComments && (
        <View style={styles.commentsContainer}>
          <FlatList
            data={post.comments}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.comment}>
                <Text style={styles.commentUsername}>{item.username}</Text>
                <Text style={styles.commentText}>{item.comment}</Text>
              </View>
            )}
          />

          {/* New Comment Input */}
          <KeyboardAvoidingView behavior="padding">
            <TextInput
              style={styles.commentInput}
              placeholder="Write a comment..."
              value={newComment}
              onChangeText={setNewComment}
              onSubmitEditing={handleCommentSubmit}
            />
          </KeyboardAvoidingView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  postContent: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
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
  postActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  commentsContainer: {
    marginTop: 8,
    marginBottom: 8,
  },
  comment: {
    marginBottom: 8,
  },
  commentUsername: {
    fontWeight: "bold",
    marginBottom: 4,
    color: "#444",
  },
  commentText: {
    fontSize: 14,
    color: "#555",
  },
  commentInput: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    backgroundColor: "#f9f9f9",
  },
});

export default PostItem;
