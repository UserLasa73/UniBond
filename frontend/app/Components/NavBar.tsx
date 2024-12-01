import { Tabs } from "expo-router";
import { SafeAreaView } from "react-native";

const NavBar = () => {
  return (
    <>
      <Tabs>
        <Tabs.Screen name="home" />
      </Tabs>
    </>
  );
};

export default NavBar;
