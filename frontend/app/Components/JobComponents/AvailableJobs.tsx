import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { supabase } from "../../lib/supabse"; // Make sure your Supabase client is properly imported

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

const AvailableJobs: React.FC = () => {
  const [jobListings, setJobListings] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        // Fetch data from the 'jobs' table in Supabase
        const { data, error } = await supabase.from("jobs").select("*").eq("is_active", true); // Adjust the query as per your table

        if (error) {
          console.error("Error fetching jobs:", error.message);
        } else {
          setJobListings(data || []); // Store the fetched job listings
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs(); // Call fetch function on component mount
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading jobs...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {jobListings.length === 0 ? (
        <View style={styles.card}>
          <Text style={styles.title}>No Jobs Available</Text>
          <Text style={styles.subtitle}>Please check back later.</Text>
        </View>
      ) : (
        jobListings.map((job) => (
          <View key={job.id} style={styles.card}>
            <Text style={styles.title}>{job.title}</Text>
            <View style={styles.userInfo}>
              <Image
                source={{ uri: "https://via.placeholder.com/40" }} // Use an actual logo or avatar URL for the company
                style={styles.avatar}
              />
              <View style={styles.textGroup}>
                <Text style={styles.name}>{job.company}</Text>
                <Text style={styles.location}>{job.location}</Text>
                <Text style={styles.date}>{job.time}</Text>
              </View>
            </View>
            <View style={styles.details}>
              <View style={styles.row}>
                <Ionicons name="briefcase-outline" size={20} color="gray" />
                <Text style={styles.detailText}>{job.type} - {job.level}</Text>
              </View>
              <View style={styles.row}>
                <MaterialIcons name="article" size={20} color="gray" />
                <Text style={styles.detailText}>
                  Skills: {job.skills.join(", ")} {/* Display skills as comma-separated */}
                </Text>
              </View>
            </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "gray",
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
  subtitle: {
    fontSize: 14,
    color: "gray",
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
