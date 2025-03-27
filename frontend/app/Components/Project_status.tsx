import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, ActivityIndicator, FlatList, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router"; // Added missing import
import supabase from "../../lib/supabse";

// Interface for project data structure
interface ProjectData {
  project_id: number;
  user_id: string;
  user_name: string;
  description: string;
  project_title: string;
  location: string;
  date_posted: string;
  project_status: string;
  skills: string;
  is_saved: boolean;
  is_applied: boolean;
  time_posted: string;
  avatar_url?: string;
}

interface ProfileData {
  id: string;
  avatar_url?: string;
  username: string;
}

export default function ProjectStatus() {
  const [projectData, setProjectData] = useState<ProjectData[]>([]);
  const [profiles, setProfiles] = useState<ProfileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Added error state

  // Fetch project data and profiles from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch projects
        const { data: projects, error: projectsError } = await supabase
          .from("projects")
          .select("*");

        if (projectsError) throw projectsError;

        // Fetch profiles with username
        const { data: profiles, error: profilesError } = await supabase
          .from("profiles")
          .select("id, avatar_url, username");

        if (profilesError) throw profilesError;

        setProfiles(profiles || []);

        // Map profiles to projects with proper error handling for avatar URLs
        const projectsWithProfiles = (projects || []).map((project) => {
          const profile = profiles?.find((p) => p.id === project.user_id);
          return {
            ...project,
            avatar_url: profile?.avatar_url
              ? `https://jnqvgrycauzjnvepqorq.supabase.co/storage/v1/object/public/avatars/${profile.avatar_url}`
              : undefined,
            user_name: profile?.username || project.user_name // Use profile username if available
          };
        });

        setProjectData(projectsWithProfiles);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load projects. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Set up real-time subscription
    const channel = supabase
      .channel('projects')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
        fetchData(); // Refresh data when projects change
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Improved calculatePostDuration with better error handling
  const calculatePostDuration = (datePosted: string, timePosted: string) => {
    try {
      const postDateTime = new Date(`${datePosted}T${timePosted}`);
      
      if (isNaN(postDateTime.getTime())) {
        return "Recently";
      }

      const currentDate = new Date();
      const timeDifference = currentDate.getTime() - postDateTime.getTime();

      if (timeDifference < 0) return "Just now";

      const seconds = Math.floor(timeDifference / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (days > 7) {
        return postDateTime.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      } else if (days > 0) {
        return `${days} day${days > 1 ? "s" : ""} ago`;
      } else if (hours > 0) {
        return `${hours} hour${hours > 1 ? "s" : ""} ago`;
      } else if (minutes > 0) {
        return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
      }
      return "Just now";
    } catch (e) {
      console.error("Error calculating post duration:", e);
      return "Recently";
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loader}>
        <Text style={{ color: "red", fontSize: 16 }}>{error}</Text>
        <TouchableOpacity onPress={() => setLoading(true)}>
          <Text style={{ color: "blue", marginTop: 10 }}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (projectData.length === 0) {
    return (
      <View style={styles.loader}>
        <Text style={{ color: "gray", fontSize: 16 }}>No Projects Found</Text>
      </View>
    );
  }

  const renderProjectCard = ({ item }: { item: ProjectData }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.project_title}</Text>

      <View style={styles.userInfo}>
        <TouchableOpacity
          onPress={() => {
            router.push({
              pathname: "/screens/ProfileScreen",
              params: { userId: item.user_id },
            });
          }}
        >
          <Image
            source={{ 
              uri: item.avatar_url || "https://via.placeholder.com/40",
              cache: 'force-cache' // Better performance
            }}
            style={styles.avatar}
            onError={() => console.log("Failed to load avatar")}
          />
        </TouchableOpacity>
        <View style={styles.textGroup}>
          <Text style={styles.name}>{item.user_name}</Text>
          <Text style={styles.description} numberOfLines={3} ellipsizeMode="tail">
            {item.description}
          </Text>
          <Text style={styles.status}>Status: {item.project_status}</Text>
          <View style={styles.row}>
            <Ionicons name="time-outline" size={16} color="gray" style={{ marginRight: 4 }} />
            <Text style={styles.date}>
              {calculatePostDuration(item.date_posted, item.time_posted)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={projectData}
        renderItem={renderProjectCard}
        keyExtractor={(item) => item.project_id.toString()}
        contentContainerStyle={styles.flatListContent}
        ListEmptyComponent={
          <View style={styles.loader}>
            <Text style={{ color: "gray", fontSize: 16 }}>No Projects Found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    margin: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  description: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
    lineHeight: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#222",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 0,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: "#eee",
  },
  textGroup: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    color: "#222",
  },
  status: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: "#999",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  flatListContent: {
    paddingBottom: 16,
  },
});