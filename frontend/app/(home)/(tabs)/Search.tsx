import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import SearchBar from "../../Components/SearchBar";

const Search = () => {
  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="Search here..."
        onSearch={(query) => console.log(query)}
      />
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {},
});
