import React, { useEffect } from "react";
import { View, TextInput, StyleSheet, BackHandler } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
}

export default function SearchBar({ placeholder = "Search...", onSearch }: SearchBarProps) {
  const [query, setQuery] = React.useState("");

  const handleSearch = (text: string) => {
    setQuery(text);
    onSearch(text);
  };

  // Clear search bar on back press
  useEffect(() => {
    const handleBackPress = () => {
      setQuery(""); // Clear the search text
      return false; // Allow default back navigation
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", handleBackPress);

    return () => {
      backHandler.remove(); // Cleanup
    };
  }, []);

  return (
    <View style={styles.container}>
      {MaterialIcons ? (
        <MaterialIcons name="search" size={24} color="gray" />
      ) : (
        <View style={{ width: 24, height: 24, backgroundColor: "gray" }} />
      )}
      <TextInput
        style={styles.input}
        placeholder={placeholder || "Search..."}
        value={query}
        onChangeText={handleSearch}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginVertical: 10,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
});
