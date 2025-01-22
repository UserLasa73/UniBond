import React, { useState, useEffect } from "react";
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
import supabase from "../../lib/supabse";

interface ProjectData {
  project_id: number;
  user_id: string;
  project_title: string;
  location: string;
  date_posted: string;
  project_status: string;
  skills: string;
  is_saved: boolean;
  is_applied: boolean;
}

export default function Saved_project() {
  const [savedProjects, setSavedProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedProjects = async () => {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .eq("is_saved", true);

        if (error) throw error;

        setSavedProjects(data || []);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error fetching saved projects:", error.message);
        } else {
          console.error("Error fetching saved projects:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSavedProjects();
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
      if (error instanceof Error) {
        console.error("Error unsaving project:", error.message);
        Alert.alert("Error", "Failed to unsave the project. Please try again.");
      } else {
        console.error("Error unsaving project:", error);
      }
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
      {/* Title */}
      <Text style={styles.title}>{item.project_title}</Text>

      {/* User Info */}
      <View style={styles.userInfo}>
        <Image
          source={{ uri: "https://via.placeholder.com/40" }} // Replace with actual user image URL if available
          style={styles.avatar}
        />
        <View style={styles.textGroup}>
          <Text style={styles.name}>User ID: {item.user_id}</Text>
          <Text style={styles.location}>{item.location}</Text>
          <Text style={styles.date}>
            {new Date(item.date_posted).toLocaleDateString()}
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
