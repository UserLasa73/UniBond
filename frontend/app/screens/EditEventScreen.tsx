import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  BackHandler,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../lib/supabse";
import { useAuth } from "../providers/AuthProvider";
import { useLocalSearchParams, useRouter } from "expo-router";

const EditEventScreen = () => {
  const { user } = useAuth();
  const router = useRouter();
  const {
    eventId,
    eventName: initialEventName,
    eventDescription: initialEventDescription,
    eventDate: initialEventDate,
    eventLocation: initialEventLocation,
  } = useLocalSearchParams();

  const [eventName, setEventName] = useState(initialEventName || "");
  const [eventDate, setEventDate] = useState<Date | null>(
    initialEventDate ? new Date(initialEventDate) : null
  );
  const [eventLocation, setEventLocation] = useState(
    initialEventLocation || ""
  );
  const [eventDescription, setEventDescription] = useState(
    initialEventDescription || ""
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const backAction = () => {
      if (hasChanges) {
        Alert.alert("", "Discard the changes?", [
          { text: "Cancel", onPress: () => null, style: "cancel" },
          { text: "YES", onPress: () => router.back() },
        ]);
        return true;
      } else {
        router.back();
        return true;
      }
    };

    BackHandler.addEventListener("hardwareBackPress", backAction);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", backAction);
    };
  }, [hasChanges, router]);

  const handleUpdate = async () => {
    if (!eventName || !eventDate || !eventLocation) {
      Alert.alert("Error", "Please fill in all required fields!");
      return;
    }

    if (!user) {
      Alert.alert("Error", "User is not authenticated.");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("events")
        .update({
          event_name: eventName,
          event_date: eventDate.toISOString().split("T")[0],
          event_location: eventLocation,
          event_description: eventDescription,
        })
        .eq("id", eventId);

      if (error) {
        console.log("Error:", error);
        Alert.alert("Error", "Error updating event: " + error.message);
      } else {
        console.log("Event updated successfully:", data);
        Alert.alert("Success", "Event successfully updated!");
        router.back();
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      Alert.alert("Error", "An unexpected error occurred.");
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setEventDate(selectedDate);
      setHasChanges(true);
    }
  };

  const handleCancel = () => {
    setEventName("");
    setEventDate(null);
    setEventLocation("");
    setEventDescription("");
    setHasChanges(false);
    router.back();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Edit Event</Text>
      <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
        <Ionicons name="close" size={24} color="#000" />
      </TouchableOpacity>

      {/* Event Name Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Event Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter event name"
          value={eventName}
          onChangeText={(text) => {
            setEventName(text);
            setHasChanges(true);
          }}
        />
      </View>

      {/* Event Date Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Event Date</Text>
        <TouchableOpacity
          style={styles.dateInput}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateText}>
            {eventDate
              ? eventDate.toISOString().split("T")[0]
              : "Select a date"}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={eventDate || new Date()}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}
      </View>

      {/* Event Location Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Event Location</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter event location"
          value={eventLocation}
          onChangeText={(text) => {
            setEventLocation(text);
            setHasChanges(true);
          }}
        />
      </View>

      {/* Event Description Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Event Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter event description"
          value={eventDescription}
          onChangeText={(text) => {
            setEventDescription(text);
            setHasChanges(true);
          }}
          multiline
          numberOfLines={4}
        />
      </View>

      <TouchableOpacity style={styles.postButton} onPress={handleUpdate}>
        <Text style={styles.postButtonText}>Update</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditEventScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 20,
  },
  cancelButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#333",
  },
  dateInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
  },
  dateText: {
    fontSize: 16,
    color: "#999",
  },
  textArea: {
    textAlignVertical: "top",
    height: 100,
  },
  postButton: {
    backgroundColor: "#2C3036",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  postButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
