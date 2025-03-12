import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Event } from "./HomeScreen"; // Import the Event type from HomeScreen
type EventItemProps = {
  event: Event;
  onInterestToggle: (eventId: number) => void;
};

const EventItem: React.FC<EventItemProps> = ({ event, onInterestToggle }) => {
  const router = useRouter();
  const storageUrl =
    "https://jnqvgrycauzjnvepqorq.supabase.co/storage/v1/object/public/avatars/";
  const imageUrl = event.avatar_url ? `${storageUrl}${event.avatar_url}` : null;

  const calculatePostDuration = (postedDate: string) => {
    const postDate = new Date(postedDate);
    const currentDate = new Date();
    const timeDifference = currentDate.getTime() - postDate.getTime();

    const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));
    const hoursDifference = Math.floor(timeDifference / (1000 * 3600));
    const minutesDifference = Math.floor(timeDifference / (1000 * 60));

    if (daysDifference > 0) {
      return `${daysDifference} day${daysDifference > 1 ? "s" : ""} ago`;
    } else if (hoursDifference > 0) {
      return `${hoursDifference} hour${hoursDifference > 1 ? "s" : ""} ago`;
    } else if (minutesDifference > 0) {
      return `${minutesDifference} minute${minutesDifference > 1 ? "s" : ""} ago`;
    } else {
      return "Just now";
    }
  };

  return (
    <View style={styles.eventItem}>
      {/* User Profile Section */}
      <TouchableOpacity
        onPress={() =>
          router.push(`/screens/ProfileScreen?userId=${event.uid}`)
        }
      >
        <View style={styles.userInfoContainer}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.avatar} />
          ) : (
            <MaterialIcons name="person" size={40} color="#000" />
          )}
          <View style={styles.userInfoText}>
            <Text style={styles.username}>
              {event.username} ({event.role ? "Alumni" : "Student"})
            </Text>
            <Text style={styles.postedDate}>
              {calculatePostDuration(event.posted_date)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Event Details */}
      <Text style={styles.eventTitle}>{event.event_name}</Text>
      <Text style={styles.eventDetails}>Date: {event.event_date}</Text>
      <Text style={styles.eventDetails}>Location: {event.event_location}</Text>
      <Text style={styles.eventDetails}>
        Description: {event.event_description}
      </Text>
      <Text style={styles.eventDetails}>
        Interested People: ({event.interested_count})
      </Text>

      <View style={styles.divider} />

      {/* Interested Button */}
      <TouchableOpacity
        style={styles.interestedButton}
        onPress={() => onInterestToggle(event.id)}
      >
        <MaterialIcons
          name={event.isInterestedByCurrentUser ? "remove" : "add"}
          size={20}
          color="#000"
        />
        <Text style={styles.interestedButtonText}>
          {event.isInterestedByCurrentUser ? "Not Interested" : "Interested"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  eventItem: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userInfoText: {
    flexDirection: "column",
    marginLeft: 10,
    justifyContent: "center",
  },
  username: {
    fontSize: 14,
    fontWeight: "bold",
  },
  postedDate: {
    fontSize: 12,
    color: "#666",
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  eventDetails: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "#2C3036",
    marginVertical: 5,
  },
  interestedButton: {
    marginTop: 5,
    padding: 10,
    backgroundColor: "transparent",
    borderRadius: 5,
    alignItems: "center",
  },
  interestedButtonText: {
    color: "#000",
    fontWeight: "bold",
  },
});

export default EventItem;
