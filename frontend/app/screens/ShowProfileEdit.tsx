import { useEffect, useState } from "react";
import { supabase } from "../lib/supabse";
import { useAuth } from "../providers/AuthProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  TouchableOpacity,
  View,
  Text,
  Alert,
  FlatList,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ShowingAvatar from "../Components/ShowingAvatar";
import { router, useLocalSearchParams } from "expo-router";
import PostItem from "./PostItem"; // Import PostItem component

// Define the Post type
type Post = {
  id: number;
  content: string;
  likes: number;
  comments: { username: string; comment: string }[];
  is_public: boolean;
  user_id: string;
};

export default function ShowProfileEdit() {
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const { session } = useAuth();
  const [contactNumber, setContactNumber] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState(new Date());
  const [department, setDepartment] = useState("");
  const [faculty, setFaculty] = useState("");
  const [course, setCourse] = useState("");
  const [skills, setSkills] = useState("");
  const [interests, setInterests] = useState("");
  const [posts, setPosts] = useState<Post[]>([]); // State for posts
  const { userId } = useLocalSearchParams();

  const [followingList, setFollowingList] = useState([]); // Store following list
  const [followingCount, setFollowingCount] = useState(0); // Store number of users you are following

  useEffect(() => {
    if (userId || session) {
      getProfile();
      getFollowing();
      fetchPosts();
    }
  }, [userId, session]);

  const getFollowing = async () => {
    const profileId = userId || session?.user?.id;
    const { data, error } = await supabase
      .from("followers")
      .select("followed_id, profiles(*)") // Joining with profiles to get details
      .eq("follower_id", profileId); // Filter by the current user's follower_id

    if (error) {
      console.error("Error fetching following list:", error);
    } else {
      setFollowingList(data); // Store the followed users in the state
      setFollowingCount(data.length); // Set the following count to the number of followed users
    }
  };

  async function getProfile() {
    try {
      const profileId = userId || session?.user?.id;
      if (!profileId) throw new Error("No user on the session!");

      const { data, error } = await supabase
        .from("profiles")
        .select(
          `username, avatar_url, full_name, dob, contact_number, gender, department, faculty, course, skills, interests`
        )
        .eq("id", profileId)
        .single();

      if (data) {
        setUsername(data.username);
        setFullname(data.full_name);
        setAvatarUrl(data.avatar_url);
        setDob(new Date(data.dob));
        setContactNumber(data.contact_number);
        setGender(data.gender);
        setDepartment(data.department);
        setFaculty(data.faculty);
        setCourse(data.course);
        setSkills(data.skills);
        setInterests(data.interests);
      }

      if (error) throw error;
    } catch (error) {
      console.error("Error fetching profile:", error);
      if (error instanceof Error) Alert.alert("Error", error.message);
    }
  }

  // Fetch posts made by the user
  async function fetchPosts() {
    try {
      const profileId = userId || session?.user?.id;
      if (!profileId) throw new Error("No user on the session!");

      // Fetch posts
      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select("id, content, likes, comments, is_public, user_id")
        .eq("user_id", profileId);

      if (postsData) {
        setPosts(postsData); // Update state with posts
      }

      if (postsError) throw postsError;

      // Fetch events
      const { data: eventsData, error: eventsError } = await supabase
        .from("events") // Assuming events are in the "events" table
        .select("id, event_name, event_description, event_date,uid,event_date") // Adjust columns as needed
        .eq("uid", profileId);

      if (eventsData) {
        setPosts((prevPosts) => [
          ...prevPosts,
          ...eventsData.map((event) => ({
            ...event,
            content: event.description,
            is_event: true,
          })),
        ]);
      }

      if (eventsError) throw eventsError;
    } catch (error) {
      console.error("Error fetching posts and events:", error);
      Alert.alert("Error", "Could not fetch posts or events.");
    }
  }

  const handleEditPress = () => {
    router.push("/screens/DetailsForStudents");
  };

  // Function to handle liking a post
  const handleLike = async (postId: number) => {
    try {
      // Fetch the current likes count
      const { data: postData, error: fetchError } = await supabase
        .from("posts")
        .select("likes")
        .eq("id", postId)
        .single();

      if (fetchError) throw fetchError;

      // Increment the likes count
      const updatedLikes = (postData?.likes || 0) + 1;

      // Update the post with the new likes count
      const { error: updateError } = await supabase
        .from("posts")
        .update({ likes: updatedLikes })
        .eq("id", postId);

      if (updateError) throw updateError;

      // Optionally, refetch posts to get updated data
      fetchPosts(); // Refresh the posts
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  // Function to handle submitting a comment
  const handleCommentSubmit = async (postId: number, newComment: string) => {
    try {
      const { error } = await supabase.from("comments").insert([
        {
          post_id: postId,
          username, // Use the username from state or context
          comment: newComment,
        },
      ]);

      if (error) throw error;

      // Optionally, refetch posts to get updated comments
      fetchPosts(); // Refresh the posts
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  return (
    <SafeAreaView>
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <TouchableOpacity
          style={{ position: "absolute", left: 0 }}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View style={{ marginTop: 40, marginHorizontal: 20 }}>
        {/* Row: Profile Picture + Followers and Following */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <ShowingAvatar
            url={avatarUrl}
            size={50} // Adjust size as needed
            onUpload={(newAvatarUrl) => setAvatarUrl(newAvatarUrl)}
          />

          {/* Followers and Following */}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {/* Following */}
            <View style={{ alignItems: "center", marginHorizontal: 10 }}>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                {followingCount}
              </Text>
              <Text style={{ fontSize: 14, color: "#666" }}>Following</Text>
            </View>

            {/* Followers */}
            <View style={{ alignItems: "center", marginHorizontal: 10 }}>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                {/* Replace this with the actual follower count */}
                {followingList.length}
              </Text>
              <Text style={{ fontSize: 14, color: "#666" }}>Followers</Text>
            </View>
          </View>
        </View>
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            {fullname || "Profile"}
          </Text>
          <Text style={{ fontSize: 16, color: "#666" }}>
            {faculty} | {department}
          </Text>
          <Text style={{ fontSize: 16, color: "#666" }}>{skills}</Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginHorizontal: 20,
          marginTop: 20,
        }}
      >
        <TouchableOpacity
          onPress={handleEditPress}
          style={{
            backgroundColor: "#2C3036",
            padding: 10,
            borderRadius: 25,
            flex: 1,
            alignItems: "center",
            marginRight: 10,
          }}
        >
          <Text style={{ color: "#fff" }}>Edit</Text>
        </TouchableOpacity>
        {!userId && (
          <TouchableOpacity
            onPress={async () => {
              try {
                const { error } = await supabase.auth.signOut();
                if (error) throw error;
                router.push("../(auth)/login");
              } catch (error) {
                if (error instanceof Error) {
                  Alert.alert("Error", error.message);
                }
              }
            }}
            style={{
              borderWidth: 2,
              borderColor: "#2C3036",
              backgroundColor: "transparent",
              padding: 10,
              borderRadius: 40,
              flex: 1,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#2C3036" }}>Sign Out</Text>
          </TouchableOpacity>
        )}
      </View>
      {/* Posts Section */}
      <View style={{ marginTop: 30 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginLeft: 20 }}>
          My Posts
        </Text>
        <FlatList
          data={posts}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 20 }}>
              {item.is_event ? (
                <View style={styles.eventItem}>
                  <Text style={styles.eventevent_name}>{item.event_name}</Text>
                  <Text> Description:{item.event_description}</Text>
                  <Text> Location:{item.event_location}</Text>
                  <Text> Date: {item.event_date}</Text>
                </View>
              ) : (
                <PostItem
                  post={item}
                  username={username || "Anonymous"}
                  onLike={handleLike}
                  onCommentSubmit={handleCommentSubmit}
                />
              )}
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  eventItem: {
    padding: 15,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginBottom: 10,
  },
  eventevent_name: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
