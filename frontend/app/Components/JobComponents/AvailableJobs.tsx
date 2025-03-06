import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, Image } from "react-native";
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
  deadline: string;
  job_phone: string;
  job_website: string;
  job_email: string;
  image_url: string | null; // Add image_url field to JobListing type
}

const AvailableJobs: React.FC = () => {
  const [jobListings, setJobListings] = useState<JobListing[]>([]);
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null); // Store authenticated user
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true); // Set loading state to true
      try {
        const { data, error } = await supabase.from("jobs").select("*").eq("is_active", true);
        if (error) {
          console.error("Error fetching jobs:", error.message);
        } else {
          setJobListings(data || []);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      } finally {
        setIsLoading(false); // Set loading state to false once data is fetched
      }
    };

    fetchJobs();

    // Fetch current user
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error.message);
      } else {
        setUser(data?.user); // Store the user
      }
    };

    getUser();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedJobId((prevId) => (prevId === id ? null : id)); // Toggle between expanded and collapsed
  };

  const saveJob = async (jobId: string) => {
    if (user) {
      try {
        // Check if the job is already saved
        const { data, error } = await supabase
          .from("saved_jobs")
          .select("*")
          .eq("user_id", user.id)
          .eq("job_id", jobId);

        if (data && data.length > 0) {
          Alert.alert("Already Saved", "You have already saved this job.");
          return;
        }

        const { insertData, insertError } = await supabase
          .from("saved_jobs")
          .insert([
            {
              user_id: user.id,
              job_id: jobId,
            },
          ]);

        if (insertError) {
          console.error("Error saving job:", insertError.message);
          Alert.alert("Error", insertError.message);
        } else {
          console.log("Job saved!", insertData);
          Alert.alert("Success", "The job has been saved successfully.");
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      }
    } else {
      Alert.alert("Authentication Required", "Please log in to save jobs.");
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

      {/* Conditionally render image if image_url exists */}
      {item.image_url && (
        <Image source={{ uri: item.image_url }} style={styles.image} />
      )}

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
            <Text style={styles.description}>
              <Text style={styles.descriptionTitle}>Description - </Text>
              {item.description}
            </Text>
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
        {/* Save Icon */}
        <TouchableOpacity onPress={() => saveJob(item.id)} style={styles.iconButton}>
          <Ionicons name="bookmark-outline" size={30} color="#000" />
        </TouchableOpacity>
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
});

export default AvailableJobs;
