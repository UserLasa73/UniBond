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
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { supabase } from "../lib/supabse";

interface ProjectData {
  project_id: number;
  user_id: string;
  user_name: string;
  project_title: string;
  location: string;
  date_posted: string;
  project_status: string;
  skills: string;
  is_saved: boolean;
  is_applied: boolean;
  avatar_url: string;
  id: string;
}

export default function ProjectTitleBox() {
  const [projectData, setProjectData] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch project data
  const fetchData = async () => {
    try {
      // Fetch projects data
      const { data: projects, error: projectError } = await supabase
        .from("projects")
        .select("*");

      if (projectError) throw projectError;

      // If there are no projects, set empty and return
      if (!projects || projects.length === 0) {
        setProjectData([]);
        return;
      }

      // Get all unique user_ids from projects
      const userIds = [...new Set(projects.map((project) => project.user_id))];

      if (userIds.length === 0) {
        setProjectData([]);
        return;
      }

      // Fetch profiles data for these user_ids
      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("id, avatar_url")
        .in("id", userIds);

      if (profileError) throw profileError;

      // Create a map of user_id to avatar_url
      const avatarMap: Record<string, string> = {};
      profiles.forEach((profile) => {
        avatarMap[profile.id] = profile.avatar_url;
      });

      // Merge avatar_url into projects data
      const projectsWithAvatars = projects.map((project) => ({
        ...project,
        avatar_url: avatarMap[project.user_id],
      }));

      setProjectData(projectsWithAvatars);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Use useFocusEffect to fetch data when the screen is focused
  useFocusEffect(
    useCallback(() => {
      const fetch = async () => {
        await fetchData();
      };
      fetch();
    }, [])
  );

  const handleSave = async (projectId: number) => {
    try {
      const { error } = await supabase
        .from("projects")
        .update({ is_saved: true })
        .eq("project_id", projectId);

      if (error) throw error;

      // Update the local state by modifying the specific project
      setProjectData((prevProjects) =>
        prevProjects.map((project) =>
          project.project_id === projectId
            ? { ...project, is_saved: true } // Mark this project as saved
            : project
        )
      );

      Alert.alert("Success", "Project saved successfully!");
    } catch (error) {
      console.error("Error saving project:", error);
      Alert.alert("Error", "Failed to save the project. Please try again.");
    }
  };

  const handleApply = async (projectId: number, user_id?: string) => {
    try {
      if (!user_id) {
        Alert.alert("Error", "User information is missing. Please try again.");
        return;
      }

      const { error } = await supabase
        .from("projects")
        .update({ is_applied: true })
        .eq("project_id", projectId);

      if (error) throw error;

      setProjectData((prevProjects) =>
        prevProjects.map((project) =>
          project.project_id === projectId
            ? { ...project, is_applied: true }
            : project
        )
      );

      Alert.alert("You Can Send Message to applied for the project!");

      // Navigate only if userId is valid
      router.push(`../user?userId=${encodeURIComponent(user_id)}`);
    } catch (error) {
      console.error("Error applying to project:", error);
      Alert.alert(
        "Error",
        "Failed to apply for the project. Please try again."
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#000" />
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

  const renderItem = ({ item }: { item: ProjectData }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.project_title}</Text>
      <View style={styles.userInfo}>
        <Image
          source={{ uri: item.avatar_url }}
          style={styles.avatar}
        />
        <View style={styles.textGroup}>
          <Text style={styles.name}>User : {item.user_name}</Text>
          <Text style={styles.location}>{item.location}</Text>
          <Text style={styles.date}>
            {new Date(item.date_posted).toLocaleDateString()}
          </Text>
        </View>
      </View>
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
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => handleSave(item.project_id)}
          disabled={item.is_saved} // Disable if the project is saved
        >
          <Text style={styles.buttonText}>
            {item.is_saved ? "Saved" : "Save"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.applyButton}
          onPress={() => handleApply(item.project_id, item.user_id)} // ✅ Ensure user_id is passed
        >
          <Text style={styles.buttonText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <FlatList
      data={projectData}
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
  saveButton: {
    backgroundColor: "#000",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: "center",
  },
  applyButton: {
    backgroundColor: "#000",
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
