import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useRouter } from "expo-router";

const OnScreen = () => {
  const router = useRouter();

  const handleNavigation = (userType) => {
    router.push({
      pathname: "../(auth)/Signup",
      params: { userType }, // Passing userType to the signup screen
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to UniBond</Text>
      <Text style={styles.subTitle}>
        Connect with your university network. Whether you're a student or an
        alumnus, stay updated with job opportunities and projects.
      </Text>
      <Image
        source={require("../Constatnts/uniBond-01.png")}
        style={styles.logo}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.AlumniButton, { backgroundColor: "#2C3036" }]}
          onPress={() => handleNavigation("student")}
          activeOpacity={0.8}
        >
          <Text style={styles.StudentButton}>Student</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.AlumniButton]}
          onPress={() => handleNavigation("alumni")}
          activeOpacity={0.8}
        >
          <Text style={styles.AlumniText}>Alumni</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OnScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  title: {
    fontSize: 50,
    paddingHorizontal: 20,
    fontWeight: "900",
    textAlign: "center",
    color: "#2C3036",
    marginTop: 40,
  },
  logo: {
    width: 600,
    height: 600,
    position: "absolute",
    top: "10%",
    resizeMode: "contain",
  },
  subTitle: {
    fontSize: 18,
    paddingHorizontal: 20,
    textAlign: "center",
    color: "#2C3036",
    marginVertical: 20,
    justifyContent: "center",
    position: "absolute",
    top: "70%",
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: "row",
    borderWidth: 2,
    borderColor: "#2C3036",
    width: "80%",
    height: 60,
    borderRadius: 100,
    bottom: 30,
    position: "absolute",
  },
  AlumniButton: {
    justifyContent: "center",
    alignItems: "center",
    width: "52%",
    borderRadius: 98,
  },
  StudentButton: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
  },
  AlumniText: {
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
    color: "#2C3036",
  },
});
