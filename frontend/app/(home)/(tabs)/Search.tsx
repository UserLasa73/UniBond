import * as React from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";
import SearchBar from "../../Components/SearchBar";
import { supabase } from "../../../lib/supabse"; // Import your Supabase client

const Search = () => {
  const [searchResults, setSearchResults] = React.useState([]);

  const handleSearch = async (query: string) => {
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    try {
      // Query Supabase profile table
      const { data, error } = await supabase
        .from("profiles") // Use your table name
        .select("*") // Adjust fields as needed
        .ilike("username", `%${query}%`); // Replace 'username' with your actual column for user names

      if (error) throw error;

      setSearchResults(data || []); // Set results
    } catch (error) {
      console.error("Error fetching profiles:", error);
      setSearchResults([]);
    }
  };

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="Search here..."
        onSearch={handleSearch} // Pass the handleSearch function
      />
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.id.toString()} // Replace 'id' with your table's primary key
        renderItem={({ item }) => (
          <View style={styles.resultItem}>
            <Text>{item.username}</Text> {/* Replace 'username' with the relevant field */}
          </View>
        )}
        ListEmptyComponent={<Text>No results found</Text>}
      />
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  resultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});
