// _layout.tsx
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

// Import your screen components
import PostScreen from "./PostScreen";
import AddPostScreen from "./AddPostScreen";
import AddProjectScreen from "./AddProjectScreen";
import AddJobScreen from "./AddJobScreen";
import AddEventScreen from "./AddEventScreen";

export type PostStackParamList = {
  PostScreen: undefined;
  AddPostScreen: undefined;
  AddProjectScreen: undefined;
  AddJobScreen: undefined;
  AddEventScreen: undefined;
};

const Stack = createStackNavigator<PostStackParamList>();

const PostLayout = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="PostScreen">
        <Stack.Screen name="PostScreen" component={PostScreen} />
        <Stack.Screen name="AddPostScreen" component={AddPostScreen} />
        <Stack.Screen name="AddProjectScreen" component={AddProjectScreen} />
        <Stack.Screen name="AddJobScreen" component={AddJobScreen} />
        <Stack.Screen name="AddEventScreen" component={AddEventScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default PostLayout;
