import { createStackNavigator } from "@react-navigation/stack";
import {
  NavigationContainer,
  NavigatorScreenParams,
} from "@react-navigation/native";
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

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="PostScreen">
        <Stack.Screen
          name="PostScreen"
          component={PostScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddPostScreen"
          component={AddPostScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddProjectScreen"
          component={AddProjectScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddJobScreen"
          component={AddJobScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddEventScreen"
          component={AddEventScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
