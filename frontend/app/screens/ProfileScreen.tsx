import { useState, useEffect } from "react";
import { supabase } from "../lib/supabse";
import { StyleSheet, View, Alert, ScrollView } from "react-native";
import { Button, Input } from "@rneui/themed";
import { useAuth } from "../providers/AuthProvider";
import { useRouter, useLocalSearchParams } from "expo-router";
import Avatar from "../Components/Avatar";

export default function ProfileScreen() {
  const { session } = useAuth();
  const router = useRouter();
  const { userId } = useLocalSearchParams(); // Get userId from route params
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");

  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    if (userId || session) getProfile(); // Fetch profile based on userId or session
  }, [userId, session]);

  async function getProfile() {
    try {
      setLoading(true);
      const profileId = userId || session?.user?.id;
      if (!profileId) throw new Error("No user or session available!");

      const { data, error, status } = await supabase
        .from("profiles")
        .select(`username, avatar_url, full_name`)
        .eq("id", profileId)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);

        setAvatarUrl(data.avatar_url);
        setFullname(data.full_name);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({
    username,

    avatar_url,
    full_name,
  }: {
    username: string;

    avatar_url: string;
    full_name: string;
  }) {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const updates = {
        id: session?.user.id,
        username,

        avatar_url,
        full_name,
        updated_at: new Date(),
      };

      const { error } = await supabase.from("profiles").upsert(updates);

      if (error) {
        throw error;
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={{ alignItems: "center" }}>
        <Avatar
          size={200}
          url={avatarUrl}
          onUpload={(url: string) => {
            setAvatarUrl(url);
            updateProfile({
              username,

              avatar_url: url,
              full_name: fullname,
            });
          }}
        />
      </View>

      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input label="Email" value={session?.user?.email} disabled />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Username"
          value={username || ""}
          onChangeText={(text) => setUsername(text)}
          disabled={!!userId} // Disable editing if viewing another user's profile
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Fullname"
          value={fullname || ""}
          onChangeText={(text) => setFullname(text)}
          disabled={!!userId} // Disable editing if viewing another user's profile
        />
      </View>

      {!userId && (
        <View style={[styles.verticallySpaced, styles.mt20]}>
          <Button
            title={loading ? "Loading ..." : "Update"}
            onPress={() =>
              updateProfile({
                username: username,

                avatar_url: avatarUrl,
                full_name: fullname,
              })
            }
            disabled={loading}
          />
        </View>
      )}

      {!userId && (
        <View style={styles.verticallySpaced}>
          <Button
            title="Sign Out"
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
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
});
