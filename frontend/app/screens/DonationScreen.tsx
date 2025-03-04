import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { supabase } from "../lib/supabse";

export default function Donationscreen() {
  const [donations, setDonations] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDonation, setNewDonation] = useState({
    title: "",
    description: "",
    target_amount: "",
    account_details: "",
    contact_person: "",
  });

  // Fetch user email on component mount
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email);
      }
    };
    fetchUser();
  }, []);

  // Fetch donations from the database
  useEffect(() => {
    const fetchDonations = async () => {
      const { data, error } = await supabase.from("donations").select("*");
      if (error) {
        console.error("Error fetching donations:", error);
      } else {
        setDonations(data);
      }
    };
    fetchDonations();
  }, []);

  // Handle adding a new donation post
  const handleAddDonation = async () => {
    if (
      !newDonation.title ||
      !newDonation.description ||
      !newDonation.target_amount ||
      !newDonation.account_details ||
      !newDonation.contact_person
    ) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    const { data, error } = await supabase
      .from("donations")
      .insert([newDonation])
      .select();

    if (error) {
      console.error("Error adding donation:", error);
      Alert.alert("Error", "Failed to add donation post.");
    } else {
      setDonations([...donations, data[0]]);
      setNewDonation({
        title: "",
        description: "",
        target_amount: "",
        account_details: "",
        contact_person: "",
      });
      setShowAddForm(false);
      Alert.alert("Success", "Donation post added successfully!");
    }
  };

  return (
    <ScrollView style={{ backgroundColor: "white", padding: 16, flex: 1 }}>
      <TouchableOpacity
        style={{ position: "absolute", left: 0, top: 16, padding: 10 }}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          textAlign: "center",
          color: "#2d3748",
          marginBottom: 24,
        }}
      >
        Donate
      </Text>

      {/* Show "Add Donation Post" button only for the specific user */}
      {userEmail === "aathifahamad4@gmail.com" && (
        <TouchableOpacity
          style={{
            backgroundColor: "#2C3036",
            padding: 12,
            borderRadius: 8,
            marginBottom: 24,
          }}
          onPress={() => setShowAddForm(!showAddForm)}
        >
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontSize: 16,
              fontWeight: "500",
            }}
          >
            {showAddForm ? "Cancel" : "Add Donation Post"}
          </Text>
        </TouchableOpacity>
      )}

      {/* Form to add a new donation post */}
      {showAddForm && (
        <View style={{ marginBottom: 24 }}>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 8,
              padding: 12,
              marginBottom: 16,
            }}
            placeholder="Title"
            value={newDonation.title}
            onChangeText={(text) =>
              setNewDonation({ ...newDonation, title: text })
            }
          />
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 8,
              padding: 12,
              marginBottom: 16,
            }}
            placeholder="Description"
            value={newDonation.description}
            onChangeText={(text) =>
              setNewDonation({ ...newDonation, description: text })
            }
            multiline
          />
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 8,
              padding: 12,
              marginBottom: 16,
            }}
            placeholder="Target Amount"
            value={newDonation.target_amount}
            onChangeText={(text) =>
              setNewDonation({ ...newDonation, target_amount: text })
            }
            keyboardType="numeric"
          />
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 8,
              padding: 12,
              marginBottom: 16,
            }}
            placeholder="Account Details"
            value={newDonation.account_details}
            onChangeText={(text) =>
              setNewDonation({ ...newDonation, account_details: text })
            }
          />
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 8,
              padding: 12,
              marginBottom: 16,
            }}
            placeholder="Contact Person"
            value={newDonation.contact_person}
            onChangeText={(text) =>
              setNewDonation({ ...newDonation, contact_person: text })
            }
          />
          <TouchableOpacity
            style={{
              backgroundColor: "#2C3036",
              padding: 12,
              borderRadius: 8,
            }}
            onPress={handleAddDonation}
          >
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontSize: 16,
                fontWeight: "500",
              }}
            >
              Submit Donation Post
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Display donation posts */}
      {donations.map((donation) => (
        <View
          key={donation.id}
          style={{
            backgroundColor: "#f7fafc",
            borderRadius: 8,
            padding: 24,
            marginBottom: 24,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: "#2d3748",
              marginBottom: 8,
            }}
          >
            {donation.title}
          </Text>
          <Text style={{ color: "#4a5568", marginBottom: 16, lineHeight: 24 }}>
            {donation.description}
          </Text>
          <Text style={{ color: "#4a5568", marginBottom: 16, lineHeight: 24 }}>
            Target Amount: LKR {donation.target_amount}
          </Text>

          {/* Donate Button */}
          <TouchableOpacity
            style={{
              backgroundColor: "#2C3036",
              padding: 12,
              borderRadius: 8,
              marginBottom: 16,
            }}
            onPress={() => {
              console.log("Navigating with donationId:", donation.id); // Debugging
              router.push({
                pathname: "./DonationDetailsScreen", // Use absolute path
                params: { donationId: donation.id }, // Pass donationId
              });
            }}
          >
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontSize: 16,
                fontWeight: "500",
              }}
            >
              Donate Now
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}
