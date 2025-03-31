import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  View,
  Alert,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Image,
  RefreshControl,
  Share,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/app/providers/AuthProvider";
import TopNavigationBar from "../../Components/TopNavigationBar";
import { supabase } from "../../../lib/supabse";
import PostItem from "../../screens/PostItem";
import PostMenu from "../../Components/PostMenu";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import EventItem from "@/app/Components/EventItem";
import RandomUserCards from "@/app/Components/renderUserCard ";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";

type Post = {
  id: number;
  content: string;
  likes: number;
  comments: { username: string; comment: string }[];
  is_public: boolean;
  user_id: string;
  username: string;
  posted_date: string;
  avatar_url: string;
  role: boolean;
  type: "post";
  created_at: string;
};

type Event = {
  id: number;
  event_name: string;
  event_date: string;
  event_location: string;
  event_description: string;
  user_id: string;
  username: string;
  posted_date: string;
  avatar_url: string;
  role: boolean;
  interested_count: number;
  isInterestedByCurrentUser: boolean;
  type: "event";
  uid: string;
  created_at: string;
};

const HomeScreen: React.FC = () => {
  const router = useRouter();
  const { session, profile } = useAuth();
  const [username, setUsername] = useState<string>("");
  const [combinedData, setCombinedData] = useState<(Post | Event)[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [filter, setFilter] = useState<"all" | "posts" | "events">("all");
  const [sortBy, setSortBy] = useState<"date" | "likes" | "interested">("date");
  const [isDateSorted, setIsDateSorted] = useState<boolean>(false);
  const [menuVisiblePostId, setMenuVisiblePostId] = useState<number | null>(
    null
  );
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [refreshKey, setRefreshKey] = useState(0);
  const [blockedUserIds, setBlockedUserIds] = useState<string[]>([]);

  // Fisher-Yates shuffle algorithm
  const shuffleArray = (array: any[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const fetchBlockedUsers = async () => {
    try {
      if (!session?.user?.id) return [];

      const { data, error } = await supabase
        .from("blocked_users")
        .select("blocked_id")
        .eq("blocker_id", session.user.id);

      if (error) throw error;
      return data.map((item) => item.blocked_id);
    } catch (error) {
      console.error("Error fetching blocked users:", error);
      Alert.alert("Error", "Failed to load blocked users");
      return [];
    }
  };

  const blockUser = async (userIdToBlock: string) => {
    try {
      const { error } = await supabase.from("blocked_users").insert([
        {
          blocker_id: session?.user?.id,
          blocked_id: userIdToBlock,
        },
      ]);

      if (error) throw error;

      setRefreshKey((prev) => prev + 1);
      Alert.alert("Success", "User blocked successfully");
    } catch (error) {
      console.error("Error blocking user:", error);
      Alert.alert("Error", "Failed to block user");
    }
  };

  const unblockUser = async (userIdToUnblock: string) => {
    try {
      const { error } = await supabase
        .from("blocked_users")
        .delete()
        .eq("blocker_id", session?.user?.id)
        .eq("blocked_id", userIdToUnblock);

      if (error) throw error;

      setRefreshKey((prev) => prev + 1);
      Alert.alert("Success", "User unblocked successfully");
    } catch (error) {
      console.error("Error unblocking user:", error);
      Alert.alert("Error", "Failed to unblock user");
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchCombinedData().finally(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    if (session) {
      getProfile();
      fetchCombinedData();
    }
  }, [session, refreshKey]);

  const getProfile = async () => {
    try {
      const profileId = session?.user?.id;
      if (!profileId) throw new Error("No user on the session!");

      const { data, error } = await supabase
        .from("profiles")
        .select("username, avatar_url, role")
        .eq("id", profileId)
        .single();

      if (error) throw error;
      setUsername(data.username || "Anonymous");
    } catch (error) {
      console.error("Error fetching profile:", error);
      Alert.alert("Error", "Could not fetch user profile.");
    }
  };

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("username, avatar_url, role")
        .eq("id", userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return { username: "Anonymous", avatar_url: null, role: false };
    }
  };

  const fetchCombinedData = async () => {
    setLoading(true);
    try {
      // Fetch blocked users first
      const blockedIds = await fetchBlockedUsers();
      setBlockedUserIds(blockedIds);

      // Fetch posts (using RPC function that checks visibility)
      const { data: postsData, error: postsError } = await supabase.rpc(
        "get_visible_posts",
        { current_user_id: session?.user?.id }
      );

      if (postsError) throw postsError;

      // Fetch events
      const { data: eventsData, error: eventsError } = await supabase
        .from("events")
        .select(
          "id, event_name, event_date, event_location, event_description, uid, created_at, interested_count"
        );

      if (eventsError) throw eventsError;

      // Process posts and filter blocked users
      const postsWithUserData = await Promise.all(
        postsData
          .filter((post: Post) => !blockedIds.includes(post.user_id))
          .map(async (post: Post) => {
            const userProfile = await fetchUserProfile(post.user_id);
            return {
              ...post,
              type: "post",
              username: userProfile.username,
              avatar_url: userProfile.avatar_url,
              role: userProfile.role,
              posted_date: new Date(post.created_at).toISOString(),
            };
          })
      );

      // Process events and filter blocked users
      const eventsWithUserData = await Promise.all(
        eventsData
          .filter((event: Event) => !blockedIds.includes(event.uid))
          .map(async (event: Event) => {
            const userProfile = await fetchUserProfile(event.uid);

            // Check if current user is interested
            const { data: interestData, error: interestError } = await supabase
              .from("event_interests")
              .select("*")
              .eq("event_id", event.id)
              .eq("user_id", session?.user?.id);

            if (interestError) throw interestError;

            const isInterestedByCurrentUser = interestData.length > 0;

            return {
              ...event,
              type: "event",
              username: userProfile.username,
              avatar_url: userProfile.avatar_url,
              role: userProfile.role,
              posted_date: new Date(event.created_at).toISOString(),
              isInterestedByCurrentUser,
              user_id: event.uid,
            };
          })
      );

      // Combine and shuffle the data
      const combined = [...eventsWithUserData, ...postsWithUserData];
      const shuffledData = shuffleArray(combined);

      setCombinedData(shuffledData);
    } catch (error) {
      console.error("Error fetching data:", error);
      Alert.alert("Error", "Could not fetch data.");
    } finally {
      setLoading(false);
    }
  };

  const handleInterestToggle = async (eventId: number) => {
    try {
      const event = combinedData.find(
        (item) => item.type === "event" && item.id === eventId
      ) as Event;

      if (!event) throw new Error("Event not found");

      const isInterested = event.isInterestedByCurrentUser;

      if (isInterested) {
        const { error: removeError } = await supabase
          .from("event_interests")
          .delete()
          .eq("event_id", eventId)
          .eq("user_id", session?.user?.id);

        if (removeError) throw removeError;

        const newInterestedCount = event.interested_count - 1;

        const { error: updateError } = await supabase
          .from("events")
          .update({ interested_count: newInterestedCount })
          .eq("id", eventId);

        if (updateError) throw updateError;

        setCombinedData((prev) =>
          prev.map((item) =>
            item.type === "event" && item.id === eventId
              ? {
                  ...item,
                  interested_count: newInterestedCount,
                  isInterestedByCurrentUser: false,
                }
              : item
          )
        );
      } else {
        const { error: addError } = await supabase
          .from("event_interests")
          .insert([{ event_id: eventId, user_id: session?.user?.id }]);

        if (addError) throw addError;

        const newInterestedCount = event.interested_count + 1;

        const { error: updateError } = await supabase
          .from("events")
          .update({ interested_count: newInterestedCount })
          .eq("id", eventId);

        if (updateError) throw updateError;

        setCombinedData((prev) =>
          prev.map((item) =>
            item.type === "event" && item.id === eventId
              ? {
                  ...item,
                  interested_count: newInterestedCount,
                  isInterestedByCurrentUser: true,
                }
              : item
          )
        );
      }
    } catch (error) {
      console.error("Error toggling interest:", error);
      Alert.alert("Error", "Could not toggle interest.");
    }
  };

  const sharePost = async (post) => {
    if (!post) return;

    try {
      const postUrl = `myapp://post/${post.id}`;
      let message = `${post.content}\nCheck it out here: ${postUrl}`;

      if (post.imageUrl) {
        const fileUri = `${FileSystem.cacheDirectory}shared_image.jpg`;
        const { uri } = await FileSystem.downloadAsync(post.imageUrl, fileUri);

        if (Platform.OS === "ios" || Platform.OS === "android") {
          await Sharing.shareAsync(uri, {
            dialogTitle: "Share Post",
            mimeType: "image/jpeg",
          });
        }

        await Share.share({ message });
      } else {
        await Share.share({ message });
      }
    } catch (error) {
      Alert.alert("Error", "Failed to share the post.");
      console.error("Sharing error:", error);
    }
  };

  const renderItem = ({ item }: { item: Post | Event }) => {
    if (item.type === "event") {
      return (
        <EventItem
          event={item as Event}
          onInterestToggle={handleInterestToggle}
        />
      );
    } else if (item.type === "post") {
      const post = item as Post;
      const storageUrl =
        "https://jnqvgrycauzjnvepqorq.supabase.co/storage/v1/object/public/avatars/";
      const imageUrl = post.avatar_url
        ? `${storageUrl}${post.avatar_url}`
        : null;

      const isOwner = post.user_id === session?.user?.id;
      const isBlocked = blockedUserIds.includes(post.user_id);

      if (isBlocked) return null; // Don't render posts from blocked users

      return (
        <View style={styles.postItem}>
          {/* User Profile Section */}
          <TouchableOpacity
            onPress={() =>
              router.push(`/screens/ProfileScreen?userId=${post.user_id}`)
            }
          >
            <View style={styles.userInfoContainer}>
              {imageUrl ? (
                <Image source={{ uri: imageUrl }} style={styles.avatar} />
              ) : (
                <MaterialIcons name="person" size={40} color="#000" />
              )}
              <View style={styles.userInfoText}>
                <Text style={styles.username}>
                  {post.username} ({post.role ? "Alumni" : "Student"})
                </Text>
                <Text style={styles.postedDate}>
                  {calculatePostDuration(post.posted_date)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Post Content */}
          <PostItem
            post={post}
            username={username}
            avatarUrl={imageUrl}
            postedDate={post.posted_date}
            postDuration={calculatePostDuration(post.posted_date)}
            role={post.role}
            onLike={handleLike}
            onCommentSubmit={handleCommentSubmit}
            onProfilePress={() =>
              router.push(`/screens/ProfileScreen?userId=${post.user_id}`)
            }
            onBlockUser={() => blockUser(post.user_id)}
          />

          {/* Post Menu Button */}
          {isOwner && (
            <TouchableOpacity
              onPress={(event) => {
                if (menuVisiblePostId === post.id) {
                  setMenuVisiblePostId(null);
                } else {
                  setMenuVisiblePostId(post.id);
                  setMenuPosition({
                    x: event.nativeEvent.pageX - 110,
                    y: event.nativeEvent.pageY - 5,
                  });
                }
              }}
              style={styles.menuButton}
            >
              <MaterialIcons name="more-vert" size={24} color="black" />
            </TouchableOpacity>
          )}

          {/* Post Menu */}
          {menuVisiblePostId === post.id && (
            <PostMenu
              visible={true}
              onClose={() => setMenuVisiblePostId(null)}
              onEdit={() => {
                setMenuVisiblePostId(null);
                router.push({
                  pathname: "/screens/EditPostScreen",
                  params: {
                    postId: post.id,
                  },
                });
              }}
              onDelete={async () => {
                Alert.alert(
                  "Delete Post",
                  "Are you sure you want to delete this post?",
                  [
                    {
                      text: "Cancel",
                      style: "cancel",
                    },
                    {
                      text: "Delete",
                      style: "destructive",
                      onPress: async () => {
                        try {
                          const { error } = await supabase
                            .from("posts")
                            .delete()
                            .eq("id", post.id);

                          if (error) {
                            console.error("Error deleting post:", error);
                            Alert.alert("Error", "Failed to delete post.");
                          } else {
                            setRefreshKey((prevKey) => prevKey + 1);
                            setMenuVisiblePostId(null);
                          }
                        } catch (err) {
                          console.error("Unexpected error:", err);
                          Alert.alert("Error", "An unexpected error occurred.");
                        }
                      },
                    },
                  ]
                );
              }}
              onShare={() => {
                setMenuVisiblePostId(null);
                sharePost(post);
              }}
              isOwner={isOwner}
              position={menuPosition}
            />
          )}
        </View>
      );
    }
    return null;
  };

  const calculatePostDuration = (postedDate: string) => {
    const postDate = new Date(postedDate);
    const currentDate = new Date();
    const timeDifference = currentDate.getTime() - postDate.getTime();

    const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));
    const hoursDifference = Math.floor(timeDifference / (1000 * 3600));
    const minutesDifference = Math.floor(timeDifference / (1000 * 60));

    if (daysDifference > 0) {
      return `${daysDifference} day${daysDifference > 1 ? "s" : ""} ago`;
    } else if (hoursDifference > 0) {
      return `${hoursDifference} hour${hoursDifference > 1 ? "s" : ""} ago`;
    } else if (minutesDifference > 0) {
      return `${minutesDifference} minute${minutesDifference > 1 ? "s" : ""} ago`;
    } else {
      return "Just now";
    }
  };

  const handleLike = async (postId: number, hasLiked: boolean) => {
    try {
      const postIndex = combinedData.findIndex(
        (item) => item.type === "post" && item.id === postId
      );

      if (postIndex === -1) throw new Error("Post not found");

      const updatedLikeCount = hasLiked
        ? combinedData[postIndex].likes - 1
        : combinedData[postIndex].likes + 1;

      const { error: updateError } = await supabase
        .from("posts")
        .update({ likes: updatedLikeCount })
        .eq("id", postId);

      if (updateError) throw updateError;

      setCombinedData((prev) =>
        prev.map((item) =>
          item.type === "post" && item.id === postId
            ? { ...item, likes: updatedLikeCount }
            : item
        )
      );
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  const handleCommentSubmit = async (postId: number, commentText: string) => {
    if (!commentText.trim()) {
      alert("Please enter a comment!");
      return;
    }

    try {
      const { data, error } = await supabase.from("comments").insert([
        {
          post_id: postId,
          comment: commentText,
          user_id: session?.user?.id,
          timestamp: new Date(),
        },
      ]);

      if (error) throw error;

      // Refresh the data to show new comment
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const handleFilterChange = (newFilter: "all" | "posts" | "events") => {
    setFilter(newFilter);
  };

  const handleSortChange = (newSort: "date" | "likes" | "interested") => {
    if (newSort === "date") {
      setIsDateSorted((prev) => !prev);
      setSortBy("date");
    } else {
      setIsDateSorted(false);
      setSortBy(newSort);
    }
  };

  const filteredData = useMemo(() => {
    return combinedData.filter((item) => {
      if (filter === "posts") return item.type === "post";
      if (filter === "events") return item.type === "event";
      return true; // 'all'
    });
  }, [combinedData, filter]);

  const sortedData = useMemo(() => {
    if (sortBy === "date" && isDateSorted) {
      return [...filteredData].sort((a, b) => {
        return (
          new Date(b.posted_date).getTime() - new Date(a.posted_date).getTime()
        );
      });
    } else if (sortBy === "likes") {
      return [...filteredData].sort((a, b) => {
        if (a.type === "post" && b.type === "post") {
          return b.likes - a.likes;
        }
        return 0;
      });
    } else if (sortBy === "interested") {
      return [...filteredData].sort((a, b) => {
        if (a.type === "event" && b.type === "event") {
          return b.interested_count - a.interested_count;
        }
        return 0;
      });
    }
    return filteredData; // Return shuffled data when no sort is applied
  }, [filteredData, sortBy, isDateSorted]);

  const renderHeader = useCallback(
    () => (
      <View style={styles.randomUserCardsContainer}>
        <RandomUserCards currentUserId={session?.user?.id} />
      </View>
    ),
    [session?.user?.id]
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TopNavigationBar
        userName={username}
        onProfilePress={() => router.push("/screens/ShowProfileEdit")}
        onNotificationPress={() => router.push("/screens/NotificationScreen")}
        onPostPress={() => router.push("/screens/PostScreen")}
      />

      <View style={styles.filterSortContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === "all" && styles.activeFilter]}
          onPress={() => handleFilterChange("all")}
        >
          <Text style={styles.filterButtonText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "posts" && styles.activeFilter,
          ]}
          onPress={() => handleFilterChange("posts")}
        >
          <Text style={styles.filterButtonText}>Posts</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "events" && styles.activeFilter,
          ]}
          onPress={() => handleFilterChange("events")}
        >
          <Text style={styles.filterButtonText}>Events</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.sortButton,
            sortBy === "date" && isDateSorted && styles.activeSort,
          ]}
          onPress={() => handleSortChange("date")}
        >
          <Text style={styles.sortButtonText}>
            {isDateSorted ? "Newest First" : "Sort by Date"}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={sortedData}
        renderItem={renderItem}
        keyExtractor={(item) =>
          `${item.type === "event" ? "event" : "post"}-${item.id}`
        }
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.combinedList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#2C3036"]}
            tintColor="#2C3036"
          />
        }
      />

      <TouchableOpacity
        style={styles.DonateButton}
        onPress={() => {
          router.push("/screens/DonationScreen");
        }}
      >
        <Image source={require("../../Constatnts/Donate Icon.png")} />
        <Text style={{ color: "#000", fontWeight: "bold" }}>Donate</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  DonateButton: {
    borderWidth: 1,
    borderColor: "#EBF2FA",
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    position: "absolute",
    bottom: 20,
    right: 20,
    height: 70,
    backgroundColor: "#EBF2FA",
    borderRadius: 100,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  combinedList: {
    padding: 16,
    paddingBottom: 100,
  },
  postItem: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    position: "relative",
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userInfoText: {
    flexDirection: "column",
  },
  username: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    marginLeft: 10,
  },
  postedDate: {
    fontSize: 12,
    color: "#666",
    marginRight: 10,
    marginLeft: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  filterSortContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    padding: 10,
    backgroundColor: "#fff",
  },
  filterButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#ddd",
    margin: 5,
  },
  activeFilter: {
    backgroundColor: "#2C3036",
  },
  filterButtonText: {
    color: "#fff",
  },
  sortButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#ddd",
    margin: 5,
  },
  activeSort: {
    backgroundColor: "#2C3036",
  },
  sortButtonText: {
    color: "#FFF",
  },
  randomUserCardsContainer: {
    padding: 10,
    marginBottom: 10,
  },
  menuButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 5,
    borderRadius: 5,
  },
});

export default HomeScreen;
