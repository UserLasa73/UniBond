import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { supabase } from "../lib/supabse";

export default function EditDonationScreen() {
  const { id } = useLocalSearchParams();

  const router = useRouter();
  const [donation, setDonation] = useState({
    title: "",
    description: "",
    target_amount: "",
    amount_raised: "",
    account_details: "",
    contact_person: "",
  });

  // Fetch donation details
  useEffect(() => {
    if (id) {
      const fetchDonation = async () => {
        const { data, error } = await supabase
          .from("donations")
          .select("*")
          .eq("id", id)
          .single();
        if (error) {
          console.error("Error fetching donation:", error);
        } else {
          // Convert numbers to strings
          setDonation({
            ...data,
            target_amount: data.target_amount.toString(),
            amount_raised: data.amount_raised.toString(),
          });
        }
      };
      fetchDonation();
    }
  }, [id]);

  // Handle update donation
  const handleUpdate = async () => {
    if (!id) {
      Alert.alert("Error", "Invalid donation ID.");
      return;
    }

    const { error } = await supabase
      .from("donations")
      .update(donation)
      .eq("id", id);

    if (error) {
      Alert.alert("Error", "Failed to update donation.");
    } else {
      Alert.alert("Success", "Donation updated successfully!");
      router.back();
    }
  };

  return (
    <View style={{ padding: 16, flex: 1, backgroundColor: "white" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
        Edit Donation
      </Text>

      {/* Title Input */}
      <TextInput
        placeholder="Title"
        value={donation.title}
        onChangeText={(text) => setDonation({ ...donation, title: text })}
        style={{
          borderWidth: 1,
          padding: 8,
          marginBottom: 12,
          borderRadius: 5,
        }}
      />

      {/* Description Input */}
      <TextInput
        placeholder="Description"
        value={donation.description}
        onChangeText={(text) => setDonation({ ...donation, description: text })}
        style={{
          borderWidth: 1,
          padding: 8,
          marginBottom: 12,
          borderRadius: 5,
        }}
        multiline
      />

      {/* Target Amount Input */}
      <TextInput
        placeholder="Target Amount"
        value={donation.target_amount}
        onChangeText={(text) =>
          setDonation({ ...donation, target_amount: text })
        }
        style={{
          borderWidth: 1,
          padding: 8,
          marginBottom: 12,
          borderRadius: 5,
        }}
        keyboardType="numeric"
      />

      {/* Amount Raised Input */}
      <TextInput
        placeholder="Amount Raised"
        value={donation.amount_raised}
        onChangeText={(text) =>
          setDonation({ ...donation, amount_raised: text })
        }
        style={{
          borderWidth: 1,
          padding: 8,
          marginBottom: 12,
          borderRadius: 5,
        }}
        keyboardType="numeric"
      />

      {/* Account Details Input */}
      <TextInput
        placeholder="Account Details"
        value={donation.account_details}
        onChangeText={(text) =>
          setDonation({ ...donation, account_details: text })
        }
        style={{
          borderWidth: 1,
          padding: 8,
          marginBottom: 12,
          borderRadius: 5,
        }}
      />

      {/* Contact Person Input */}
      <TextInput
        placeholder="Contact Person"
        value={donation.contact_person}
        onChangeText={(text) =>
          setDonation({ ...donation, contact_person: text })
        }
        style={{
          borderWidth: 1,
          padding: 8,
          marginBottom: 12,
          borderRadius: 5,
        }}
      />

      {/* Update Button */}
      <TouchableOpacity
        onPress={handleUpdate}
        style={{ padding: 10, backgroundColor: "#2C3036", borderRadius: 5 }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>Update</Text>
      </TouchableOpacity>
    </View>
  );
}
