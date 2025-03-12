import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  View,
  AppState,
  TouchableOpacity,
  Text,
} from "react-native";
import { supabase } from "../lib/supabse";
import { Input } from "@rneui/themed";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { registerForPushNotifications } from "../Components/Notifications/registerForPushNotifications"; 

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert(error.message);
    } else if (data?.user) {
      registerForPushNotifications(data.user.id); // Register push notifications after login
    }
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
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
      <TouchableOpacity
        disabled={loading}
        onPress={() => signInWithEmail()}
        style={[
          styles.button,
          { backgroundColor: loading ? "#555" : "#2C3036" },
        ]}
      >
        <Text style={styles.title}>Sign in</Text>
      </TouchableOpacity>
      <View style={styles.verticallySpaced}>
        <Link style={styles.Link} href="/screens/OnScreen">
          Don't have an account? Sign up
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensures the container takes up the entire screen
    alignItems: "center",
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    height: 60,
    width: "90%", // Makes the button slightly smaller than the screen width
    borderRadius: 99,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 20, // Places the button 20px above the bottom edge
    alignSelf: "center", // Centers the button horizontally
    backgroundColor: "#2C3036", // Default button color
  },
  title: {
    color: "#fff",
    fontFamily: "poppins",
    fontSize: 18,
    fontWeight: "bold",
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
});
