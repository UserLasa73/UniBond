import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, Image } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { supabase } from "@/app/lib/supabse"; // Assuming this path for your supabase client

interface JobListing {
  id: string;
  user_id: string; // Add user_id
  title: string;
  company: string;
  location: string;
  type: string;
  level: string;
  skills: string;
  description: string;
  is_active: boolean;
  deadline: string;
  job_phone: string;
  job_website: string;
  job_email: string;
  image_url: string | null;
  created_at: string;
  avatar_url?: string | null; //user avatar
  full_name?: string;
}

const AvailableJobs: React.FC = () => {
  const [jobListings, setJobListings] = useState<JobListing[]>([]);
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]); // Store saved job IDs
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const { data: jobs, error: jobsError } = await supabase.from("jobs").select("*").eq("is_active", true);
        if (jobsError) {
          console.error("Error fetching jobs:", jobsError.message);
          return;
        }

        // Fetch user_id who posted job posters
        const userIds = jobs.map((job) => job.user_id);

        const { data: profiles, error: profilesError } = await supabase
          .from("profiles")
          .select("id, full_name, avatar_url")
          .in("id", userIds);

        if (profilesError) {
          console.error("Error fetching profiles:", profilesError.message);
          return;
        }

        // Map profile data to jobs

        const SUPABASE_STORAGE_URL = "https://jnqvgrycauzjnvepqorq.supabase.co/storage/v1/object/public/" ;  //supabase url for Avatars bucket
        

        const jobsWithProfiles = jobs.map((job) => {
          const profile = profiles.find((p) => p.id === job.user_id);
          return {
            ...job,
            avatar_url: profile?.avatar_url? `${SUPABASE_STORAGE_URL}${'avatars/'}${profile.avatar_url}` : null,
            full_name: profile?.full_name || "Unknown",
            image_url: job.image_url ? `${SUPABASE_STORAGE_URL}${'job_Images/'}${job.image_url}` : null,   //create job image url and add to jobListing
          };
        });

        setJobListings(jobsWithProfiles);


      } catch (error) {
        console.error("Unexpected error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();

    // Fetch user and their saved jobs
    const getUserAndSavedJobs = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error("Error fetching user:", userError.message);
        return;
      }
      setUser(userData?.user);

      if (userData?.user) {
        const { data: savedJobs, error: savedJobsError } = await supabase
          .from("saved_jobs")
          .select("job_id")
          .eq("user_id", userData.user.id);

        if (savedJobsError) {
          console.error("Error fetching saved jobs:", savedJobsError.message);
        } else {
          setSavedJobIds(savedJobs.map((job) => job.job_id)); // Store saved job IDs
        }
      }
    };

    getUserAndSavedJobs();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedJobId((prevId) => (prevId === id ? null : id));
  };


  const saveJob = async (jobId: string) => {
    if (!user) {
      Alert.alert("Authentication Required", "Please log in to save jobs.");
      return;
    }

    try {
      if (savedJobIds.includes(jobId)) {
        // Remove job from saved_jobs
        const { error } = await supabase.from("saved_jobs").delete().eq("user_id", user.id).eq("job_id", jobId);

        if (error) {
          console.error("Error unsaving job:", error.message);
          Alert.alert("Error", "Failed to remove job.");
        } else {
          setSavedJobIds((prev) => prev.filter((id) => id !== jobId)); // Update state
          Alert.alert("Unsaved", "The job has been Unsaved successfully.");
        }
      } else {
        // Save job to saved_jobs
        const { error } = await supabase.from("saved_jobs").insert([{ user_id: user.id, job_id: jobId }]);

        if (error) {
          console.error("Error saving job:", error.message);
          Alert.alert("Error", "Failed to save job.");
        } else {
          setSavedJobIds((prev) => [...prev, jobId]); // Update state
          Alert.alert("Saved", "The job has been saved successfully.");
        }
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };


  const renderItem = ({ item }: { item: JobListing }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>

      <View style={styles.userInfo}>
        <View style={styles.textGroup}>
          <Text style={styles.name}>{item.company}</Text>
        </View>
      </View>

      {item.image_url && <Image source={{ uri: item.image_url }} style={styles.image} />}

      <View style={styles.details}>
        {item.location && (
          <View style={styles.row}>
            <MaterialIcons name="location-on" size={20} color="gray" />
            <Text style={styles.detailText}>Location: {item.location}</Text>
          </View>
        )}

        {(item.type || item.level) && (
          <View style={styles.row}>
            <Ionicons name="briefcase-outline" size={20} color="gray" />
            <Text style={styles.detailText}>
              Type: {item.type} Level: {item.level}
            </Text>
          </View>
        )}

        {item.skills && (
          <View style={styles.row}>
            <MaterialIcons name="article" size={20} color="gray" />
            <Text style={styles.detailText}>Skills: {item.skills}</Text>
          </View>
        )}

        {item.deadline && (
          <View style={styles.row}>
            <MaterialIcons name="event" size={20} color="gray" />
            <Text style={styles.detailText}>Deadline: {item.deadline}</Text>
          </View>
        )}

        {(item.job_phone || item.job_email || item.job_website) && (
          <View style={styles.row}>
            <MaterialIcons name="person" size={20} color="gray" />
            <Text style={styles.detailText}>
              Contact: {item.job_phone} | {item.job_email} | {item.job_website}
            </Text>
          </View>
        )}
      </View>

      {item.description && (
        <View style={styles.additionalDetails}>
          {expandedJobId === item.id ? (
            <Text style={styles.description}>{item.description}</Text>
          ) : (
            <TouchableOpacity onPress={() => toggleExpand(item.id)} style={styles.readMoreButton}>
              <Text style={styles.readMoreText}>Read More</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {expandedJobId === item.id && item.description && (
        <TouchableOpacity onPress={() => toggleExpand(item.id)} style={styles.readMoreButton}>
          <Text style={styles.readMoreText}>Read Less</Text>
        </TouchableOpacity>
      )}

      <View style={styles.buttonGroup}>
        <TouchableOpacity onPress={() => saveJob(item.id)} style={styles.iconButton}>
          <Ionicons name={savedJobIds.includes(item.id) ? "bookmark" : "bookmark-outline"} size={30} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Profile Image */}
      {item.avatar_url ? (
        <Image source={{ uri: item.avatar_url }} style={styles.avatar} />
      ) : (
        <Ionicons name="person-circle" size={40} color="gray" />
      )}

      {/* User Name and Job Posted Date */}
      <View style={styles.textGroup}>
        <Text style={styles.name}>{item.full_name}</Text>
        <Text style={styles.date}>{new Date(item.created_at).toDateString()}</Text>
      </View>

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
              <Text style={styles.title}>No Jobs Available</Text>
              <Text style={styles.subtitle}>Please check back later.</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

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
  image: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 8,
    marginBottom: 16,
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
    justifyContent: "flex-end",
  },
  iconButton: {
    padding: 6,
    borderRadius: 50,
    backgroundColor: "#F0F0F0", // Add background for the icon button
    justifyContent: "center",
    alignItems: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  date: {
    fontSize: 12,
    color: "gray",
  },
});

export default AvailableJobs;
