// screens/FollowList.tsx
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
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

export default function FollowList() {
  const params = useLocalSearchParams();
  const type = params.type as "followers" | "following";
  const userId = params.userId as string;

  const [data, setData] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
      <View style={{ flexDirection: "row", alignItems: "center", padding: 16 }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: "bold", marginLeft: 16 }}>
          {type === "followers" ? "Followers" : "Following"} ({data.length})
        </Text>
      </View>

      {data.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>No {type === "followers" ? "followers" : "following"} yet</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.itemContainer}
              onPress={() =>
                router.push(`/screens/ProfileScreen?userId=${item.id}`)
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
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  textContainer: {
    marginLeft: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  username: {
    fontSize: 14,
    color: "#666",
  },
});
