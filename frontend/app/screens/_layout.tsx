import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen
        name="screens/PostScreen"
        options={{ title: "Share Post" }}
      />
      <Stack.Screen
        name="screens/AddPostScreen"
        options={{ title: "Add a Post" }}
      />
      <Stack.Screen
        name="screens/AddProjectScreen"
        options={{ title: "Add a Project" }}
      />
      <Stack.Screen
        name="screens/AddJobScreen"
        options={{ title: "Add a Job" }}
      />
      <Stack.Screen
        name="screens/AddEventScreen"
        options={{ title: "Add an Event" }}
      />
    </Stack>
  );
};

export default Layout;
