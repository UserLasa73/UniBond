import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const StatusJobs: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Job Card */}
      <View style={styles.card}>
        {/* Title */}
        <Text style={styles.title}>No Job Applications Yet</Text>

        {/* User Info */}
        <View style={styles.userInfo}>
          <Image
            source={{ uri: "https://via.placeholder.com/40" }}
            style={styles.avatar}
          />
          <View style={styles.textGroup}>
            <Text style={styles.name}>Company Name</Text>
            <Text style={styles.location}>Location</Text>
            <Text style={styles.date}>Posted Date</Text>
          </View>
        </View>

        {/* Job Details */}
        <View style={styles.details}>
          <View style={styles.row}>
            <Ionicons name="briefcase-outline" size={20} color="gray" />
            <Text style={styles.detailText}>Time • Next week</Text>
          </View>
          <View style={styles.row}>
            <MaterialIcons name="article" size={20} color="gray" />
            <Text style={styles.detailText}>
              Skills: Communication, Consultative Selling, +8 more
            </Text>
          </View>
          {/* Job Status */}
          <View style={styles.row}>
            <Ionicons name="checkbox" size={20} color="gray" />
            <Text style={styles.detailText}>
              Status: <Text style={styles.status}>Accepted</Text>
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default StatusJobs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20, // Adds some top padding to avoid content sticking to the top
    backgroundColor: "#fff",
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
    width: "90%",
    marginTop: 10, // Add top margin for spacing
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
  status: {
    color: "green", // Green color for Accepted status
    fontWeight: "bold",
  },
});
