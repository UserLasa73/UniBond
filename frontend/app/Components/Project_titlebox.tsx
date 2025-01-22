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
  user_name: string;
  project_title: string;
  location: string;
  date_posted: string;
  project_status: string;
  skills: string;
  is_saved: boolean;
  is_applied: boolean;
}

export default function ProjectTitleBox() {
  const [projectData, setProjectData] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase.from("projects").select("*");
        if (error) throw error;
        setProjectData(data || []);
      } catch (error) {
        console.error("Error fetching project data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSave = async (projectId: number) => {
    try {
      // Update the database
      const { error } = await supabase
        .from("projects")
        .update({ is_saved: true })
        .eq("project_id", projectId);

      if (error) throw error;

      // Update the local state by removing the saved project
      setProjectData((prevProjects) =>
        prevProjects.filter((project) => project.project_id !== projectId)
      );

      // Display success message
      Alert.alert("Success", "Project saved successfully!");
    } catch (error) {
      console.error("Error saving project:", error);
      Alert.alert("Error", "Failed to save the project. Please try again.");
    }
  };

  const handleApply = async (projectId: number) => {
    try {
      // Update the `is_applied` status in the database
      const { error } = await supabase
        .from("projects")
        .update({ is_applied: true })
        .eq("project_id", projectId);

      if (error) throw error;

      // Update the local state by removing the applied project
      setProjectData((prevProjects) =>
        prevProjects.filter((project) => project.project_id !== projectId)
      );

      // Display success message
      Alert.alert("Success", "You have applied for the project!");
    } catch (error) {
      console.error("Error applying to project:", error);
      Alert.alert("Error", "Failed to apply for the project. Please try again.");
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
          source={{ uri: "https://via.placeholder.com/40" }}
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
        >
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.applyButton}
          onPress={() => handleApply(item.project_id)}
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
