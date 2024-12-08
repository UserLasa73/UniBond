import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import SearchInput from "../Components/SearchInput";

const Search = () => {
  return (
    <View style={styles.container}>
      <SearchInput />
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {},
});
