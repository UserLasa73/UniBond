import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, Image } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { supabase } from "@/app/lib/supabse";

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
  image_url: string;  // Add image_url to the JobListing interface
}

const SavedJobs: React.FC = () => {
  const [savedJobs, setSavedJobs] = useState<JobListing[]>([]);
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null); // Store authenticated user
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state

  useEffect(() => {
    const fetchUserAndSavedJobs = async () => {
      setIsLoading(true); // Set loading state to true
      try {
        // Fetch authenticated user
        const { data, error: userError } = await supabase.auth.getUser();
        if (userError) {
          console.error("Error fetching user:", userError.message);
        } else {
          setUser(data?.user);
        }

        // Fetch saved jobs for the authenticated user
        if (data?.user) {
          const { data: savedJobData, error: savedJobError } = await supabase
            .from("saved_jobs")
            .select("job_id")
            .eq("user_id", data?.user.id);

          if (savedJobError) {
            console.error("Error fetching saved jobs:", savedJobError.message);
          } else {
            const jobIds = savedJobData?.map((savedJob) => savedJob.job_id);

            // Fetch job details for the saved job ids, including the image_url
            const { data: jobs, error: jobsError } = await supabase
              .from("jobs")
              .select("*")
              .in("id", jobIds);

            if (jobsError) {
              console.error("Error fetching job details:", jobsError.message);
            } else {
              setSavedJobs(jobs || []);
            }
          }
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      } finally {
        setIsLoading(false); // Set loading state to false once data is fetched
      }
    };

    fetchUserAndSavedJobs();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedJobId((prevId) => (prevId === id ? null : id)); // Toggle between expanded and collapsed
  };

  const unsaveJob = async (jobId: string) => {
    if (!user) {
      console.error("User not logged in");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("saved_jobs")
        .delete()
        .match({ job_id: jobId, user_id: user.id });

      if (error) {
        console.error("Error unsaving job:", error.message);
      } else {
        setSavedJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
        console.log("Deleting saved job with:", { jobId, userId: user.id });
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  const applyJob = async (jobId: string) => {
    if (user) {
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError.message);
        } else {
          const applicantName = profile.full_name;

          // Insert application details into applications table
          const { data, error } = await supabase.from('applications').insert([{
            job_id: jobId,
            user_id: user.id,
            applicant_name: applicantName, // Store applicant's name
            status: 'applied', // Set initial status to 'applied'
          }]);

          if (error) {
            console.error("Error applying for job:", error.message);
            Alert.alert("Already Applied");
          } else {
            console.log("Application submitted successfully:", data);
            Alert.alert(
              "Application Submitted",
              "You have successfully applied for the job.",
              [{ text: "OK" }],
              { cancelable: true }
            );
          }
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      }
    } else {
      console.error("User not authenticated");
    }
  };

  const renderItem = ({ item }: { item: JobListing }) => (
    <View style={styles.card}>
      {/* Render Image if available */}
      {item.image_url ? (
        <Image source={{ uri: item.image_url }} style={styles.jobImage} />
      ) : null}

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

      <TouchableOpacity onPress={() => unsaveJob(item.id)} style={styles.unsaveButton}>
        <Text style={styles.unsaveButtonText}>Unsave</Text>
      </TouchableOpacity>

      {/* Apply Button */}
      <TouchableOpacity onPress={() => applyJob(item.id)} style={styles.applyButton}>
        <Text style={styles.applyButtonText}>Apply</Text>
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
          data={savedJobs}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ flexGrow: 1 }}
          ListEmptyComponent={
            <View style={styles.card}>
              <Text style={styles.title}>No Saved Jobs</Text>
              <Text style={styles.subtitle}>You haven't saved any jobs yet.</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

export default SavedJobs;

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
  unsaveButton: {
    backgroundColor: "#000000",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  unsaveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  applyButton: {
    backgroundColor: "#000000",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  applyButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 14,
    color: "gray",
  },
  jobImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
});
