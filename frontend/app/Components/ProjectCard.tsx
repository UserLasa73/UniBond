import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

interface ProjectItem {
  project_id: string;
  project_title: string;
  user_id: string;
  user_name: string;
  avatar_url?: string;
  location: string;
  date_posted: string;
  time_posted: string;
  project_status: string;
  skills: string;
  is_saved: boolean;
}

interface ProjectCardProps {
  item: ProjectItem;
  handleSave: (projectId: string) => void;
  handleApply: (projectId: string, userId: string) => void;
  calculatePostDuration: (datePosted: string, timePosted: string) => string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  item,
  handleSave,
  handleApply,
  calculatePostDuration,
}) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const handleEdit = () => {
    setDropdownVisible(false);
    Alert.alert("Edit", "Edit functionality goes here.");
  };

  const handleDelete = () => {
    setDropdownVisible(false);
    Alert.alert("Delete", "Delete functionality goes here.");
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.title}>{item.project_title}</Text>
        <TouchableOpacity onPress={toggleDropdown}>
          <MaterialIcons name="more-vert" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Dropdown Menu */}
      <Modal
        transparent={true}
        visible={isDropdownVisible}
        onRequestClose={() => setDropdownVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setDropdownVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.dropdownMenu}>
              <TouchableOpacity style={styles.dropdownItem} onPress={handleEdit}>
                <Text>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dropdownItem} onPress={handleDelete}>
                <Text>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

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
};

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
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  dropdownMenu: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    width: 150,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dropdownItem: {
    paddingVertical: 8,
  },
});

export default ProjectCard;