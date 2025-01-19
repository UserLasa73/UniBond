import { useEffect, useState } from "react";
import { supabase } from "../lib/supabse";
import { useAuth } from "../providers/AuthProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity, View, Text, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ShowingAvatar from "../Components/ShowingAvatar";
import { router, useLocalSearchParams } from "expo-router";

export default function ShowProfileEdit() {
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const { session } = useAuth();
  const [contactNumber, setContactNumber] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState(new Date());
  const [department, setDepartment] = useState("");
  const [faculty, setFaculty] = useState("");
  const [course, setCourse] = useState("");
  const [skills, setSkills] = useState("");
  const [interests, setInterests] = useState("");
  const { userId } = useLocalSearchParams();
  useEffect(() => {
    if (userId || session) getProfile();
  }, [userId, session]);
  async function getProfile() {
    try {
      const profileId = userId || session?.user?.id;
      if (!profileId) throw new Error("No user on the session!");

      const { data, error } = await supabase
        .from("profiles")
        .select(
          `username, avatar_url, full_name, dob, contact_number, gender, department, faculty, course, skills, interests`
        )
        .eq("id", profileId)
        .single();

      if (data) {
        setUsername(data.username);
        setFullname(data.full_name);
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

      if (error) throw error;
    } catch (error) {
      console.error("Error fetching profile:", error);
      if (error instanceof Error) Alert.alert("Error", error.message);
    }
  }
  const handleEditPress = () => {
    router.push("/screens/DetailsForStudents");
  };
  return (
    <SafeAreaView>
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <TouchableOpacity
          style={{ position: "absolute", left: 0 }}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View
        style={{
          alignItems: "flex-start",
          marginTop: 40,
          marginRight: 20,
          marginLeft: 20,
        }}
      >
        <ShowingAvatar
          url={avatarUrl}
          size={150}
          onUpload={(newAvatarUrl) => setAvatarUrl(newAvatarUrl)}
        />
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          {fullname || "Profile"}
        </Text>
        <Text style={{ fontSize: 20 }}>
          {faculty} | {department}
        </Text>
        <Text style={{ fontSize: 20 }}>{skills} </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginHorizontal: 20,
          marginTop: 20,
        }}
      >
        <TouchableOpacity
          onPress={handleEditPress}
          style={{
            backgroundColor: "#2C3036",
            padding: 10,
            borderRadius: 25,
            flex: 1,
            alignItems: "center",
            marginRight: 10, // Add margin to separate the buttons
          }}
        >
          <Text style={{ color: "#fff" }}>Edit</Text>
        </TouchableOpacity>
        {!userId && (
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
              borderWidth: 2, // Add border width
              borderColor: "#2C3036", // Set the border color
              backgroundColor: "transparent",
              padding: 10,
              borderRadius: 40,
              flex: 1,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#2C3036" }}>Sign Out</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}
