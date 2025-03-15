import React, { useEffect, useState, memo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import supabase from "@/lib/supabse";
import { useAuth } from "@/app/providers/AuthProvider";
import { MaterialIcons } from "@expo/vector-icons";
import AvatarInCard from "./AvatarInCard";

type User = {
  id: string;
  username: string;
  avatar_url: string;
  isFollowed: boolean;
};

interface RandomUserCardsProps {
  currentUserId: string;
}

const RandomUserCards: React.FC<RandomUserCardsProps> = memo(
  ({ currentUserId }) => {
    const router = useRouter();
    const { session } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [randomUsers, setRandomUsers] = useState<User[]>([]);

    // Fetch all users from the database
    useEffect(() => {
      const fetchUsers = async () => {
        try {
          const { data, error } = await supabase
            .from("profiles")
            .select("id, username, avatar_url");

          if (error) throw error;

          // Add isFollowed property to each user
          const usersWithFollowStatus = await Promise.all(
            data.map(async (user) => {
              const isFollowed = await checkFollowingStatus(user.id);
              return {
                ...user,
                isFollowed,
              };
            })
          );

          setUsers(usersWithFollowStatus);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching users:", error);
          Alert.alert("Error", "Could not fetch users.");
          setLoading(false);
        }
      };

      fetchUsers();
    }, []);

    // Randomize users when the users list is updated
    useEffect(() => {
      if (users.length > 0) {
        // Filter out the current user and shuffle the remaining users
        const filteredUsers = users.filter((user) => user.id !== currentUserId);
        const shuffledUsers = shuffleArray(filteredUsers).slice(0, 5); // Show 5 random users
        setRandomUsers(shuffledUsers);
      }
    }, [users, currentUserId]);

    // Shuffle array function
    const shuffleArray = (array: User[]) => {
      return array.sort(() => Math.random() - 0.5);
    };

    // Check if the current user is following a specific user
    const checkFollowingStatus = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from("followers")
          .select("*")
          .eq("follower_id", session?.user?.id)
          .eq("followed_id", userId);

        if (error) throw error;

        return data.length > 0; // Return true if the user is followed
      } catch (error) {
        console.error("Error checking follow status:", error);
        return false;
      }
    };

    // Handle follow/unfollow
    const handleFollow = async (userId: string) => {
      try {
        const isFollowed = await checkFollowingStatus(userId);

        if (isFollowed) {
          // Unfollow the user
          const { error } = await supabase
            .from("followers")
            .delete()
            .eq("follower_id", session?.user?.id)
            .eq("followed_id", userId);

          if (error) throw error;
        } else {
          // Follow the user
          const { error } = await supabase
            .from("followers")
            .insert([{ follower_id: session?.user?.id, followed_id: userId }]);

          if (error) throw error;
        }

        // Update the local state
        setRandomUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId
              ? { ...user, isFollowed: !user.isFollowed }
              : user
          )
        );
      } catch (error) {
        console.error("Error toggling follow:", error);
        Alert.alert("Error", "Could not toggle follow status.");
      }
    };

    // Handle remove user
    const handleRemove = (userId: string) => {
      setRandomUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== userId)
      );
    };

    // Render each user card
    const renderUserCard = ({ item }: { item: User }) => (
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemove(item.id)}
        >
          <MaterialIcons name="close" size={20} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            router.push({
              pathname: "/screens/ProfileScreen",
              params: { userId: item.id },
            });
          }}
        >
          <View style={styles.avatarContainer}>
            <AvatarInCard
              url={item.avatar_url}
              size={20}
              onUpload={(newAvatarUrl) => {
                console.log("New avatar URL:", newAvatarUrl);
              }}
            />
          </View>
        </TouchableOpacity>
        <Text style={styles.username}>{item.username}</Text>

        {/* Follow Button */}
        <TouchableOpacity
          style={[
            styles.followButton,
            item.isFollowed && styles.followedButton,
          ]}
          onPress={() => handleFollow(item.id)}
        >
          <Text style={styles.followButtonText}>
            {item.isFollowed ? "Following" : "Follow"}
          </Text>
        </TouchableOpacity>
      </View>
    );

    if (loading) {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }

    return (
      <FlatList
        data={randomUsers}
        renderItem={renderUserCard}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    );
  }
);

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 0,
    paddingBottom: 16,
  },
  card: {
    width: 120,
    marginRight: 16,
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 7,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 10, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
    position: "relative",
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 999,
    overflow: "hidden",
    marginBottom: 8,
    objectFit: "cover",
  },
  username: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  followButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#2C3036",
    borderRadius: 20,
  },
  followedButton: {
    backgroundColor: "#ccc",
  },
  followButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 12,
  },
  removeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "transparent",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default RandomUserCards;
