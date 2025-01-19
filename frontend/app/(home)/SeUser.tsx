import { useEffect, useState } from "react";
import { FlatList, Text, ActivityIndicator, View } from "react-native";
import { supabase } from "../lib/supabse";
import { useAuth } from "../providers/AuthProvider";
import UserList from "../Components/UserList";

export default function SeUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data: profiles, error } = await supabase
          .from("profiles")
          .select("*")
          .neq("id", user?.id); // Exclude the current user

        if (error) throw error;

        setUsers(profiles || []);
      } catch (error) {
        console.error("Error fetching users:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user?.id]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading users...</Text>
      </View>
    );
  }

  if (users.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No users found.</Text>
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={{ padding: 10 }}
      data={users}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <UserList user={item} />}
    />
  );
}
