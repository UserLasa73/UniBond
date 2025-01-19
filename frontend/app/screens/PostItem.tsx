import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  FlatList,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Post = {
  id: number;
  content: string;
  likes: number;
  comments: { username: string; comment: string }[];
  is_public: boolean;
  user_id: string;
};

type PostItemProps = {
  post: Post;
  username: string;
  onLike: (postId: number, hasLiked: boolean) => void;
  onCommentSubmit: (postId: number, newComment: string) => void;
};

const PostItem: React.FC<PostItemProps> = ({
  post,
  username,
  onLike,
  onCommentSubmit,
}) => {
  const [newComment, setNewComment] = useState<string>("");
  const [showComments, setShowComments] = useState<boolean>(false);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(post.likes);
  const bounceAnim = new Animated.Value(1); // For like button animation

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

    // Animate the like button
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

  return (
    <View style={styles.postContainer}>
      <Text style={styles.postContent}>{post.content}</Text>
      <View style={styles.postActions}>
        {/* Like button */}
        <TouchableOpacity
          onPress={handleLikeToggle}
          style={styles.actionButton}
        >
          <Animated.View style={{ transform: [{ scale: bounceAnim }] }}>
            <Ionicons
              name="heart"
              size={24}
              color={hasLiked ? "red" : "gray"}
            />
          </Animated.View>
          <Text>{likeCount}</Text>
        </TouchableOpacity>

        {/* Comment button */}
        <TouchableOpacity
          onPress={() => setShowComments(!showComments)}
          style={styles.actionButton}
        >
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
