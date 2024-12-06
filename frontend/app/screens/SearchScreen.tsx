// screens/SearchScreen.tsx
import React from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";

interface SearchScreenProps {
  onExitSearch: () => void;
}

const SearchScreen: React.FC<SearchScreenProps> = ({ onExitSearch }) => {
  const [searchQuery, setSearchQuery] = React.useState("");

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="Search here..."
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
        <TouchableOpacity onPress={onExitSearch}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.resultText}>Search Results for "{searchQuery}"</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginRight: 10,
  },
  cancelText: {
    color: "#007BFF",
    fontSize: 16,
  },
  resultText: {
    marginTop: 20,
    fontSize: 18,
    color: "#333",
  },
});

export default SearchScreen;
