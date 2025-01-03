import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  level: string;
  time: string;
  skills: string[];
}

interface AvailableJobsProps {
  jobListings: JobListing[];
}

const AvailableJobs: React.FC<AvailableJobsProps> = ({ jobListings }) => {
  return (
    <ScrollView style={styles.container}>
      {jobListings.length === 0 ? (
        <View style={styles.card}>
          {/* Title */}
          <Text style={styles.title}>No Jobs Available</Text>

          {/* User Info */}
          <View style={styles.userInfo}>
            <Image
              source={{ uri: "https://via.placeholder.com/40" }}
              style={styles.avatar}
            />
            <View style={styles.textGroup}>
              <Text style={styles.name}>No Data</Text>
              <Text style={styles.location}>Please check back later</Text>
              <Text style={styles.date}>N/A</Text>
            </View>
          </View>

          {/* Job Details */}
          <View style={styles.details}>
            <View style={styles.row}>
              <Ionicons name="briefcase-outline" size={20} color="gray" />
              <Text style={styles.detailText}>Time • N/A</Text>
            </View>
            <View style={styles.row}>
              <MaterialIcons name="article" size={20} color="gray" />
              <Text style={styles.detailText}>Skills: N/A</Text>
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.saveButton}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton}>
              <Text style={styles.buttonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        jobListings.map((job) => (
          <View key={job.id} style={styles.card}>
            {/* Title */}
            <Text style={styles.title}>{job.title}</Text>

            {/* User Info */}
            <View style={styles.userInfo}>
              <Image
                source={{ uri: "https://via.placeholder.com/40" }}
                style={styles.avatar}
              />
              <View style={styles.textGroup}>
                <Text style={styles.name}>{job.company}</Text>
                <Text style={styles.location}>{job.location}</Text>
                <Text style={styles.date}>{job.time}</Text>
              </View>
            </View>

            {/* Job Details */}
            <View style={styles.details}>
              <View style={styles.row}>
                <Ionicons name="briefcase-outline" size={20} color="gray" />
                <Text style={styles.detailText}>{job.type} - {job.level}</Text>
              </View>
              <View style={styles.row}>
                <MaterialIcons name="article" size={20} color="gray" />
                <Text style={styles.detailText}>
                  Skills: {job.skills.join(", ")}
                </Text>
              </View>
            </View>

            {/* Buttons */}
            <View style={styles.buttonGroup}>
              <TouchableOpacity style={styles.saveButton}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyButton}>
                <Text style={styles.buttonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default AvailableJobs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
