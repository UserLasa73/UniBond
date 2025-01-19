import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { supabase } from "@/app/lib/supabse"; // Assuming this path for your supabase client

interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  level: string;
  time: string;
  skills: string;
  description: string;
  is_active: boolean;
}

const StatusJobs: React.FC = () => {
  const [jobListings, setJobListings] = useState<JobListing[]>([]);
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null); // Store authenticated user
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true); // Set loading state to true

      try {
        // Get the logged-in user
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError) {
          console.error("Error fetching user:", userError.message);
          return;
        }
        const currentUser = userData?.user;
        setUser(currentUser);

        if (currentUser) {
          // Fetch job_ids from the applications table for the current user
          const { data: applicationData, error: applicationError } = await supabase
            .from("applications")
            .select("job_id")
            .eq("user_id", currentUser.id);

          if (applicationError) {
            console.error("Error fetching applications:", applicationError.message);
            return;
          }

          // Extract job IDs from the application data
          const jobIds = applicationData?.map((application) => application.job_id) || [];

          if (jobIds.length > 0) {
            // Fetch job details from the jobs table
            const { data: jobData, error: jobError } = await supabase
              .from("jobs")
              .select("*")
              .in("id", jobIds);

            if (jobError) {
              console.error("Error fetching job details:", jobError.message);
              return;
            }

            setJobListings(jobData || []);
          } else {
            setJobListings([]); // No jobs found
          }
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      } finally {
        setIsLoading(false); // Set loading state to false
      }
    };

    fetchJobs();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedJobId((prevId) => (prevId === id ? null : id)); // Toggle between expanded and collapsed
  };

  const renderItem = ({ item }: { item: JobListing }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <View style={styles.userInfo}>
        <View style={styles.textGroup}>
          <Text style={styles.name}>{item.company}</Text>
          <Text style={styles.location}>{item.location}</Text>
          <Text style={styles.date}>{item.time}</Text>
        </View>
      </View>
      <View style={styles.details}>
        <View style={styles.row}>
          <Ionicons name="briefcase-outline" size={20} color="gray" />
          <Text style={styles.detailText}>
            {item.type} - {item.level}
          </Text>
        </View>
        <View style={styles.row}>
          <MaterialIcons name="article" size={20} color="gray" />
          <Text style={styles.detailText}>Skills: {item.skills}</Text>
        </View>
      </View>

      {/* Conditionally render additional fields */}
      {expandedJobId === item.id && (
        <View style={styles.additionalDetails}>
          <Text style={styles.description}>
            <Text style={styles.descriptionTitle}>Description - </Text>
            {item.description}
          </Text>
        </View>
      )}

      {/* Read More / Collapse Button */}
      <TouchableOpacity onPress={() => toggleExpand(item.id)} style={styles.readMoreButton}>
        <Text style={styles.readMoreText}>
          {expandedJobId === item.id ? "Read Less" : "Read More"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <FlatList
          data={jobListings}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ flexGrow: 1 }}
          ListEmptyComponent={
            <View style={styles.card}>
              <Text style={styles.title}>No Saved Jobs</Text>
              <Text style={styles.subtitle}>You haven't applied to any jobs yet.</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

export default StatusJobs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loaderContainer: {
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
  additionalDetails: {
    marginTop: 8,
  },
  description: {
    fontSize: 14,
    color: "gray",
  },
  descriptionTitle: {
    fontWeight: "bold",
    color: "black",
  },
  readMoreButton: {
    marginVertical: 8,
    alignSelf: "flex-start",
  },
  readMoreText: {
    fontSize: 14,
    color: "#007BFF",
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
  subtitle: {
    fontSize: 14,
    color: "gray",
    textAlign: "center",
  },
});
