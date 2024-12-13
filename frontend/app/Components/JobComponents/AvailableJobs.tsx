import React from "react";
import { View, Text, StyleSheet, ScrollView, Button, Image } from "react-native";

interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  level: string;
  time: string;
  skills: string[];
  logoUrl?: string; // Optional field for the company's logo URL
}

interface AvailableJobsProps {
  jobListings: JobListing[];
  savedJobs: string[]; // Array of saved job IDs
  onSaveJob: (jobId: string) => void; // Callback to handle saving the job
  onApplyJob: (jobId: string) => void; // Callback to handle applying for the job
}

const AvailableJobs: React.FC<AvailableJobsProps> = ({
  jobListings,
  savedJobs,
  onSaveJob,
  onApplyJob,
}) => {
  const isEmpty = jobListings.length === 0;

  return (
    <ScrollView style={styles.container}>
      {isEmpty ? (
        <View style={styles.jobCard}>
          {/* Placeholder Card Design without an image */}
          <View style={styles.header}>
            <View style={styles.companyLogo} /> {/* Empty logo container */}
            <View style={styles.textContainer}>
              <Text style={styles.placeholderTitle}>Job title</Text>
              <Text style={styles.placeholderCompany}>Company name</Text>
              <Text style={styles.placeholderLocation}>Job location</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <Text style={styles.placeholderDetails}>
            Full-time · Mid-Senior level
          </Text>
          <Text style={styles.placeholderSkills}>
            Skills: Communication, Consultative Selling, +8 more
          </Text>
          <View style={styles.buttonContainer}>
            <Button title="Save" onPress={() => alert("Placeholder Save")} />
            <Button title="Apply" onPress={() => alert("Placeholder Apply")} />
          </View>
        </View>
      ) : (
        jobListings.map((job) => {
          const isSaved = savedJobs.includes(job.id);

          return (
            <View key={job.id} style={styles.jobCard}>
              <View style={styles.header}>
                {job.logoUrl ? (
                  <Image
                    source={{ uri: job.logoUrl }} // Load company logo from URL if available
                    style={styles.companyLogo}
                  />
                ) : (
                  <View style={styles.companyLogo} /> // Empty container if no logo URL
                )}
                <View style={styles.textContainer}>
                  <Text style={styles.jobTitle}>{job.title}</Text>
                  <Text style={styles.jobCompany}>{job.company}</Text>
                  <Text style={styles.jobLocation}>{job.location}</Text>
                </View>
              </View>
              <View style={styles.divider} />
              <Text style={styles.jobDetails}>
                {job.type} · {job.level}
              </Text>
              <Text style={styles.jobSkills}>
                Skills: {job.skills.join(", ")}
              </Text>
              <View style={styles.buttonContainer}>
                <Button
                  title={isSaved ? "Saved" : "Save"}
                  onPress={() => onSaveJob(job.id)}
                  color={isSaved ? "#888" : "#007BFF"} // Change color when saved
                />
                <Button
                  title="Apply"
                  onPress={() => onApplyJob(job.id)}
                  color="#007BFF" // Apply button color
                />
              </View>
            </View>
          );
        })
      )}
    </ScrollView>
  );
};

export default AvailableJobs;

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
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  companyLogo: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: "#e0e0e0", // Placeholder background
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  placeholderTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#aaa",
  },
  placeholderCompany: {
    fontSize: 16,
    color: "#ccc",
  },
  placeholderLocation: {
    fontSize: 14,
    color: "#ddd",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 10,
  },
  placeholderDetails: {
    fontSize: 14,
    color: "#bbb",
    marginBottom: 5,
  },
  placeholderSkills: {
    fontSize: 14,
    color: "#aaa",
    marginBottom: 10,
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
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});
