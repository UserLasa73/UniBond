import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";

const GetStartedPage = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../Constatnts/uniBond-01.png")}
        style={styles.logo}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("../(auth)/login")}
      >
        <Text style={styles.title}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

export default GetStartedPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  logo: {
    width: 400,
    height: 400,
    marginBottom: 40,
    resizeMode: "contain",
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    height: 60,
    width: "90%",
    borderRadius: 99,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "#2C3036",
  },
  title: {
    color: "#fff",
    fontFamily: "poppins",
    fontSize: 18,
    fontWeight: "bold",
  },
});
