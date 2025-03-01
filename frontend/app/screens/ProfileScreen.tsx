import { useEffect, useState } from "react";
import { supabase } from "../lib/supabse";
import { useAuth } from "../providers/AuthProvider";
import { SafeAreaView, FlatList, Modal, Linking } from "react-native";
import {
  TouchableOpacity,
  View,
  Text,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ShowingAvatar from "../Components/ShowingAvatar";
import { Link, router, useLocalSearchParams } from "expo-router";

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
  const [role, setRole] = useState<boolean>(false);
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const { userId } = useLocalSearchParams();
  const { session } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [followingList, setFollowingList] = useState([]);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [postsCount, setPostsCount] = useState(0);
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    if (userId || session) {
      getProfile();
      checkFollowingStatus();
      getFollowing();
      getFollowerCount();
      getFollowingCount();
      fetchPosts();
    }
  }, [userId, session]);

  // Fetch profile data
  async function getProfile() {
    try {
      const profileId = userId || session?.user?.id;
      if (!profileId) throw new Error("No user on the session!");

      const { data, error } = await supabase
        .from("profiles")
        .select(
          `username, avatar_url, full_name, dob, contact_number, gender, department, faculty, course, skills, interests, role, email, linkedin, github, portfolio`
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
        setRole(data.role);
        setUserEmail(data.email);
        setLinkedin(data.linkedin || "");
        setGithub(data.github || "");
        setPortfolio(data.portfolio || "");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      Alert.alert("Error", "Unable to load profile data.");
    }
  }

  // Render posts and events
  const renderPost = ({ item }) => (
    <View style={styles.postContainer}>
      <Text style={styles.postContent}>{item.content}</Text>
      <Text style={styles.postLikes}>Likes: {item.likes}</Text>
    </View>
  );

  const renderEvent = ({ item }) => (
    <View style={styles.eventContainer}>
      <Text style={styles.eventName}>{item.event_name}</Text>
      <Text style={styles.eventDescription}>{item.event_description}</Text>
      <Text style={styles.eventLocation}>Location: {item.event_location}</Text>
      <Text style={styles.eventDate}>Date: {item.event_date}</Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Header and Profile Details */}
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <TouchableOpacity
          style={{ position: "absolute", left: 0, top: 20 }}
          onPress={() => router.back()}
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
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <ShowingAvatar
            url={avatarUrl}
            size={150}
            onUpload={(newAvatarUrl) => setAvatarUrl(newAvatarUrl)}
          />
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <View style={{ alignItems: "center", marginHorizontal: 5 }}>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                {postsCount}
              </Text>
              <Text style={{ fontSize: 14, color: "#666" }}>Posts</Text>
            </View>
            <Text style={{ fontSize: 20, color: "#666", marginHorizontal: 5 }}>
              |
            </Text>
            <View style={{ alignItems: "center", marginHorizontal: 5 }}>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                {followerCount}
              </Text>
              <Text style={{ fontSize: 14, color: "#666" }}>Followers</Text>
            </View>
            <Text style={{ fontSize: 20, color: "#666", marginHorizontal: 5 }}>
              |
            </Text>
            <View style={{ alignItems: "center", marginHorizontal: 5 }}>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                {followingCount}
              </Text>
              <Text style={{ fontSize: 14, color: "#666" }}>Following</Text>
            </View>
          </View>
        </View>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          {fullname || "Profile"} {role ? "(Alumni)" : "(Student)"}
        </Text>
        <Text style={{ fontSize: 16, color: "#555" }}>
          {username} | {contactNumber}
        </Text>
        <Text style={{ fontSize: 16, color: "#555" }}>
          {faculty} | {department}
        </Text>
        <Text style={{ fontSize: 16, marginTop: 10 }}>{skills}</Text>
      </View>

      {/* Follow/Edit Buttons */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginHorizontal: 20,
          marginTop: 20,
        }}
      >
        {userId !== session?.user?.id && (
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
        )}

        {!userId && (
          <TouchableOpacity
            onPress={() => router.push("/screens/DetailsForStudents")}
            style={{
              backgroundColor: "#2C3036",
              padding: 10,
              borderRadius: 25,
              flex: 1,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff" }}>Edit</Text>
          </TouchableOpacity>
        )}

        {userId !== session?.user?.id && isFollowing && (
          <>
            <TouchableOpacity
              style={{
                backgroundColor: "#2C3036",
                padding: 10,
                borderRadius: 25,
                flex: 1,
                marginLeft: 10,
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

            <TouchableOpacity
              onPress={() => setDropdownVisible(true)}
              style={{ marginLeft: 10 }}
            >
              <Ionicons name="ellipsis-vertical" size={24} color="black" />
            </TouchableOpacity>
          </>
        )}

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

      {/* Dropdown Modal */}
      <Modal
        transparent={true}
        visible={dropdownVisible}
        onRequestClose={() => setDropdownVisible(false)}
      >
        <View style={styles.dropdownContainer}>
          <View style={styles.dropdownMenu}>
            <Text style={styles.dropdownItem}>Contact: {contactNumber}</Text>
            <Text style={styles.dropdownItem}>Email: {userEmail}</Text>
            {linkedin && (
              <TouchableOpacity
                onPress={() => Linking.openURL(linkedin)}
                style={styles.dropdownItem}
              >
                <Text style={{ color: "#0077B5" }}>LinkedIn</Text>
              </TouchableOpacity>
            )}
            {github && (
              <TouchableOpacity
                onPress={() => Linking.openURL(github)}
                style={styles.dropdownItem}
              >
                <Text style={{ color: "#333" }}>GitHub</Text>
              </TouchableOpacity>
            )}
            {portfolio && (
              <TouchableOpacity
                onPress={() => Linking.openURL(portfolio)}
                style={styles.dropdownItem}
              >
                <Text style={{ color: "#2C3036" }}>Portfolio</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => setDropdownVisible(false)}
              style={styles.closeButton}
            >
              <Text style={{ color: "#2C3036" }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  postContainer: {
    padding: 15,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginBottom: 10,
  },
  postContent: {
    fontSize: 16,
  },
  postLikes: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  eventContainer: {
    padding: 15,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginBottom: 10,
  },
  eventName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  eventDescription: {
    fontSize: 16,
    marginTop: 5,
  },
  eventLocation: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  eventDate: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  dropdownContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  dropdownMenu: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    width: 250,
  },
  dropdownItem: {
    fontSize: 16,
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 10,
    alignItems: "center",
  },
});
