import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { supabase } from "@/app/lib/supabse"; // Adjust the path as needed

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
  status?: string; // Status from the applications table
}

const StatusJobs: React.FC = () => {
  const [jobListings, setJobListings] = useState<JobListing[]>([]);
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null); // Store authenticated user
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setIsLoading(true); // Start loading state
    try {
      // Fetch the authenticated user
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const loggedInUser = userData?.user;
      setUser(loggedInUser);

      if (!loggedInUser) {
        console.error("User not authenticated");
        setIsLoading(false);
        return;
      }

      // Fetch job applications for the logged-in user
      const { data: applications, error: applicationsError } = await supabase
        .from("applications")
        .select("job_id, status,created_at")
        .eq("user_id", loggedInUser.id);

      if (applicationsError) throw applicationsError;

      const appliedJobIds = applications.map((app) => app.job_id);

      // Fetch job details for the applied jobs
      const { data: jobs, error: jobsError } = await supabase
        .from("jobs")
        .select("*")
        .in("id", appliedJobIds);

      if (jobsError) throw jobsError;

      // Merge job details with their respective status
      const jobsWithStatus = jobs.map((job) => {
        const application = applications.find((app) => app.job_id === job.id);
        return {
          ...job,
          status: application?.status || "N/A", // Default to "N/A" if status is missing
          appliedTime: application?.created_at || "Unknown", // Default to "Unknown" if created_at is missing
        };
      });

      setJobListings(jobsWithStatus);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false); // Stop loading state
    }
  };

  const handleCancelApplication = async (jobId: string) => {
    try {
      // Confirm before canceling
      Alert.alert(
        "Cancel Application",
        "Are you sure you want to cancel your application for this job?",
        [
          { text: "No", style: "cancel" },
          {
            text: "Yes",
            onPress: async () => {
              // Remove the application from the applications table
              const { error } = await supabase
                .from("applications")
                .delete()
                .eq("job_id", jobId)
                .eq("user_id", user.id);

              if (error) throw error;

              // Update the job listings to remove the canceled job
              setJobListings((prev) => prev.filter((job) => job.id !== jobId));

              Alert.alert("Success", "Your application has been canceled.");
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error canceling application:", error);
      Alert.alert("Error", "Failed to cancel application. Please try again.");
    }
  };

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
          <Ionicons name="calendar-outline" size={20} color="gray" />
          <Text style={styles.detailText}>
            Applied Date: {new Date(item.appliedTime).toLocaleString()}
          </Text>
        </View>
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
        
        <View style={styles.row}>
          <MaterialIcons name="info-outline" size={20} color="gray" />
          <Text style={styles.detailText}>
            Status:{" "}
            <Text
              style={{
                color:
                  item.status?.toLowerCase() === "pending"
                    ? "blue"
                    : item.status?.toLowerCase() === "accepted"
                      ? "green"
                      : item.status?.toLowerCase() === "rejected"
                        ? "red"
                        : "gray", // Default color for "applied" or other statuses
              }}
            >
              {item.status}
            </Text>
          </Text>
        </View>



      </View>

      {expandedJobId === item.id && (
        <View style={styles.additionalDetails}>
          <Text style={styles.description}>
            <Text style={styles.descriptionTitle}>Description - </Text>
            {item.description}
          </Text>
        </View>
      )}

      <TouchableOpacity onPress={() => toggleExpand(item.id)} style={styles.readMoreButton}>
        <Text style={styles.readMoreText}>
          {expandedJobId === item.id ? "Read Less" : "Read More"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => handleCancelApplication(item.id)}
        style={styles.cancelButton}
      >
        <Text style={styles.cancelButtonText}>Cancel Application</Text>
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
              <Text style={styles.title}>No Applied Jobs!</Text>
              <Text style={styles.subtitle}>You haven't Applied to any jobs yet.</Text>
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
  cancelButton: {
    backgroundColor: "#FF6347",
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 14,
    color: "gray",
  },
});
