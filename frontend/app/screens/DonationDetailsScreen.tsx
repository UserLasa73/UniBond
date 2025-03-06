import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { supabase } from "../lib/supabse";

export default function DonationDetailsScreen() {
  const { donationId } = useLocalSearchParams();

  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch donation details from Supabase
  useEffect(() => {
    const fetchDonationDetails = async () => {
      if (!donationId) {
        setError("No donation ID provided.");
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("donations")
          .select("*")
          .eq("id", donationId)
          .single();

        if (error) {
          console.error("Error fetching donation details:", error);
          setError("Failed to fetch donation details.");
        } else if (!data) {
          setError("No donation found with the provided ID.");
        } else {
          setDonation(data);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchDonationDetails();
  }, [donationId]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2C3036" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "red", fontSize: 16 }}>{error}</Text>
      </View>
    );
  }

  if (!donation) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No donation details found.</Text>
      </View>
    );
  }

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
        Donation Details
      </Text>

      <View
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
          Account Details
        </Text>
        <Text style={{ color: "#4a5568", marginBottom: 16, lineHeight: 24 }}>
          {donation.account_details}
        </Text>

        <Text
          style={{
            fontSize: 18,
            fontWeight: "600",
            color: "#2d3748",
            marginBottom: 8,
          }}
        >
          Contact Person
        </Text>
        <Text style={{ color: "#4a5568", marginBottom: 16, lineHeight: 24 }}>
          {donation.contact_person}
        </Text>
      </View>
    </ScrollView>
  );
}
