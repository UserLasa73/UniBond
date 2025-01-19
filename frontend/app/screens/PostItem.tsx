// PostItem.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, KeyboardAvoidingView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../lib/supabse";

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
  onLike: (postId: number) => void;
  onCommentSubmit: (postId: number, newComment: string) => void;
};

const PostItem: React.FC<PostItemProps> = ({ post, username, onLike, onCommentSubmit }) => {
  const [newComment, setNewComment] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleComment = async () => {
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      onCommentSubmit(post.id, newComment);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.postContainer}>
      <Text style={styles.postContent}>{post.content}</Text>
      <View style={styles.postActions}>
        <TouchableOpacity onPress={() => onLike(post.id)} style={styles.actionButton}>
          <Ionicons name="heart" size={24} color="red" />
          <Text>{post.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chatbubble" size={24} color="gray" />
          <Text>{post.comments.length}</Text>
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingView behavior="padding">
        <TextInput
          style={styles.commentInput}
          placeholder="Write a comment..."
          value={newComment}
          onChangeText={setNewComment}
          onSubmitEditing={handleComment}
          editable={!submitting}
        />
      </KeyboardAvoidingView>
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
  commentInput: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
  },
});

export default PostItem;
