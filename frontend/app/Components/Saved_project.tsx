import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Alert,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import supabase from "../../lib/supabse";

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

export default function Saved_project() {
  const [savedProjects, setSavedProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<ProfileData[]>([]);

  // Fetch saved projects
  const fetchSavedProjects = async () => {
    try {
      setLoading(true);
      
      // Fetch saved projects
      const { data: projects, error: projectsError } = await supabase
        .from("projects")
        .select("*")
        .eq("is_saved", true);

      if (projectsError) throw projectsError;

      // Fetch all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, avatar_url, username");

      if (profilesError) throw profilesError;

      setProfiles(profiles || []);

      // Combine projects with profile data
      const projectsWithProfiles = (projects || []).map(project => {
        const profile = profiles?.find(p => p.id === project.user_id);
        return {
          ...project,
          avatar_url: profile?.avatar_url 
            ? `https://jnqvgrycauzjnvepqorq.supabase.co/storage/v1/object/public/avatars/${profile.avatar_url}`
            : undefined,
          user_name: profile?.username || project.user_name
        };
      });

      setSavedProjects(projectsWithProfiles);
    } catch (error) {
      console.error("Error fetching data:", error);
      Alert.alert("Error", "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchSavedProjects();
    }, [])
  );

  // Subscribe to real-time updates
  useEffect(() => {
    const channel = supabase
      .channel("public:projects")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "projects" },
        (payload) => {
          setSavedProjects((prevProjects) =>
            prevProjects.map((project) =>
              project.project_id === payload.new.project_id
                ? { ...project, ...payload.new }
                : project
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleUnsave = async (projectId: number) => {
    try {
      const { error } = await supabase
        .from("projects")
        .update({ is_saved: false })
        .eq("project_id", projectId);

      if (error) throw error;

      // Update local state by removing the unsaved project
      setSavedProjects((prevProjects) =>
        prevProjects.filter((project) => project.project_id !== projectId)
      );

      Alert.alert("Success", "Project unsaved successfully!");
    } catch (error) {
      console.error("Error unsaving project:", error);
      Alert.alert("Error", "Failed to unsave the project. Please try again.");
    }
  };

  const handleApply = async (projectId: number) => {
    try {
      const { error } = await supabase
        .from("projects")
        .update({ is_applied: true })
        .eq("project_id", projectId);

      if (error) throw error;

      // Update local state by removing the applied project
      setSavedProjects((prevProjects) =>
        prevProjects.filter((project) => project.project_id !== projectId)
      );

      // Display success message
      Alert.alert("Success", "You have successfully applied to the project!");

    } catch (error) {
      if (error instanceof Error) {
        console.error("Error applying to project:", error.message);
        Alert.alert("Error", "Failed to apply to the project. Please try again.");
      } else {
        console.error("Error applying to project:", error);
      }
    }
  };

  const calculatePostDuration = (datePosted: string, timePosted: string) => {
    const postDateTime = new Date(`${datePosted}T${timePosted}`); // Combine and parse

    // Check if the date is valid
    if (isNaN(postDateTime.getTime())) {
      throw new Error("Invalid date or time format");
    }

    const currentDate = new Date();
    const timeDifference = currentDate.getTime() - postDateTime.getTime();

    // Handle case where the post date is in the future
    if (timeDifference < 0) {
      return "Just now";
    }

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 7) {
      return postDateTime.toLocaleDateString("en-US", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      });
    } else if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else {
      return "Just now";
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (savedProjects.length === 0) {
    return (
      <View style={styles.loader}>
        <Text style={{ color: "gray", fontSize: 16 }}>No Saved Projects Found</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: ProjectData }) => (
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
          source={{ uri: item.avatar_url || "https://via.placeholder.com/40" }}
          style={styles.avatar}
        />
      </TouchableOpacity>
        <View style={styles.textGroup}>
          <Text style={styles.name}>{item.user_name}</Text>
          <Text style={styles.description}>{item.description}</Text>
          <Text style={styles.location}>{item.location}</Text>
          <Text style={styles.date}>
          {calculatePostDuration(item.date_posted, item.time_posted)}
          </Text>
        </View>
      </View>

      {/* Job Details */}
      <View style={styles.details}>
        <View style={styles.row}>
          <Ionicons name="briefcase-outline" size={20} color="gray" />
          <Text style={styles.detailText}>Status: {item.project_status}</Text>
        </View>
        <View style={styles.row}>
          <MaterialIcons name="article" size={20} color="gray" />
          <Text style={styles.detailText}>Skills: {item.skills}</Text>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={styles.applyButton}
          onPress={() => handleApply(item.project_id)}
        >
          <Text style={styles.buttonText}>Apply</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.unsaveButton}
          onPress={() => handleUnsave(item.project_id)}
        >
          <Text style={styles.buttonText}>Unsave</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <FlatList
      data={savedProjects}
      renderItem={renderItem}
      keyExtractor={(item) => item.project_id.toString()}
    />
  );
}

const styles = StyleSheet.create({
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
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  textGroup: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  description: {
    fontSize: 16,
    fontWeight: "400",
    marginBottom: 5,
  },
  location: {
    fontSize: 14,
    color: "gray",
  },
  date: {
    fontSize: 12,
    color: "gray",
  },
  details: {
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: "gray",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  applyButton: {
    backgroundColor: "#000",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: "center",
  },
  unsaveButton: {
    backgroundColor: "#f00",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
