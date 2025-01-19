import { useEffect, useState } from "react";
import { supabase } from "../lib/supabse";
import { useAuth } from "../providers/AuthProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  TouchableOpacity,
  View,
  Text,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ShowingAvatar from "../Components/ShowingAvatar";
import { Link, router, useLocalSearchParams } from "expo-router";
import SeUser from "../(home)/SeUser";
import UserScreen from "../user";
export default function ProfileScreen() {
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [contactNumber, setContactNumber] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState(new Date());
  const [department, setDepartment] = useState("");
  const [faculty, setFaculty] = useState("");
  const [course, setCourse] = useState("");
  const [skills, setSkills] = useState("");
  const [interests, setInterests] = useState("");
  const { userId } = useLocalSearchParams();
  const { session } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [followingList, setFollowingList] = useState([]);

  useEffect(() => {
    if (userId || session) {
      getProfile();
      checkFollowingStatus();
      getFollowing(); // Fetching the following list when the component mounts
    }
  }, [userId, session]);

  // Check if the current user is following this profile
  const checkFollowingStatus = async () => {
    const profileId = session?.user?.id;
    const { data, error } = await supabase
      .from("followers")
      .select("follower_id")
      .eq("follower_id", profileId) // Current user (logged-in user)
      .eq("followed_id", userId); // Profile being checked for follow status
    if (error) {
      console.error("Error fetching following status:", error);
    } else {
      setIsFollowing(data.length > 0);
    }
  };

  // Fetching the list of followed users with their profile details
  const getFollowing = async () => {
    const profileId = session?.user?.id;
    const { data, error } = await supabase
      .from("followers")
      .select("followed_id, profiles(*)") // Joining with profiles to get details
      .eq("follower_id", profileId); // Current user's following list

    if (error) {
      console.error("Error fetching following list:", error);
    } else {
      setFollowingList(data); // Storing the followed users in the state
    }
  };

  const toggleFollow = async (followedId) => {
    setLoading(true);
    try {
      const action = isFollowing ? unfollowUser : followUser;
      await action(followedId);
      setIsFollowing((prev) => !prev); // Toggle follow/unfollow state
      getFollowing(); // Fetch the updated following list
    } catch (error) {
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const followUser = async (followedId) => {
    const profileId = session?.user?.id;
    const { error } = await supabase
      .from("followers")
      .insert([{ follower_id: profileId, followed_id: followedId }]); // Corrected

    if (error) throw new Error("Error following user.");
  };

  const unfollowUser = async (followedId) => {
    const profileId = session?.user?.id;
    const { error } = await supabase
      .from("followers")
      .delete()
      .eq("follower_id", profileId) // Current user (follower)
      .eq("followed_id", followedId); // Profile being unfollowed

    if (error) throw new Error("Error unfollowing user.");
  };

  // Fetching the profile data
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

      if (error) throw error;

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
    } catch (error) {
      console.error("Error fetching profile:", error);
      Alert.alert("Error", "Unable to load profile data.");
    }
  }

  return (
    <SafeAreaView>
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <TouchableOpacity
          style={{ position: "absolute", left: 0, top: 20 }} // Adjusted positioning
          onPress={() => router.back()} // Navigate back in the stack
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View
        style={{
          alignItems: "flex-start",
          marginTop: 40,
          marginHorizontal: 20,
        }}
      >
        <ShowingAvatar
          url={avatarUrl}
          size={150}
          onUpload={(newAvatarUrl) => setAvatarUrl(newAvatarUrl)}
        />
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          {fullname || "Profile"}
        </Text>
        <Text style={{ fontSize: 16, color: "#555" }}>
          {faculty} | {department}
        </Text>
        <Text style={{ fontSize: 16, marginTop: 10 }}>{skills}</Text>
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
          onPress={() => toggleFollow(userId)}
          disabled={loading}
          style={{
            backgroundColor: isFollowing ? "#FF3B30" : "#2C3036",
            padding: 10,
            borderRadius: 25,
            flex: 1,
            alignItems: "center",
          }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: "#fff" }}>
              {isFollowing ? "Unfollow" : "Follow"}
            </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: "#2C3036",
            padding: 10,
            borderRadius: 25,
            flex: 1,
            alignItems: "center",
          }}
        >
          <Link href={`../user?userId=${userId}`} asChild>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: "#fff" }}>Message</Text>
            )}
          </Link>
        </TouchableOpacity>
      </View>

      {/* Displaying the list of users this profile is following */}
      <View style={{ marginTop: 20, marginHorizontal: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>Following:</Text>
        {followingList.length > 0 ? (
          followingList.map((follower) => (
            <View key={follower.followed_id} style={{ marginTop: 10 }}>
              <Text>{follower.profiles?.full_name}</Text>
            </View>
          ))
        ) : (
          <Text>No followers</Text>
        )}
      </View>
    </SafeAreaView>
  );
}
