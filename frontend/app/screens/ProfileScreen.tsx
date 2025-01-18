import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Alert,
  ScrollView,
  TouchableOpacity,
  Text,
  SafeAreaView,
} from "react-native";
import { Button, Input } from "@rneui/themed";
import { useAuth } from "../providers/AuthProvider";
import { useRouter, useLocalSearchParams } from "expo-router";
import Avatar from "../Components/Avatar";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { supabase } from "../lib/supabse";

export default function ProfileScreen() {
  const { userId } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState(new Date());
  const [department, setDepartment] = useState("");
  const [faculty, setFaculty] = useState("");
  const [course, setCourse] = useState("");
  const [skills, setSkills] = useState("");
  const [interests, setInterests] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const { session } = useAuth();
  const router = useRouter();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    if (userId || session) getProfile();
  }, [userId, session]);

  async function getProfile() {
    try {
      setLoading(true);
      const profileId = userId || session?.user?.id;

      if (!profileId) throw new Error("No user or session available!");

      const { data, error, status } = await supabase
        .from("profiles")
        .select(
          `username, avatar_url, full_name, gender, dob, department, faculty, course, skills, interests, contact_number`
        )
        .eq("id", profileId)
        .single();

      if (error && status !== 406) throw error;

      if (data) {
        setUsername(data.username);
        setAvatarUrl(data.avatar_url);
        setFullname(data.full_name);
        setGender(data.gender || "");
        setDob(new Date(data.dob) || new Date());
        setDepartment(data.department || "");
        setFaculty(data.faculty || "");
        setCourse(data.course || "");
        setSkills(data.skills || "");
        setInterests(data.interests || "");
        setContactNumber(data.contact_number || "");
      }
    } catch (error) {
      if (error instanceof Error) Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const updates = {
        id: session?.user?.id,
        username,
        avatar_url: avatarUrl,
        full_name: fullname,
        gender: gender,
        dob: dob.toDateString(),
        department: department,
        faculty: faculty,
        course: course,
        skills: skills,
        interests: interests,
        contact_number: contactNumber,
        updated_at: new Date(),
      };

      const { error } = await supabase.from("profiles").upsert(updates);

      if (error) throw error;

      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      if (error instanceof Error) Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 22 }}>
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <TouchableOpacity
          style={{ position: "absolute", left: 0 }}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          {fullname || "Profile"}
        </Text>
      </View>
      <ScrollView style={styles.container}>
        <View style={{ alignItems: "center" }}>
          <Avatar
            size={200}
            url={avatarUrl}
            onUpload={(url) => {
              setAvatarUrl(url);
              updateProfile();
            }}
          />
        </View>

        <View style={[styles.verticallySpaced, styles.mt20]}>
          <Input label="Email" value={session?.user?.email} disabled />
        </View>

        <View style={styles.verticallySpaced}>
          <Input
            label="Username"
            value={username}
            onChangeText={setUsername}
            disabled={!!userId}
          />
          <Input
            label="Full Name"
            value={fullname}
            onChangeText={setFullname}
            disabled={!!userId}
          />
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

        {!userId && (
          <TouchableOpacity
            onPress={updateProfile}
            style={styles.updateButton}
            disabled={loading}
          >
            <Text style={{ color: "#fff" }}>
              {loading ? "Loading..." : "Update Profile"}
            </Text>
          </TouchableOpacity>
        )}

        {!userId && (
          <TouchableOpacity
            onPress={async () => {
              try {
                const { error } = await supabase.auth.signOut();
                if (error) throw error;
                router.push("../(auth)/login");
              } catch (error) {
                if (error instanceof Error) Alert.alert("Error", error.message);
              }
            }}
            style={styles.updateButton}
          >
            <Text style={{ color: "#fff" }}>Sign Out</Text>
          </TouchableOpacity>
        )}
        {!userId && (
          <View style={styles.verticallySpaced}>
            <TouchableOpacity
              onPress={async () => {
                try {
                  const { error } = await supabase.auth.signOut();
                  if (error) throw error;
                  router.push("../(auth)/login");
                } catch (error) {
                  if (error instanceof Error) {
                    Alert.alert("Error", error.message);
                  }
                }
              }}
              style={{
                backgroundColor: "#2C3036",
                padding: 10,
                borderRadius: 5,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff" }}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
  updateButton: {
    backgroundColor: "#2C3036",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
  },
});
