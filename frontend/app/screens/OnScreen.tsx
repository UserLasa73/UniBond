import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useRouter } from "expo-router";

const OnScreen = () => {
  const router = useRouter();

  const handleNavigation = (userType) => {
    router.push({
      pathname: "../(auth)/Signup",
      params: { userType }, // Passing userType to the signup screen
    });
    console.log({ userType });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to UniBond</Text>
      <Text style={styles.subTitle}>
        Connect with your university network. Whether you're a student or an
        alumnus, stay updated with job opportunities and projects.
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.loginButtonWrapper, { backgroundColor: "#45484A" }]}
          onPress={() => handleNavigation("student")}
          activeOpacity={0.8}
        >
          <Text style={styles.loginButtonText}>Student</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.loginButtonWrapper]}
          onPress={() => handleNavigation("alumni")}
          activeOpacity={0.8}
        >
          <Text style={styles.signupButtonText}>Alumni</Text>
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
    fontSize: 40,
    fontFamily: "Poppins-SemiBold",
    paddingHorizontal: 20,
    textAlign: "center",
    color: "#45484A",
    marginTop: 40,
  },
  subTitle: {
    fontSize: 18,
    paddingHorizontal: 20,
    textAlign: "center",
    color: "#AEB5BB",
    marginVertical: 20,
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: "row",
    borderWidth: 2,
    borderColor: "#45484A",
    width: "80%",
    height: 60,
    borderRadius: 100,
  },
  loginButtonWrapper: {
    justifyContent: "center",
    alignItems: "center",
    width: "50%",
    borderRadius: 98,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
  },
  signupButtonText: {
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
    color: "#45484A",
  },
});
