import React, { useState } from "react";
import { StyleSheet, View, Alert, TouchableOpacity, Text } from "react-native";
import { Input, Button } from "@rneui/themed";
import { Link, useRouter } from "expo-router";
import { supabase } from "@/lib/supabse";
import { Ionicons } from "@expo/vector-icons";

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function signUpWithEmail() {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      // Step 1: Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data?.user) {
        Alert.alert("Success");
        return;
      }

      const userId = data.user.id;

      // Step 2: Insert the profile into the database
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: userId,
        full_name: fullName,
        username: username,

        avatar_url: "",
        updated_at: new Date(),
      });

      if (profileError) {
        throw new Error(profileError.message);
      }

      Alert.alert("Signup successful!");
      router.push("../(auth)/login"); // Navigate to login screen
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Error", error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Input
        label="Full Name"
        leftIcon={<Ionicons name="person-outline" size={20} color="#7B6F72" />}
        onChangeText={(text) => setFullName(text)} // Updated to 'setFullName'
        value={fullName} // Updated to 'fullName'
        placeholder="Full Name"
        autoCapitalize={"none"}
      />
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

      <View style={styles.verticallySpaced}>
        <Link style={styles.Link} href="/(auth)/login">
          Already have an account? Sign in
        </Link>
      </View>
      <Button
        title={loading ? "Signing Up..." : "Sign Up"}
        onPress={signUpWithEmail}
        disabled={loading}
        buttonStyle={styles.button}
      />
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
    padding: 16,
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
