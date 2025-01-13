import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import GetStartedPage from "./Components/GetStart";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";

// Configure the logger for Reanimated
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn, // Set log level to warn
  strict: false, // Disable strict mode logging to suppress warnings
});

const Index = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1, alignItems: "center" }}>
      {/* Main Component */}
      <GetStartedPage />
    </GestureHandlerRootView>
  );
};

export default Index;
