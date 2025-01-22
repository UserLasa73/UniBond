import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, ActivityIndicator, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import supabase from "../../lib/supabse";

// Interface for project data structure
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

export default function ProjectStatus() {
  const [projectData, setProjectData] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch project data from Supabase
  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const { data, error } = await supabase
          .from("projects") // Assuming your table name is 'projects'
          .select("*")
          //.eq("project_status", "In Progress"); // Filter by status "Pending"
        
        if (error) throw error;
        setProjectData(data || []);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error fetching project data:", error.message);
        } else {
          console.error("Error fetching project data:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, []);

  // Loading state while fetching data
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  // If no project data found
  if (projectData.length === 0) {
    return (
      <View style={styles.loader}>
        <Text style={{ color: "gray", fontSize: 16 }}>No Projects Found</Text>
      </View>
    );
  }

  // Render a single project card
  const renderProjectCard = ({ item }: { item: ProjectData }) => (
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
          <Text style={styles.name}>User : {item.user_name}</Text>
          <Text style={styles.status}>Status: {item.project_status}</Text>
          <View style={styles.row}>
            <Ionicons name="time-outline" size={16} color="black" style={{ marginRight: 4 }} />
            <Text style={styles.date}>{new Date(item.date_posted).toLocaleDateString()}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View>
      <FlatList
        data={projectData}
        renderItem={renderProjectCard}
        keyExtractor={(item) => item.project_id.toString()}
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
  status: {
    fontSize: 14,
    color: "gray",
  },
  date: {
    fontSize: 12,
    color: "gray",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  flatListContent: {
    paddingBottom: 16,
  },
});
