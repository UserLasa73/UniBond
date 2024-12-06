import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import Project_topbar from '../Components/Project_topbar';

const Projects = () => {
  return (
    <View style={styles.container}>
      {/* <Text>Projects</Text> */}
      <Project_topbar/>
    </View>
  );
};

export default Projects;

const styles = StyleSheet.create({
  container: {},
});
