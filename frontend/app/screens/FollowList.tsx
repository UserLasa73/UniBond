// screens/FollowList.tsx
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../lib/supabse";
import { useEffect, useState } from "react";

type Profile = {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
};

export default function FollowList() {
  const params = useLocalSearchParams();
  const type = params.type as "followers" | "following";
  const userId = params.userId as string;
  const storageUrl =
    "https://jnqvgrycauzjnvepqorq.supabase.co/storage/v1/object/public/avatars/";

  const [data, setData] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState("");

  useEffect(() => {
    // Get the current user's ID
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setCurrentUserId(session.user.id);
      }
    });

    fetchData();
  }, [type, userId]);

  const fetchData = async () => {
    try {
      setLoading(true);

      if (type === "followers") {
        // Fetch followers
        const { data, error } = await supabase
          .from("followers")
          .select("follower_id, profiles(*)")
          .eq("followed_id", userId);

        if (error) throw error;

        setData(
          data.map((item) => ({
            id: item.follower_id,
            ...item.profiles,
          }))
        );
      } else {
        // Fetch following
        const { data, error } = await supabase
          .from("followers")
          .select("followed_id, profiles(*)")
          .eq("follower_id", userId);

        if (error) throw error;

        setData(
          data.map((item) => ({
            id: item.followed_id,
            ...item.profiles,
          }))
        );
      }
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollow = async (followedId: string) => {
    try {
      const { error } = await supabase
        .from("followers")
        .delete()
        .eq("follower_id", userId)
        .eq("followed_id", followedId);

      if (error) throw error;

      // Update the local state to remove the unfollowed user
      setData(data.filter((user) => user.id !== followedId));

      Alert.alert("Success", "User unfollowed successfully");
    } catch (error) {
      console.error("Error unfollowing user:", error);
      Alert.alert("Error", "Could not unfollow user.");
    }
  };

  const confirmUnfollow = (followedId: string, username: string) => {
    Alert.alert(
      "Unfollow User",
      `Are you sure you want to unfollow ${username}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Unfollow", onPress: () => handleUnfollow(followedId) },
      ]
    );
  };

  // Handle missing params
  if (!type || !userId) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text>Missing required parameters</Text>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>
          {type === "followers" ? "Followers" : "Following"} ({data.length})
        </Text>
      </View>

      {data.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text>No {type === "followers" ? "followers" : "following"} yet</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <TouchableOpacity
                style={styles.profileInfo}
                onPress={() =>
                  router.push(`/screens/ProfileScreen?userId=${item.id}`)
                }
              >
                <View style={styles.profileImage}>
                  {item.avatar_url ? (
                    <Image
                      source={{ uri: `${storageUrl}${item.avatar_url}` }}
                      style={{ width: 40, height: 40, borderRadius: 20 }}
                    />
                  ) : (
                    <MaterialIcons name="person" size={40} color="#ccc" />
                  )}
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.name}>{item.full_name}</Text>
                  <Text style={styles.username}>@{item.username}</Text>
                </View>
              </TouchableOpacity>

              {/* Show unfollow button only if:
                  1. It's the following list (not followers)
                  2. The current user is viewing their own following list */}
              {type === "following" && userId === currentUserId && (
                <TouchableOpacity
                  style={styles.unfollowButton}
                  onPress={() => confirmUnfollow(item.id, item.username)}
                >
                  <Text style={styles.unfollowButtonText}>Unfollow</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  textContainer: {
    marginLeft: 12,
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: "bold",
  },
  username: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  unfollowButton: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  unfollowButtonText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "500",
  },
});
