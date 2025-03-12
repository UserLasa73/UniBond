import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { supabase } from "../lib/supabse";
import AddDonationForm from "./AddDonationForm"; // Import the new component

export default function Donationscreen() {
  const [donations, setDonations] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [menuVisible, setMenuVisible] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch user email
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

  // Fetch donations
  useEffect(() => {
    const fetchDonations = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("donations").select("*");
      if (error) {
        console.error("Error fetching donations:", error);
        Alert.alert("Error", "Failed to fetch donations.");
      } else {
        setDonations(data);
      }
      setLoading(false);
    };
    fetchDonations();
  }, []);

  // Handle delete donation
  const handleDeleteDonation = async (id) => {
    Alert.alert("Confirm", "Are you sure you want to delete this donation?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: async () => {
          const { error } = await supabase
            .from("donations")
            .delete()
            .eq("id", id);
          if (error) {
            Alert.alert("Error", "Failed to delete donation.");
          } else {
            setDonations(donations.filter((donation) => donation.id !== id));
            Alert.alert("Success", "Donation deleted successfully!");
          }
        },
      },
    ]);
  };

  // Handle add donation
  const handleAddDonation = (donation) => {
    setDonations([...donations, donation]);
    setShowAddForm(false);
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

      {/* Add Donation Button (Admin Only) */}
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

      {/* Add Donation Form (Admin Only) */}
      {showAddForm && (
        <AddDonationForm
          onAddDonation={handleAddDonation}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* Donation List */}
      {loading ? (
        <ActivityIndicator size="large" color="#2C3036" />
      ) : (
        donations.map((donation) => (
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
            {/* Donation Title */}
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

            {/* Donation Description */}
            <Text
              style={{ color: "#4a5568", marginBottom: 16, lineHeight: 24 }}
            >
              {donation.description}
            </Text>

            {/* Target Amount */}
            <Text
              style={{ color: "#4a5568", marginBottom: 16, lineHeight: 24 }}
            >
              Target Amount: LKR {donation.target_amount}
            </Text>

            {/* Amount Raised */}
            <Text
              style={{ color: "#4a5568", marginBottom: 16, lineHeight: 24 }}
            >
              Amount Raised: LKR {donation.amount_raised}
            </Text>

            {/* Three-dot menu (Admin Only) */}
            {userEmail === "aathifahamad4@gmail.com" && (
              <TouchableOpacity
                style={{ position: "absolute", right: 16, top: 16 }}
                onPress={() =>
                  setMenuVisible(
                    menuVisible === donation.id ? null : donation.id
                  )
                }
              >
                <Ionicons name="ellipsis-vertical" size={24} color="black" />
              </TouchableOpacity>
            )}

            {/* Dropdown Menu */}
            {menuVisible === donation.id && (
              <View
                style={{
                  backgroundColor: "white",
                  borderRadius: 8,
                  position: "absolute",
                  right: 16,
                  top: 40,
                  width: 120,
                  padding: 8,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    router.push(`./EditDonationScreen?id=${donation.id}`);
                    setMenuVisible(null);
                  }}
                  style={{ padding: 10 }}
                >
                  <Text style={{ color: "#333", fontSize: 16 }}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    handleDeleteDonation(donation.id);
                    setMenuVisible(null);
                  }}
                  style={{ padding: 10 }}
                >
                  <Text style={{ color: "red", fontSize: 16 }}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Donate Now Button */}
            <TouchableOpacity
              style={{
                backgroundColor: "#2C3036",
                padding: 12,
                borderRadius: 8,
                marginTop: 16,
              }}
              onPress={() => {
                router.push(
                  `./DonationDetailsScreen?donationId=${donation.id}`
                );
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
        ))
      )}
    </ScrollView>
  );
}
