import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, KeyboardAvoidingView, FlatList } from "react-native";
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
  onLike: (postId: number, hasLiked: boolean) => void; // Pass hasLiked flag
  onCommentSubmit: (postId: number, newComment: string) => void;
};

const PostItem: React.FC<PostItemProps> = ({ post, username, onLike, onCommentSubmit }) => {
  const [newComment, setNewComment] = useState<string>(""); // To store the comment text
  const [showComments, setShowComments] = useState<boolean>(false); // To control visibility of comments and input field
  const [hasLiked, setHasLiked] = useState<boolean>(false); // Track if the user has liked the post
  const [likeCount, setLikeCount] = useState<number>(post.likes); // Track the like count locally for immediate updates

  // Handle comment submission when enter is pressed
  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    try {
      onCommentSubmit(post.id, newComment); // Submit the comment
      setNewComment(""); // Reset the input field
      setShowComments(false); // Hide the input field after submitting
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  // Handle like toggle (increment or decrement the like count)
  const handleLikeToggle = async () => {
    const newHasLiked = !hasLiked; // Toggle the like state
    const newLikeCount = newHasLiked ? likeCount + 1 : likeCount - 1; // Adjust the like count based on like state

    setHasLiked(newHasLiked); // Update the local like state
    setLikeCount(newLikeCount); // Update the local like count for immediate feedback

    try {
      // Update the like count on the backend
      onLike(post.id, newHasLiked);
    } catch (error) {
      console.error("Error updating like count:", error);
      // Revert the like state and count if an error occurs
      setHasLiked(!newHasLiked);
      setLikeCount(likeCount);
    }
  };

  return (
    <View style={styles.postContainer}>
      <Text style={styles.postContent}>{post.content}</Text>
      <View style={styles.postActions}>
        {/* Like button */}
        <TouchableOpacity onPress={handleLikeToggle} style={styles.actionButton}>
          <Ionicons 
            name="heart" 
            size={24} 
            color={hasLiked ? "red" : "gray"} // Change color based on like state
          />
          <Text>{likeCount}</Text> {/* Display updated like count */}
        </TouchableOpacity>

        {/* Comment button */}
        <TouchableOpacity onPress={() => setShowComments(!showComments)} style={styles.actionButton}>
          <Ionicons name="chatbubble" size={24} color="gray" />
          <Text>{post.comments.length}</Text>
        </TouchableOpacity>
      </View>

      {/* Display the list of comments if showComments is true */}
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

          {/* Input field for new comment */}
          <KeyboardAvoidingView behavior="padding">
            <TextInput
              style={styles.commentInput}
              placeholder="Write a comment..."
              value={newComment}
              onChangeText={setNewComment}
              onSubmitEditing={handleCommentSubmit} // Submit comment on pressing enter
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
  },
  commentText: {
    fontSize: 14,
  },
  commentInput: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
  },
});

export default PostItem;
