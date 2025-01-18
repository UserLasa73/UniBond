import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Alert,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
} from "react-native";
import { Input, Button } from "@rneui/themed";
import { useRouter, useLocalSearchParams, Link } from "expo-router";
import { supabase } from "@/lib/supabse";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { userType } = useLocalSearchParams(); // Retrieves userType
  console.log("User Type:", userType);

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

      // Step 2: Prepare profile data, only include fields that are not empty
      const profileData = {
        id: userId,
        full_name: fullName || undefined, // Don't include if empty
        username: username || undefined, // Don't include if empty
        registration_number: registrationNumber || undefined, // Don't include if empty
        role: userType === "alumni" ? true : undefined, // Include only if alumni
        updated_at: new Date(),
      };

      // Add alumni-specific fields if userType is "alumni"
      if (userType === "alumni") {
        if (graduationYear) {
          // Convert graduation year to a Date type (first day of the year)
          const graduationDate = new Date(`${graduationYear}-01-01`);
          profileData.graduation_year = graduationDate;
        }
        if (jobTitle) profileData.job_title = jobTitle;
      }

      // Step 3: Insert the profile into the database
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert(profileData);

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

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const year = selectedDate.getFullYear();
      setGraduationYear(year.toString()); // Set only the year
    }
  };

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        <Input
          label="Full Name"
          leftIcon={
            <Ionicons name="person-outline" size={20} color="#7B6F72" />
          }
          onChangeText={(text) => setFullName(text)}
          value={fullName}
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
          leftIcon={<Ionicons name="mail-outline" size={20} color="#7B6F72" />}
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

        {/* Registration Number - Shown for both students and alumni */}
        <Input
          label="Registration Number"
          leftIcon={<Ionicons name="card-outline" size={20} color="#7B6F72" />}
          onChangeText={(text) => setRegistrationNumber(text)}
          value={registrationNumber}
          placeholder="Registration Number"
          autoCapitalize={"none"}
        />

        {/* Alumni-specific fields */}
        {userType === "alumni" && (
          <>
            <Input
              label="Job Title"
              leftIcon={
                <Ionicons name="briefcase-outline" size={20} color="#7B6F72" />
              }
              onChangeText={(text) => setJobTitle(text)}
              value={jobTitle}
              placeholder="Job Title"
              autoCapitalize={"none"}
            />
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={styles.inputContainer}
            >
              <Ionicons name="calendar-outline" size={20} color="#7B6F72" />
              <Text style={styles.inputText}>
                {graduationYear || "Select Graduation Year"}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                value={new Date()}
                onChange={handleDateChange}
                maximumDate={new Date()} // Ensure no future years are selected
              />
            )}
          </>
        )}
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
          <Text style={styles.title}>
            {loading ? "Signing Up..." : "Sign Up"}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </ScrollView>
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    width: "100%",
    marginBottom: 20,
  },
  Link: {
    color: "#7B6F72",
    textAlign: "center",
    fontFamily: "poppins",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  inputText: {
    marginLeft: 8,
    color: "#000",
    fontSize: 16,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    height: 60,
    width: "90%",
    borderRadius: 99,
    alignItems: "center",
    justifyContent: "center",
    bottom: 0,
    alignSelf: "center",
    backgroundColor: "#2C3036",
    marginTop: 20,
  },
  title: {
    color: "#fff",
    fontFamily: "poppins",
    fontSize: 18,
    fontWeight: "bold",
  },
});
