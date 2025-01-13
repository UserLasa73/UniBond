import React, { useEffect, useState } from "react";
import { useAuth } from "../providers/AuthProvider";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Input, Button } from "@rneui/themed";
import DateTimePicker from "@react-native-community/datetimepicker";
import Avatar from "../Components/Avatar";
import { supabase } from "../lib/supabse";

export default function DetailsForStudents() {
  const [avatarUrl, setAvatarUrl] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState(new Date());
  const [department, setDepartment] = useState("");
  const [faculty, setFaculty] = useState("");
  const [course, setCourse] = useState("");
  const [skills, setSkills] = useState("");
  const [interests, setInterests] = useState("");
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const { session } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      const profileId = session?.user?.id;
      if (!profileId) throw new Error("No user on the session!");

      const { data, error } = await supabase
        .from("profiles")
        .select(
          `username, avatar_url, full_name, dob, contact_number, gender, department, faculty, course, skills, interests`
        )
        .eq("id", profileId)
        .single();

      if (error) throw error;

      if (data) {
        setUsername(data.username);
        setAvatarUrl(data.avatar_url);
        setFullname(data.full_name);
        setDob(new Date(data.dob));
        setContactNumber(data.contact_number);
        setGender(data.gender);
        setDepartment(data.department);
        setFaculty(data.faculty);
        setCourse(data.course);
        setSkills(data.skills);
        setInterests(data.interests);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      if (error instanceof Error) Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile() {
    try {
      setLoading(true);
      const profileId = session?.user?.id;
      if (!profileId) throw new Error("No user on the session!");

      // Check for duplicate username
      const { data: existingUser, error: checkError } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", username)
        .neq("id", profileId)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingUser) {
        Alert.alert("Error", "This username is already taken.");
        return;
      }

      const updates = {
        username,
        avatar_url: avatarUrl,
        full_name: fullname,
        dob: dob.toISOString(),
        contact_number: contactNumber,
        gender: gender,
        department: department,
        faculty: faculty,
        course: course,
        skills: skills,
        interests: interests,
        has_completed_details: true,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", profileId)
        .select(); // Ensure we get the updated data back if needed

      if (error) throw error;

      Alert.alert("Profile Updated Successfully!");
      router.push("/(home)/(tabs)/Home");
    } catch (error) {
      console.error("Error updating profile:", error);
      if (error instanceof Error) Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 22 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>{fullname || "Profile"}</Text>
      </View>
      {loading ? (
        <ActivityIndicator
          size="large"
          color="blue"
          style={{ marginTop: 20 }}
        />
      ) : (
        <ScrollView style={styles.container}>
          <View style={{ alignItems: "center" }}>
            <Avatar
              size={200}
              url={avatarUrl}
              onUpload={(url) => setAvatarUrl(url)}
            />
          </View>

          <Input label="Email" value={session?.user?.email} disabled />
          <Input label="Username" value={username} onChangeText={setUsername} />
          <Input label="Fullname" value={fullname} onChangeText={setFullname} />
          <Input
            label="Contact Number"
            value={contactNumber}
            onChangeText={setContactNumber}
          />
          <Input label="Gender" value={gender} onChangeText={setGender} />
          <Input
            label="Department"
            value={department}
            onChangeText={setDepartment}
          />
          <Input label="Faculty" value={faculty} onChangeText={setFaculty} />
          <Input label="Course" value={course} onChangeText={setCourse} />
          <Input label="Skills" value={skills} onChangeText={setSkills} />
          <Input
            label="Interests"
            value={interests}
            onChangeText={setInterests}
          />

          <View>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <Input
                label="Date of Birth"
                value={dob.toDateString()}
                editable={false}
              />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={dob}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) setDob(selectedDate);
                }}
              />
            )}
          </View>

          <Button
            title={loading ? "Updating..." : "Update Profile"}
            onPress={updateProfile}
            disabled={loading}
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
