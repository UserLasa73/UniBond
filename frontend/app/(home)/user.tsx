import { useEffect, useState } from "react";
import { FlatList, Text } from "react-native";
import { supabase } from "../lib/supabse";
import { useAuth } from "../providers/AuthProvider";
import { User } from "stream-chat-expo";
import UserList from "../Components/UserList";

export default function UserScreen() {
  const [users, setUsers] = useState([]);
  const { user } = useAuth();
  useEffect(() => {
    const fetchUsers = async () => {
      let { data: profiles, error } = await supabase
        .from("profiles")
        .select("*")
        .neq("id", user?.id);
      setUsers(profiles);
    };
    fetchUsers();
  }, []);
  return (
    <FlatList
      contentContainerStyle={{ gap: 10 }}
      data={users}
      renderItem={({ item }) => <UserList user={item} />}
    />
  );
}
