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
  const { userId } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const { session } = useAuth();
  const router = useRouter();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [profileExists, setProfileExists] = useState(false);

  useEffect(() => {
    if (userId || session) getProfile();
  }, [userId, session]);

  async function getProfile() {
    try {
      setLoading(true);
      const profileId = userId || session?.user?.id;
      if (!profileId) throw new Error("No user or session available!");

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
      if (error instanceof Error) Alert.alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile() {
    try {
      setLoading(true);
      const profileId = session?.user?.id;
      if (!profileId) throw new Error("No user on the session!");

      const updates = {
        id: profileId,
        username,
        avatar_url: avatarUrl,
        full_name: fullname,
        dob: dob.toISOString(),
        contact_number: contactNumber,
        gender,
        department,
        faculty,
        course,
        skills,
        interests,
        updated_at: new Date(),
      };

      const { error } = await supabase.from("profiles").upsert(updates);

      if (error) throw error;
      Alert.alert("Profile Updated!");
    } catch (error) {
      if (error instanceof Error) Alert.alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    checkIfProfileExists();
  }, [session]);

  async function checkIfProfileExists() {
    try {
      setLoading(true);
      const profileId = session?.user?.id;
      if (!profileId) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", profileId)
        .single();

      if (data) {
        setProfileExists(true);
        router.push("/home"); // Redirect existing users
      }
    } catch (error) {
      if (error instanceof Error) Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  }

  if (profileExists) return null;

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 22 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>{fullname || "Profile"}</Text>
      </View>
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

        <Button
          title="Sign Out"
          onPress={async () => {
            try {
              const { error } = await supabase.auth.signOut();
              if (error) throw error;
              router.push("../(auth)/login");
            } catch (error) {
              if (error instanceof Error) Alert.alert("Error", error.message);
            }
          }}
        />
      </ScrollView>
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
