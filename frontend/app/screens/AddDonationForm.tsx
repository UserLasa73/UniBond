import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, Alert } from "react-native";
import { supabase } from "../lib/supabse";

const AddDonationForm = ({ onAddDonation, onCancel }) => {
  const [newDonation, setNewDonation] = useState({
    title: "",
    description: "",
    target_amount: "",
    amount_raised: "",
    account_details: "",
    contact_person: "",
  });

  const handleAddDonation = async () => {
    const { error } = await supabase.from("donations").insert([newDonation]);
    if (error) {
      Alert.alert("Error", "Failed to add donation.");
    } else {
      onAddDonation(newDonation); // Notify parent component
      setNewDonation({
        title: "",
        description: "",
        target_amount: "",
        amount_raised: "",
        account_details: "",
        contact_person: "",
      });
      Alert.alert("Success", "Donation added successfully!");
    }
  };

  return (
    <View
      style={{
        backgroundColor: "#f7fafc",
        borderRadius: 8,
        padding: 16,
        marginBottom: 24,
      }}
    >
      <TextInput
        placeholder="Title"
        value={newDonation.title}
        onChangeText={(text) => setNewDonation({ ...newDonation, title: text })}
        style={{ borderWidth: 1, padding: 8, marginBottom: 12 }}
      />
      <TextInput
        placeholder="Description"
        value={newDonation.description}
        onChangeText={(text) =>
          setNewDonation({ ...newDonation, description: text })
        }
        style={{ borderWidth: 1, padding: 8, marginBottom: 12 }}
      />
      <TextInput
        placeholder="Target Amount"
        value={newDonation.target_amount}
        onChangeText={(text) =>
          setNewDonation({ ...newDonation, target_amount: text })
        }
        style={{ borderWidth: 1, padding: 8, marginBottom: 12 }}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Amount Raised"
        value={newDonation.amount_raised}
        onChangeText={(text) =>
          setNewDonation({ ...newDonation, amount_raised: text })
        }
        style={{ borderWidth: 1, padding: 8, marginBottom: 12 }}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Account Details"
        value={newDonation.account_details}
        onChangeText={(text) =>
          setNewDonation({ ...newDonation, account_details: text })
        }
        style={{ borderWidth: 1, padding: 8, marginBottom: 12 }}
      />
      <TextInput
        placeholder="Contact Person"
        value={newDonation.contact_person}
        onChangeText={(text) =>
          setNewDonation({ ...newDonation, contact_person: text })
        }
        style={{ borderWidth: 1, padding: 8, marginBottom: 12 }}
      />
      <TouchableOpacity
        onPress={handleAddDonation}
        style={{
          backgroundColor: "#2C3036",
          padding: 12,
          borderRadius: 8,
          marginBottom: 12,
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
          Add Donation
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddDonationForm;
