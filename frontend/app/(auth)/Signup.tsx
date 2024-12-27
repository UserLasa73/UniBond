import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  View,
  AppState,
  TouchableOpacity,
  Text,
} from "react-native";
import { Input } from "@rneui/themed";
import { supabase } from "@/lib/supabse";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function Signup() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState(""); // Updated to 'fullName'
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signUpWithEmail() {
    if (password !== confirmPassword) {
      Alert.alert("Passwords do not match!");
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      Alert.alert(error.message);
      setLoading(false);
      return;
    }

    if (!data?.user) {
      Alert.alert("Please check your inbox for email verification!");
    } else {
      // Update user metadata
      const { error: updateError } = await supabase
        .from("profiles") // Replace "profiles" with your actual table name
        .insert({
          id: data.user.id, // Use the user ID from Supabase
          full_name: fullName, // Use 'full_name' for the field
          username,
        });

      if (updateError) {
        Alert.alert("Failed to save user details:", updateError.message);
      } else {
        Alert.alert("Signup successful! Please verify your email.");
      }
    }
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input
          label="Full Name"
          leftIcon={
            <Ionicons name="person-outline" size={20} color="#7B6F72" />
          }
          onChangeText={(text) => setFullName(text)} // Updated to 'setFullName'
          value={fullName} // Updated to 'fullName'
          placeholder="Full Name"
          autoCapitalize={"none"}
        />
      </View>
      <View style={[styles.verticallySpaced]}>
        <Input
          label="Username"
          leftIcon={
            <Ionicons name="person-circle-outline" size={24} color="#7B6F72" />
          }
          onChangeText={(text) => setUsername(text)}
          value={username}
          placeholder="User Name"
          autoCapitalize={"none"}
        />
      </View>
      <View style={[styles.verticallySpaced]}>
        <Input
          label="Email"
          leftIcon={{
            type: "font-awesome",
            name: "envelope-o",
            color: "#7B6F72",
            size: 20,
          }}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={"none"}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Password"
          leftIcon={
            <Ionicons name="lock-closed-outline" size={20} color="#7B6F72" />
          }
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={"none"}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Confirm Password"
          leftIcon={
            <Ionicons name="lock-closed-outline" size={20} color="#7B6F72" />
          }
          onChangeText={(text) => setConfirmPassword(text)}
          value={confirmPassword}
          secureTextEntry={true}
          placeholder="Re-enter Password"
          autoCapitalize={"none"}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Link style={styles.Link} href="/(auth)/login">
          Already have an account? Sign in
        </Link>
      </View>
      <TouchableOpacity
        disabled={loading}
        onPress={signUpWithEmail}
        style={[
          styles.button,
          { backgroundColor: loading ? "#555" : "#2C3036" },
        ]}
      >
        <Text style={styles.title}>Sign up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 2,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
  Link: {
    color: "#7B6F72",
    textAlign: "center",
    fontFamily: "poppins",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    height: 60,
    width: "90%",
    borderRadius: 99,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "#2C3036",
  },
  title: {
    color: "#fff",
    fontFamily: "poppins",
    fontSize: 18,
    fontWeight: "bold",
  },
});
