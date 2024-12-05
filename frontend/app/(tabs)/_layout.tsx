import { Redirect, Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Import the Ionicons icon library

const Layout = () => {
  return (
    <Tabs>
      <Tabs.Screen
        name="Home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Jobs"
        options={{
          title: "Jobs",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name="briefcase" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Search"
        options={{
          title: "Search",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <View className="p-2 bg-gray-900 rounded-full -mt-1">
              {" "}
              {/* Move slightly upwards */}
              <Ionicons name="search" size={24} color="white" />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="Addpost"
        options={{
          title: "Add",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name="add-circle-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Projects"
        options={{
          title: "Projects",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name="folder-open" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default Layout;
