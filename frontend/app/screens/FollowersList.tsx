// screens/FollowersList.tsx
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image,
  Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../lib/supabse";
import { useEffect, useState } from "react";

type Profile = {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
};

export default function FollowersList() {
  const params = useLocalSearchParams();
  const type = params.type as "followers" | "following";
  const userId = params.userId as string;
  const storageUrl =
    "https://jnqvgrycauzjnvepqorq.supabase.co/storage/v1/object/public/avatars/";

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchProfiles();
  }, [type, userId]);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      setError(null);

      // First get the relationships
      const { data: relationships, error: relError } = await supabase
        .from("followers")
        .select(type === "followers" ? "follower_id" : "followed_id")
        .eq(type === "followers" ? "followed_id" : "follower_id", userId)
        .neq(type === "followers" ? "follower_id" : "followed_id", userId);

      if (relError) throw relError;

      const userIds =
        relationships?.map((r) =>
          type === "followers" ? r.follower_id : r.followed_id
        ) || [];

      if (userIds.length === 0) {
        setProfiles([]);
        return;
      }

      // Then check which of these users are blocked
      const { data: blockedUsers, error: blockedError } = await supabase
        .from("blocked_users")
        .select("blocked_id")
        .eq("blocker_id", userId);

      if (blockedError) throw blockedError;

      const blockedIds = blockedUsers?.map((b) => b.blocked_id) || [];

      // Filter out blocked users from the list
      const filteredUserIds = userIds.filter((id) => !blockedIds.includes(id));

      if (filteredUserIds.length === 0) {
        setProfiles([]);
        return;
      }

      // Get profile data for non-blocked users
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username, full_name, avatar_url")
        .in("id", filteredUserIds);

      if (profilesError) throw profilesError;

      setProfiles(profilesData || []);
    } catch (err) {
      console.error(`Error fetching ${type}:`, err);
      setError(`Failed to load ${type}. Please try again.`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchProfiles();
  };

  const removeFollower = async (followerId: string) => {
    try {
      const { error } = await supabase
        .from("followers")
        .delete()
        .eq("follower_id", followerId)
        .eq("followed_id", userId);

      if (error) throw error;

      setProfiles(profiles.filter((profile) => profile.id !== followerId));
      Alert.alert("Success", "Follower removed successfully");
    } catch (error) {
      console.error("Error removing follower:", error);
      Alert.alert("Error", "Failed to remove follower");
    }
  };

  const blockUser = async (userIdToBlock: string) => {
    try {
      // Remove follow relationships in both directions (if they exist)
      const { error: deleteError } = await supabase
        .from("followers")
        .delete()
        .or(
          `and(follower_id.eq.${userId},followed_id.eq.${userIdToBlock}),and(follower_id.eq.${userIdToBlock},followed_id.eq.${userId})`
        );

      if (deleteError) throw deleteError;

      // Add to blocked users table
      const { error: blockError } = await supabase
        .from("blocked_users")
        .upsert({
          blocker_id: userId,
          blocked_id: userIdToBlock,
          created_at: new Date().toISOString(),
        });

      if (blockError) throw blockError;

      // Update local state
      setProfiles(profiles.filter((profile) => profile.id !== userIdToBlock));
      Alert.alert(
        "User Blocked",
        "This user can no longer follow you or see your profile."
      );
    } catch (error) {
      console.error("Error blocking user:", error);
      Alert.alert(
        "Error",
        "Could not block user at this time. Please try again."
      );
    }
  };

  const confirmRemove = (followerId: string) => {
    Alert.alert(
      "Remove Follower",
      "Are you sure you want to remove this follower?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Remove", onPress: () => removeFollower(followerId) },
      ]
    );
  };

  const confirmBlock = (userIdToBlock: string) => {
    Alert.alert(
      "Block User",
      "Blocking will prevent this user from following you or seeing your profile.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Block",
          style: "destructive",
          onPress: () => blockUser(userIdToBlock),
        },
      ]
    );
  };

  if (!type || !userId) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Missing required parameters</Text>
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
          {type === "followers" ? "Followers" : "Following"} ({profiles.length})
        </Text>
      </View>

      {loading && !refreshing ? (
        <View style={styles.container}>
          <ActivityIndicator size="large" />
        </View>
      ) : error ? (
        <View style={styles.container}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={fetchProfiles} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : profiles.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No {type === "followers" ? "followers" : "following"} yet
          </Text>
        </View>
      ) : (
        <FlatList
          data={profiles}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <TouchableOpacity
                style={styles.profileInfo}
                onPress={() =>
                  router.push({
                    pathname: "/screens/ProfileScreen",
                    params: { userId: item.id },
                  })
                }
              >
                <View style={styles.profileImage}>
                  {item.avatar_url ? (
                    <Image
                      source={{ uri: `${storageUrl}${item.avatar_url}` }}
                      style={{ width: 50, height: 50, borderRadius: 25 }}
                    />
                  ) : (
                    <MaterialIcons name="person" size={50} color="#ccc" />
                  )}
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.name}>{item.full_name}</Text>
                  <Text style={styles.username}>@{item.username}</Text>
                </View>
              </TouchableOpacity>
              {type === "followers" && (
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => confirmRemove(item.id)}
                  >
                    <Feather name="user-minus" size={20} color="#ff4444" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => confirmBlock(item.id)}
                  >
                    <Feather name="slash" size={20} color="#ff4444" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 16,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  textContainer: {
    marginLeft: 16,
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  username: {
    fontSize: 14,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
  },
  listContent: {
    paddingBottom: 20,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#2C3036",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  retryButtonText: {
    color: "white",
    textAlign: "center",
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    marginLeft: 15,
    padding: 8,
  },
});
