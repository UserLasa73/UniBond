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
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [portfolio, setPortfolio] = useState("");
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
          `username, avatar_url, full_name, dob, contact_number, gender, department, faculty, course, skills, interests, github, linkedin, portfolio`
        )
        .eq("id", profileId)
        .single();

      if (error) throw error;

      if (data) {
        setUsername(data.username);
        setAvatarUrl(data.avatar_url || "");
        setFullname(data.full_name);
        setDob(new Date(data.dob));
        setContactNumber(data.contact_number || "");
        setGender(data.gender || "");
        setDepartment(data.department || "");
        setFaculty(data.faculty || "");
        setCourse(data.course || "");
        setSkills(data.skills || "");
        setInterests(data.interests || "");
        setGithub(data.github || "");
        setLinkedin(data.linkedin || "");
        setPortfolio(data.portfolio || "");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      if (error instanceof Error) Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile(updates) {
    try {
      setLoading(true);
      const profileId = session?.user?.id;
      if (!profileId) throw new Error("No user on the session!");

      const { data, error } = await supabase
        .from("profiles")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profileId)
        .select();

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
              onUpload={(url) => {
                setAvatarUrl(url);
                updateProfile({
                  username,
                  avatar_url: url,
                  full_name: fullname,
                  dob: dob.toISOString(),
                  contact_number: contactNumber,
                  gender: gender,
                  department: department,
                  faculty: faculty,
                  course: course,
                  skills: skills,
                  interests: interests,
                  github: github,
                  linkedin: linkedin,
                  portfolio: portfolio,
                });
              }}
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
          <Input
            label="GitHub"
            value={github}
            onChangeText={setGithub}
            placeholder="https://github.com/yourusername"
          />
          <Input
            label="LinkedIn"
            value={linkedin}
            onChangeText={setLinkedin}
            placeholder="https://linkedin.com/in/yourusername"
          />
          <Input
            label="Portfolio"
            value={portfolio}
            onChangeText={setPortfolio}
            placeholder="https://yourportfolio.com"
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

          <TouchableOpacity
            style={styles.Button}
            onPress={() =>
              updateProfile({
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
                github: github,
                linkedin: linkedin,
                portfolio: portfolio,
              })
            }
            disabled={loading}
          >
            <Text style={styles.postButtonText}>
              {loading ? "Updating..." : "Update Profile"}
            </Text>
          </TouchableOpacity>
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
  Button: {
    backgroundColor: "#2C3036",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 40,
  },
  postButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
