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
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { PostStackParamList } from "../screens/PostNav";

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
  avatar_url: string;
}

export default function ProjectTitleBox() {
  const [projectData, setProjectData] = useState<ProjectData[]>([]);
  const [profiles, setProfiles] = useState<ProfileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dropdownVisible, setDropdownVisible] = useState<{ [key: number]: boolean }>({});
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);
  const navigation = useNavigation<StackNavigationProp<PostStackParamList>>();

  // Fetch current user ID
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setLoggedInUserId(user.id);
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  // Function to fetch project data and profiles
  const fetchData = async () => {
    try {
      // Fetch projects
      const { data: projects, error: projectsError } = await supabase
        .from("projects")
        .select("*");
      if (projectsError) throw projectsError;

      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, avatar_url");
      if (profilesError) throw profilesError;

      // Map profiles to projects
      const projectsWithProfiles = projects.map((project) => {
        const profile = profiles.find((p) => p.id === project.user_id);
        return {
          ...project,
          avatar_url: profile?.avatar_url
            ? `https://jnqvgrycauzjnvepqorq.supabase.co/storage/v1/object/public/avatars/${profile.avatar_url}`
            : null,
        };
      });

      setProjectData(projectsWithProfiles);
      setProfiles(profiles);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Use useFocusEffect to fetch data when the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  // Subscribe to real-time updates
  useEffect(() => {
    const channel = supabase
      .channel("public:projects")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "projects" },
        (payload) => {
          if (payload.eventType === "DELETE") {
            // Remove deleted project from the local state
            setProjectData((prevProjects) =>
              prevProjects.filter((project) => project.project_id !== payload.old.project_id)
            );
          } else if (payload.eventType === "UPDATE") {
            // Update the project in the local state
            setProjectData((prevProjects) =>
              prevProjects.map((project) =>
                project.project_id === payload.new.project_id
                  ? { ...project, ...payload.new }
                  : project
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);


  //Dropdown
  const toggleDropdown = (projectId: number) => {
    setDropdownVisible((prev) => ({
      ...prev,
      [projectId]: !prev[projectId],
    }));
  };
  
  const handleEdit = (project: ProjectData) => {
    router.push({
      pathname: '/screens/EditProjectScreen', // Replace with your edit screen path
      params: { projectId: project.project_id }, // Pass the job ID to the edit screen
    });
    //navigation.navigate("EditProjectScreen", { projectId: project.project_id }); // Pass the project object
  };
  
  const handleDelete = async (projectId: number) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this project?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const { error } = await supabase
                .from("projects")
                .delete()
                .eq("project_id", projectId);

              if (error) throw error;

              // Remove the project from the local state
              setProjectData((prev) =>
                prev.filter((project) => project.project_id !== projectId)
              );
              Alert.alert("Success", "Project deleted successfully!");
            } catch (error) {
              console.error("Error deleting project:", error);
              Alert.alert("Error", "Failed to delete the project.");
            }
          },
        },
      ]
    );

    setDropdownVisible((prev) => ({ ...prev, [projectId]: false }));
  };

  const handleSave = async (projectId: number) => {
    try {
      const { error } = await supabase
        .from("projects")
        .update({ is_saved: true })
        .eq("project_id", projectId);

      if (error) throw error;

      // Update the local state
      setProjectData((prevProjects) =>
        prevProjects.map((project) =>
          project.project_id === projectId
            ? { ...project, is_saved: true }
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

      router.push(`../user?userId=${encodeURIComponent(user_id)}`);
    } catch (error) {
      console.error("Error applying to project:", error);
      Alert.alert(
        "Error",
        "Failed to apply for the project. Please try again."
      );
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

  if (projectData.length === 0) {
    return (
      <View style={styles.loader}>
        <Text style={{ color: "gray", fontSize: 16 }}>No Projects Found</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: ProjectData }) => (
    <View style={styles.card}>
      {/* Card Header */}
      <View style={styles.cardHeader}>
        <Text style={styles.title}>{item.project_title}</Text>
        {/* Show three dots only if the current user is the project owner */}
        {item.user_id === loggedInUserId && (
          <TouchableOpacity onPress={() => toggleDropdown(item.project_id)}>
            <MaterialIcons name="more-vert" size={24} color="black" />
          </TouchableOpacity>
        )}
      </View>

      {/* Dropdown Menu */}
      {dropdownVisible[item.project_id] && item.user_id === loggedInUserId && (
        <View style={styles.dropdown}>
          <TouchableOpacity
            style={styles.dropdownItem}
            onPress={() => handleEdit(item)}
          >
            <Text>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dropdownItem}
            onPress={() => handleDelete(item.project_id)}
          >
            <Text style={{ color: "red" }}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
  
      <View style={styles.userInfo}>
        <TouchableOpacity
          onPress={() => {
            router.push({
              pathname: "/screens/ProfileScreen",
              params: { userId: item.user_id },
            });
          }}
          accessible={true}
          accessibilityLabel={`View profile of ${item.user_name}`}
          accessibilityRole="button"
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
          disabled={item.is_saved}
        >
          <Text style={styles.buttonText}>
            {item.is_saved ? "Saved" : "Save"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.applyButton}
          onPress={() => handleApply(item.project_id, item.user_id)}
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
  saveButton: {
    backgroundColor: "#000",
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: "center",
  },
  applyButton: {
    backgroundColor: "#000",
    paddingVertical: 12,
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
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  dropdown: {
    position: "absolute",
    top: 40, // Adjust based on your layout
    right: 0,
    backgroundColor: "white",
    borderRadius: 4,
    padding: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 1,
  },
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  }
});