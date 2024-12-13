import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { JobListing } from "./AvailableJobs"; // Import JobListing interface

interface SavedJobsProps {
  savedJobs: string[];
  jobListings: JobListing[];
}

const SavedJobs: React.FC<SavedJobsProps> = ({ savedJobs, jobListings }) => {
  const savedJobDetails = jobListings.filter((job) =>
    savedJobs.includes(job.id)
  );

  return (
    <ScrollView style={styles.container}>
      {savedJobDetails.length > 0 ? (
        savedJobDetails.map((job) => (
          <View key={job.id} style={styles.jobCard}>
            <Text style={styles.jobTitle}>{job.title}</Text>
            <Text style={styles.jobCompany}>{job.company}</Text>
            <Text style={styles.jobLocation}>{job.location}</Text>
            <Text style={styles.jobDetails}>
              {job.type} · {job.level}
            </Text>
            <Text style={styles.jobSkills}>
              Skills: {job.skills.join(", ")}
            </Text>
          </View>
        ))
      ) : (
        <Text>No saved jobs</Text>
      )}
    </ScrollView>
  );
};

export default SavedJobs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f0f0f0",
  },
  jobCard: {
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  jobCompany: {
    fontSize: 16,
    color: "#555",
  },
  jobLocation: {
    fontSize: 14,
    color: "#777",
  },
  jobDetails: {
    fontSize: 14,
    color: "#888",
    marginVertical: 5,
  },
  jobSkills: {
    fontSize: 14,
    color: "#999",
  },
});
