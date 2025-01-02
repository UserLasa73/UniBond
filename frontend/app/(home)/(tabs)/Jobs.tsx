import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Import renamed components
import AvailableJobs from "../../Components/JobComponents/AvailableJobs";
import SavedJobs from "../../Components/JobComponents/SavedJobs";
import StatusJobs from "../../Components/JobComponents/StatusJobs";

const Jobs: React.FC = () => {
  const [selectedTab, setSelectedTab] = React.useState<
    "Available" | "Saved" | "Status"
  >("Available");

  const renderContent = () => {
    if (selectedTab === "Available") {
      return <AvailableJobs />;
    } else if (selectedTab === "Saved") {
      return <SavedJobs />;
    } else if (selectedTab === "Status") {
      return <StatusJobs />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Jobs</Text>
      </View>
      <View style={styles.tabsContainer}>
        {[
          { name: "Available", icon: "briefcase-outline" },
          { name: "Saved", icon: "bookmark-outline" },
          { name: "Status", icon: "information-circle-outline" },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.name}
            style={[styles.tab, selectedTab === tab.name && styles.selectedTab]}
            onPress={() =>
              setSelectedTab(tab.name as "Available" | "Saved" | "Status")
            }
          >
            <Ionicons
              name={tab.icon}
              size={20}
              color={selectedTab === tab.name ? "#2C3036" : "#8E8E93"}
            />
            <Text
              style={[
                styles.tabText,
                selectedTab === tab.name && styles.selectedTabText,
              ]}
            >
              {tab.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {renderContent()}
    </View>
  );
};

export default Jobs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 20,
  },
  header: {
    backgroundColor: "#fff",
    paddingVertical: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#f8f8f8",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tab: {
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  selectedTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#2C3036",
  },
  tabText: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 5,
  },
  selectedTabText: {
    color: "#2C3036",
    fontWeight: "bold",
  },
});
