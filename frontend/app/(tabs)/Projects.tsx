import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import Project_topbar from '../Components/Project_topbar';
import Project_conditionbar from '../Components/Project_conditionbar'

const Projects = () => {
  return (
    <View style={styles.container}>
      {/* <Text>Projects</Text> */}
      <Project_topbar/>
      <Project_conditionbar/>
    </View>
  );
};

export default Projects;

const styles = StyleSheet.create({
  container: {},
});
