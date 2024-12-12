import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Project_status(){
  return (
    <View style={styles.card}>
      {/* Title */}
      <Text style={styles.title}>Project Title</Text>

      {/* User Info */}
      <View style={styles.userInfo}>
        <Image
          source={{ uri: "https://via.placeholder.com/40" }} // Replace with actual image URL
          style={styles.avatar}
        />
        <View style={styles.textGroup}>
          <Text style={styles.name}>Name</Text>
          <Text style={styles.status}>Status:Pending</Text>
          <View style={styles.row}>
            <Ionicons name="time-outline" size={16} color="black" style={
              {marginRight: 4}}/>
            <Text style={styles.date}>Applied Aug 2</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    margin: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  textGroup: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  status: {
    fontSize: 14,
    color: "gray",
  },
  date: {
    fontSize: 12,
    color: "gray",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
});