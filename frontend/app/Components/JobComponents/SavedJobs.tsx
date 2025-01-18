import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { supabase } from "../../lib/supabse";

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

const SavedJobs: React.FC = () => {
  const [savedJobs, setSavedJobs] = useState<JobListing[]>([]);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const userId = supabase.auth.user()?.id;
        if (userId) {
          const { data, error } = await supabase
            .from("saved_jobs")
            .select("job_id")
            .eq("user_id", userId);

          if (error) {
            console.error("Error fetching saved jobs:", error.message);
          } else {
            const jobIds = data?.map((savedJob) => savedJob.job_id);
            if (jobIds?.length) {
              const { data: jobs, error: jobError } = await supabase
                .from("jobs")
                .select("*")
                .in("id", jobIds);

              if (jobError) {
                console.error("Error fetching jobs:", jobError.message);
              } else {
                setSavedJobs(jobs || []);
              }
            }
          }
        } else {
          console.log("No user authenticated");
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      }
    };

    fetchSavedJobs();
  }, []);

  const renderItem = ({ item }: { item: JobListing }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <View style={styles.userInfo}>
        <Image
          source={{ uri: "https://via.placeholder.com/40" }}
          style={styles.avatar}
        />
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
    </View>
  );

  return (
    <FlatList
      data={savedJobs}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={{ flexGrow: 1 }}
      ListEmptyComponent={
        <View style={styles.card}>
          <Text style={styles.title}>No Saved Jobs</Text>
          <Text style={styles.subtitle}>Save jobs to see them here.</Text>
        </View>
      }
    />
  );
};

export default SavedJobs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
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
    marginTop: 10,
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
});
