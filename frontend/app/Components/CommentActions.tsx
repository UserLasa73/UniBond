import React, { useState } from "react";
import { TouchableOpacity, Text, View, Alert, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../lib/supabse";

interface CommentActionsProps {
  commentId: number;
  postId: number;
  userId: string; // Assuming userId is passed down as a prop or fetched from context
}

const CommentActions: React.FC<CommentActionsProps> = ({
  commentId,
  postId,
  userId,
}) => {
  const [reply, setReply] = useState<string>("");

  // Handle sending a reaction (e.g., like, love)
  const handleReaction = async (reactionType: string) => {
    try {
      const { error } = await supabase.from("reactions").insert([
        {
          user_id: userId,
          reaction_type: reactionType,
          comment_id: commentId, // This associates the reaction with a specific comment
          post_id: postId, // This associates the reaction with a specific post
        },
      ]);
      if (error) {
        console.error("Error sending reaction:", error);
        Alert.alert("Error", "Failed to send reaction.");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      Alert.alert("Error", "An unexpected error occurred.");
    }
  };

  // Handle sending a reply to a comment
  const handleReply = async () => {
    if (reply.trim()) {
      try {
        const { error } = await supabase.from("reactions").insert([
          {
            user_id: userId,
            reaction_type: "reply", // Specify that it's a reply
            comment_id: commentId, // Link it to the original comment
            post_id: postId, // Link it to the post
            created_at: new Date().toISOString(), // Add timestamp
            content: reply, // Add reply content
          },
        ]);
        if (error) {
          console.error("Error sending reply:", error);
          Alert.alert("Error", "Failed to send reply.");
        } else {
          setReply(""); // Clear reply input
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        Alert.alert("Error", "An unexpected error occurred.");
      }
    } else {
      Alert.alert("Please enter a reply.");
    }
  };

  return (
    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
      {/* Reaction Buttons */}
      <TouchableOpacity
        onPress={() => handleReaction("like")}
        style={{ marginRight: 15 }}
      >
        <Ionicons name="thumbs-up" size={24} color="blue" />
        <Text>Like</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleReaction("love")}
        style={{ marginRight: 15 }}
      >
        <Ionicons name="heart" size={24} color="red" />
        <Text>Love</Text>
      </TouchableOpacity>

      {/* Reply Input */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TextInput
          style={{ borderBottomWidth: 1, marginRight: 10, width: "60%" }}
          placeholder="Write a reply..."
          value={reply}
          onChangeText={setReply}
        />
        <TouchableOpacity onPress={handleReply}>
          <Ionicons name="send" size={24} color="blue" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CommentActions;
