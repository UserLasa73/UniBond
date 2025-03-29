// screens/FollowersList.tsx
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import ShowingAvatar from "../Components/ShowingAvatar";
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

      // First get the relationship IDs
      const { data: relationships, error: relError } = await supabase
        .from("followers")
        .select(type === "followers" ? "follower_id" : "followed_id")
        .eq(type === "followers" ? "followed_id" : "follower_id", userId)
        .neq(type === "followers" ? "follower_id" : "followed_id", userId);

      if (relError) throw relError;

      // Extract user IDs from relationships
      const userIds =
        relationships?.map((r) =>
          type === "followers" ? r.follower_id : r.followed_id
        ) || [];

      if (userIds.length === 0) {
        setProfiles([]);
        return;
      }

      // Then get the profile data for those IDs
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username, full_name, avatar_url")
        .in("id", userIds);

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
            <TouchableOpacity
              style={styles.itemContainer}
              onPress={() =>
                router.push({
                  pathname: "/screens/ProfileScreen",
                  params: { userId: item.id },
                })
              }
            >
              <ShowingAvatar url={item.avatar_url} size={50} />
              <View style={styles.textContainer}>
                <Text style={styles.name}>{item.full_name}</Text>
                <Text style={styles.username}>@{item.username}</Text>
              </View>
            </TouchableOpacity>
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
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
});
