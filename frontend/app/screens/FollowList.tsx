// screens/FollowList.tsx
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
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
            <TouchableOpacity
              style={styles.itemContainer}
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
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
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
});
