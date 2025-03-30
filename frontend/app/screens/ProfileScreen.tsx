import { useEffect, useState } from "react";
import { supabase } from "../lib/supabse";
import { useAuth } from "../providers/AuthProvider";
import {
  SafeAreaView,
  FlatList,
  Modal,
  TouchableWithoutFeedback,
  Linking,
  ScrollView,
  RefreshControl,
  Image,
} from "react-native";
import {
  TouchableOpacity,
  View,
  Text,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
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
  const { userId } = useLocalSearchParams();
  const { session } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [followingList, setFollowingList] = useState([]);
  const [followerCount, setFollowerCount] = useState(0);
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [postCount, setPostCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [email, setEmail] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [jobtitle, setJobtitle] = useState([]);
  const [graduationyear, setgraduationyear] = useState();
  const [isBlockedByThem, setIsBlockedByThem] = useState(false);
  const [isBlockedByMe, setIsBlockedByMe] = useState(false);
  const [blockCheckComplete, setBlockCheckComplete] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const storageUrl =
    "https://jnqvgrycauzjnvepqorq.supabase.co/storage/v1/object/public/avatars/";

  useEffect(() => {
    const checkBlockStatus = async () => {
      try {
        const currentUserId = session?.user?.id;
        const profileUserId = userId;

        if (!currentUserId || !profileUserId) {
          setBlockCheckComplete(true);
          return;
        }

        const { data: blockData, error: blockError } = await supabase
          .from("blocked_users")
          .select()
          .or(
            `and(blocker_id.eq.${currentUserId},blocked_id.eq.${profileUserId}),and(blocker_id.eq.${profileUserId},blocked_id.eq.${currentUserId})`
          );

        if (blockError) throw blockError;

        setIsBlockedByThem(
          blockData?.some(
            (block) =>
              block.blocker_id === profileUserId &&
              block.blocked_id === currentUserId
          ) ?? false
        );

        setIsBlockedByMe(
          blockData?.some(
            (block) =>
              block.blocker_id === currentUserId &&
              block.blocked_id === profileUserId
          ) ?? false
        );
      } catch (error) {
        console.error("Error checking block status:", error);
      } finally {
        setBlockCheckComplete(true);
      }
    };

    checkBlockStatus();
  }, [userId, session]);

  const fetchData = async () => {
    try {
      setRefreshing(true);
      if (blockCheckComplete && !isBlockedByThem && !isBlockedByMe) {
        await getProfile();
        await checkFollowingStatus();
        await getFollowing();
        await getFollowerCount();
        await fetchPostCount();
        await fetchFollowingCount();
        if (isFollowing) {
          await fetchPostsAndEvents();
        }
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [blockCheckComplete, isBlockedByThem, isBlockedByMe, isFollowing]);

  const onRefresh = () => {
    fetchData();
  };

  const handleBlock = async () => {
    try {
      const profileId = session?.user?.id;
      if (!profileId) throw new Error("No user on the session!");

      const { error } = await supabase
        .from("blocked_users")
        .insert([{ blocker_id: profileId, blocked_id: userId }]);

      if (error) throw error;

      setIsBlockedByMe(true);
      Alert.alert(
        "Success",
        "User has been blocked. They can no longer see your profile or interact with you."
      );
    } catch (error) {
      console.error("Error blocking user:", error);
      Alert.alert("Error", "Failed to block user");
    }
  };

  const handleUnblock = async () => {
    try {
      const profileId = session?.user?.id;
      if (!profileId) throw new Error("No user on the session!");

      const { error } = await supabase
        .from("blocked_users")
        .delete()
        .eq("blocker_id", profileId)
        .eq("blocked_id", userId);

      if (error) throw error;

      setIsBlockedByMe(false);
      Alert.alert("Success", "User has been unblocked");
      getProfile();
    } catch (error) {
      console.error("Error unblocking user:", error);
      Alert.alert("Error", "Failed to unblock user");
    }
  };

  async function getProfile() {
    try {
      const profileId = userId || session?.user?.id;
      if (!profileId) throw new Error("No user on the session!");

      const { data: blockCheck, error: blockError } = await supabase
        .from("blocked_users")
        .select()
        .or(
          `and(blocker_id.eq.${session?.user?.id},blocked_id.eq.${profileId}),and(blocker_id.eq.${profileId},blocked_id.eq.${session?.user?.id})`
        );

      if (blockError) throw blockError;

      if (blockCheck && blockCheck.length > 0) {
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select(
          `username, avatar_url, full_name, dob, contact_number, gender, department, faculty, course, skills, interests, role, email, github, linkedin, portfolio,job_title,graduation_year`
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
        setEmail(data.email);
        setGithub(data.github);
        setLinkedin(data.linkedin);
        setPortfolio(data.portfolio);
        setJobtitle(data.job_title);
        setgraduationyear(data.graduation_year);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      Alert.alert("Error", "Unable to load profile data.");
    }
  }

  const fetchPostCount = async () => {
    try {
      const profileId = userId || session?.user?.id;
      if (!profileId) throw new Error("No user on the session!");

      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select("id")
        .eq("user_id", profileId);

      if (postsError) throw postsError;

      const { data: eventsData, error: eventsError } = await supabase
        .from("events")
        .select("id")
        .eq("uid", profileId);

      if (eventsError) throw eventsError;

      setPostCount((postsData?.length || 0) + (eventsData?.length || 0));
    } catch (error) {
      console.error("Error fetching post count:", error);
    }
  };

  const fetchFollowingCount = async () => {
    try {
      const profileId = userId || session?.user?.id;
      if (!profileId) throw new Error("No user on the session!");

      const { data, error } = await supabase
        .from("followers")
        .select("followed_id")
        .eq("follower_id", profileId);

      if (error) throw error;

      setFollowingCount(data?.length || 0);
    } catch (error) {
      console.error("Error fetching following count:", error);
    }
  };

  const fetchPostsAndEvents = async () => {
    try {
      const profileId = userId || session?.user?.id;
      if (!profileId) throw new Error("No user on the session!");

      if (isBlockedByThem || isBlockedByMe) {
        setPosts([]);
        setEvents([]);
        return;
      }

      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select("*")
        .eq("user_id", profileId);

      if (postsError) throw postsError;

      const { data: eventsData, error: eventsError } = await supabase
        .from("events")
        .select("*")
        .eq("uid", profileId);

      if (eventsError) throw eventsError;

      const eventsWithInterestStatus = await Promise.all(
        eventsData?.map(async (event) => {
          const { data: interestData, error: interestError } = await supabase
            .from("event_interests")
            .select("*")
            .eq("event_id", event.id)
            .eq("user_id", session?.user?.id);

          if (interestError) throw interestError;

          return {
            ...event,
            isInterestedByCurrentUser: interestData?.length > 0,
          };
        }) || []
      );

      setPosts(postsData || []);
      setEvents(eventsWithInterestStatus || []);
    } catch (error) {
      console.error("Error fetching posts and events:", error);
      Alert.alert("Error", "Unable to load posts and events.");
    }
  };

  const getFollowerCount = async () => {
    try {
      const { data, error } = await supabase
        .from("followers")
        .select("follower_id")
        .eq("followed_id", userId);

      if (error) throw error;

      setFollowerCount(data?.length || 0);
    } catch (error) {
      console.error("Error fetching follower count:", error);
    }
  };

  const checkFollowingStatus = async () => {
    if (!blockCheckComplete || isBlockedByThem || isBlockedByMe) {
      setIsFollowing(false);
      return;
    }

    const profileId = session?.user?.id;
    const { data, error } = await supabase
      .from("followers")
      .select("follower_id")
      .eq("follower_id", profileId)
      .eq("followed_id", userId);

    if (error) {
      console.error("Error fetching following status:", error);
    } else {
      setIsFollowing(data?.length > 0);
    }
  };

  const getFollowing = async () => {
    const profileId = session?.user?.id;
    const { data, error } = await supabase
      .from("followers")
      .select("followed_id, profiles(*)")
      .eq("follower_id", profileId);

    if (error) {
      console.error("Error fetching following list:", error);
    } else {
      setFollowingList(data || []);
    }
  };

  const toggleFollow = async (followedId) => {
    if (isBlockedByThem || isBlockedByMe) {
      Alert.alert(
        "Error",
        "You cannot follow this user due to blocking restrictions"
      );
      return;
    }

    setLoading(true);
    try {
      const action = isFollowing ? unfollowUser : followUser;
      await action(followedId);
      setIsFollowing((prev) => !prev);
      getFollowing();
      getFollowerCount();
      if (!isFollowing) {
        fetchPostsAndEvents();
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const followUser = async (followedId) => {
    if (isBlockedByThem || isBlockedByMe) {
      throw new Error("Cannot follow due to blocking restrictions");
    }

    const profileId = session?.user?.id;
    const { error } = await supabase
      .from("followers")
      .insert([{ follower_id: profileId, followed_id: followedId }]);

    if (error) throw new Error("Error following user.");
  };

  const unfollowUser = async (followedId) => {
    const profileId = session?.user?.id;
    const { error } = await supabase
      .from("followers")
      .delete()
      .eq("follower_id", profileId)
      .eq("followed_id", followedId);

    if (error) throw new Error("Error unfollowing user.");
  };

  const handleInterestToggle = async (eventId) => {
    try {
      const { data, error } = await supabase
        .from("event_interests")
        .select("*")
        .eq("event_id", eventId)
        .eq("user_id", session?.user?.id);

      if (error) throw error;

      if (data?.length > 0) {
        const { error: deleteError } = await supabase
          .from("event_interests")
          .delete()
          .eq("event_id", eventId)
          .eq("user_id", session?.user?.id);

        if (deleteError) throw deleteError;
      } else {
        const { error: insertError } = await supabase
          .from("event_interests")
          .insert([{ event_id: eventId, user_id: session?.user?.id }]);

        if (insertError) throw insertError;
      }

      fetchPostsAndEvents();
    } catch (error) {
      console.error("Error toggling interest:", error);
      Alert.alert("Error", "Failed to update interest status");
    }
  };

  const renderPost = ({ item }) => (
    <View style={styles.postContainer}>
      <Text style={styles.postContent}>{item.content}</Text>
      <Text style={styles.postLikes}>Likes: {item.likes}</Text>
    </View>
  );

  const renderEvent = ({ item }) => (
    <View style={styles.eventItem}>
      <Text style={styles.eventName}>{item.event_name}</Text>
      <Text style={styles.eventDescription}>{item.event_description}</Text>
      <Text style={styles.eventLocation}>Location: {item.event_location}</Text>
      <Text style={styles.eventDate}>Date: {item.event_date}</Text>
      <Text style={styles.eventInterested}>
        Interested: {item.interested_count}
      </Text>
      <View style={styles.divider} />

      <TouchableOpacity
        style={styles.interestedButton}
        onPress={() => handleInterestToggle(item.id)}
      >
        <MaterialIcons
          name={item.isInterestedByCurrentUser ? "remove" : "add"}
          size={20}
          color="#000"
        />
        <Text style={styles.interestedButtonText}>
          {item.isInterestedByCurrentUser ? "Not Interested" : "Interested"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const renderDropdown = () => (
    <Modal
      transparent={true}
      visible={showDropdown}
      onRequestClose={() => setShowDropdown(false)}
    >
      <TouchableWithoutFeedback onPress={() => setShowDropdown(false)}>
        <View style={styles.dropdownOverlay}>
          <View style={styles.dropdownMenu}>
            <Text style={styles.dropdownHeader}>Options</Text>

            {!isBlockedByMe ? (
              <TouchableOpacity
                onPress={() => {
                  setShowDropdown(false);
                  Alert.alert(
                    "Block User",
                    "Are you sure you want to block this user? They won't be able to see your profile or interact with you.",
                    [
                      { text: "Cancel", style: "cancel" },
                      { text: "Block", onPress: handleBlock },
                    ]
                  );
                }}
              >
                <Text style={[styles.dropdownItem, { color: "red" }]}>
                  Block User
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={handleUnblock}>
                <Text style={[styles.dropdownItem, { color: "green" }]}>
                  Unblock User
                </Text>
              </TouchableOpacity>
            )}

            <Text style={styles.dropdownHeader}>Contact Info</Text>
            <Text style={styles.dropdownItem}>Email: {email}</Text>
            <Text style={styles.dropdownItem}>Contact: {contactNumber}</Text>

            <TouchableOpacity
              onPress={() => {
                if (github) Linking.openURL(github);
              }}
            >
              <Text
                style={[
                  styles.dropdownItem,
                  { color: github ? "blue" : "black" },
                ]}
              >
                GitHub: {github || "Not provided"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                if (linkedin) Linking.openURL(linkedin);
              }}
            >
              <Text
                style={[
                  styles.dropdownItem,
                  { color: linkedin ? "blue" : "black" },
                ]}
              >
                LinkedIn: {linkedin || "Not provided"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                if (portfolio) Linking.openURL(portfolio);
              }}
            >
              <Text
                style={[
                  styles.dropdownItem,
                  { color: portfolio ? "blue" : "black" },
                ]}
              >
                Portfolio: {portfolio || "Not provided"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  if (!blockCheckComplete) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2C3036" />
      </SafeAreaView>
    );
  }

  if (isBlockedByThem) {
    return (
      <SafeAreaView style={styles.blockedContainer}>
        <Text style={styles.blockedText}>This profile is private</Text>
        <Text style={styles.blockedSubtext}>
          You can't view this profile because the account owner has restricted
          access
        </Text>
      </SafeAreaView>
    );
  }

  if (isBlockedByMe) {
    return (
      <SafeAreaView style={styles.blockedContainer}>
        <Text style={styles.blockedText}>You've blocked this account</Text>
        <Text style={styles.blockedSubtext}>
          You won't see their profile, posts, or events, and they won't see
          yours
        </Text>
        <TouchableOpacity style={styles.unblockButton} onPress={handleUnblock}>
          <Text style={styles.unblockButtonText}>Unblock</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.goBackButton}
          onPress={() => router.back()}
        >
          <Text style={styles.goBackButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Back Button */}
        <TouchableOpacity
          style={{ position: "absolute", left: 20, top: 20, zIndex: 1 }}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        {/* Profile Header */}
        <View style={{ marginTop: 30, marginHorizontal: 20 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {/* Profile Picture */}
            <ShowingAvatar
              url={avatarUrl}
              size={80}
              onUpload={(newAvatarUrl) => setAvatarUrl(newAvatarUrl)}
            />

            {/* Followers, Following, and Posts Count */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                flex: 1,
                marginLeft: 20,
              }}
            >
              <View style={{ alignItems: "center" }}>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  {postCount}
                </Text>
                <Text style={{ fontSize: 14, color: "#666" }}>Posts</Text>
              </View>

              <View style={{ alignItems: "center" }}>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  {followerCount}
                </Text>
                <Text style={{ fontSize: 14, color: "#666" }}>Followers</Text>
              </View>

              <View style={{ alignItems: "center" }}>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  {followingCount}
                </Text>
                <Text style={{ fontSize: 14, color: "#666" }}>Following</Text>
              </View>
            </View>
          </View>

          {/* Profile Details */}
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              {fullname || "Profile"} {role ? "(Alumni)" : "(Student)"}
            </Text>
            {role && (
              <View>
                <Text
                  style={{ fontSize: 16, color: "#666", fontWeight: "bold" }}
                >
                  {jobtitle}
                </Text>
                <Text style={{ fontSize: 16, color: "#666" }}>
                  Graduated Year:{" "}
                  {new Date(graduationyear).toLocaleString("default", {
                    year: "numeric",
                  })}
                </Text>
              </View>
            )}
            <Text style={{ fontSize: 16, color: "#555" }}>
              {username} | {faculty}
            </Text>
            <Text style={{ fontSize: 16, color: "#555" }}>
              {department} | {course}
            </Text>
            <Text style={{ fontSize: 16, marginTop: 10, fontWeight: "bold" }}>
              Skills:
            </Text>
            <Text style={{ fontSize: 14 }}>{skills}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginHorizontal: 20,
            marginTop: 20,
            gap: 10,
          }}
        >
          {userId !== session?.user?.id && (
            <TouchableOpacity
              onPress={() => toggleFollow(userId)}
              disabled={loading || isBlockedByThem || isBlockedByMe}
              style={{
                backgroundColor: isFollowing ? "#FF3B30" : "#2C3036",
                padding: 10,
                borderRadius: 25,
                flex: 1,
                alignItems: "center",
                opacity: isBlockedByThem || isBlockedByMe ? 0.5 : 1,
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
            <TouchableOpacity
              style={{
                backgroundColor: "#2C3036",
                padding: 10,
                borderRadius: 25,
                alignItems: "center",
                marginLeft: 10,
              }}
            >
              <Link href={`../user?userId=${userId}`} asChild>
                <Text style={{ color: "#fff" }}>Message</Text>
              </Link>
            </TouchableOpacity>
          )}

          {userId !== session?.user?.id && (
            <TouchableOpacity
              onPress={toggleDropdown}
              style={{
                backgroundColor: "#2C3036",
                padding: 10,
                borderRadius: 25,
                alignItems: "center",
                marginLeft: 10,
              }}
            >
              <Ionicons name="ellipsis-vertical" size={20} color="#fff" />
            </TouchableOpacity>
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

        {/* Posts Section */}
        {isFollowing && (
          <View style={{ marginTop: 30, marginHorizontal: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>Posts</Text>
            {posts.length > 0 ? (
              <FlatList
                data={posts}
                renderItem={renderPost}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={false}
              />
            ) : (
              <Text style={{ textAlign: "center", marginTop: 10 }}>
                No posts found.
              </Text>
            )}
          </View>
        )}

        {/* Events Section */}
        {isFollowing && (
          <View
            style={{ marginTop: 30, marginHorizontal: 20, marginBottom: 30 }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>Events</Text>
            {events.length > 0 ? (
              <FlatList
                data={events}
                renderItem={renderEvent}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={false}
              />
            ) : (
              <Text style={{ textAlign: "center", marginTop: 10 }}>
                No events found.
              </Text>
            )}
          </View>
        )}
      </ScrollView>

      {/* Dropdown Menu */}
      {renderDropdown()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  blockedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  blockedText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  blockedSubtext: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  unblockButton: {
    marginTop: 10,
    backgroundColor: "#2C3036",
    padding: 10,
    borderRadius: 5,
    minWidth: 120,
    alignItems: "center",
  },
  unblockButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  goBackButton: {
    marginTop: 20,
    backgroundColor: "transparent",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#2C3036",
    minWidth: 120,
    alignItems: "center",
  },
  goBackButtonText: {
    color: "#2C3036",
    fontWeight: "bold",
  },
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
  eventItem: {
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
  eventInterested: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  divider: {
    height: 1,
    backgroundColor: "#2C3036",
    marginVertical: 5,
  },
  interestedButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "transparent",
    borderRadius: 5,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  interestedButtonText: {
    color: "#000",
    fontWeight: "bold",
    marginLeft: 5,
  },
  dropdownOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  dropdownMenu: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  dropdownHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  dropdownItem: {
    fontSize: 16,
    marginVertical: 5,
  },
});
