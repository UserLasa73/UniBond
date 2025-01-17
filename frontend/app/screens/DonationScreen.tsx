import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";

export default function Donationscreen() {
  const donations = [
    {
      id: 1,
      title: "At the University of Vavuniya...",
      description:
        "At the University of Vavuniya, we believe that our alumni play a vital role in supporting the next generation of students. Your contributions enable us to provide world-class facilities, scholarship opportunities, and a vibrant learning environment. Every donation, no matter the size, makes a tangible difference in the lives of students and strengthens our university community.",
    },
    {
      id: 2,
      title: "Support our Library Expansion Project...",
      description:
        "Support our Library Expansion Project to provide students with more resources, study spaces, and access to digital learning tools. A donation of LKR 10,000 can help furnish new reading areas or update technology for our students.",
    },
    {
      id: 3,
      title: "Fund groundbreaking projects...",
      description:
        "Fund groundbreaking projects like the Vavuniya AgroTech Initiative, a student-led research project aimed at developing sustainable agriculture practices in Northern Province. Your contributions can provide essential lab equipment and resources.",
    },
  ];

  const handleDonate = (id) => {
    alert(`Thank you for donating to project ${id}!`);
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
      {donations.map((donation) => (
        <View
          key={donation.id}
          style={{
            backgroundColor: "#f7fafc",
            borderRadius: 8,
            padding: 24,
            marginBottom: 24,
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
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
          <TouchableOpacity
            style={{
              backgroundColor: "#2C3036",
              padding: 12,
              borderRadius: 8,
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
            onPress={() => handleDonate(donation.id)}
          >
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontSize: 16,
                fontWeight: "500",
              }}
            >
              Donate now
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}
