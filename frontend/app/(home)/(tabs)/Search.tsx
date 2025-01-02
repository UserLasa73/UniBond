import * as React from "react";
import { Text, View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import SearchBar from "../../Components/SearchBar";
import { supabase } from "../../../lib/supabse"; // Import your Supabase client
import { useRouter } from "expo-router";

// Define the type for the profiles table
interface Profile {
  id: string; // Replace with the actual type of the ID field
  username: string; // Replace with the actual username field
  // Add other fields as needed
}

const Search = () => {
  const [searchResults, setSearchResults] = React.useState<Profile[]>([]); // Ensure the state is typed
  const router = useRouter();

  const handleSearch = async (query: string) => {
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    try {
      // Query Supabase profile table
      const { data, error } = await supabase
      .from<"profiles", Profile>("profiles") // Specify the type for the table
        .select("*") // Adjust fields as needed
        .ilike("username", `%${query}%`); // Replace 'username' with your actual column for user names

      if (error) throw error;

      setSearchResults(data || []); // Safely set results
    } catch (error) {
      console.error("Error fetching profiles:", error);
      setSearchResults([]);
    }
  };

  const handleUserPress = (user: Profile) => {
    router.push({
      pathname: "/screens/ProfileScreen",
      params: { userId: user.id }, // Pass user ID or other relevant data
    });
  };

  return (
    <View style={styles.container}>
      <SearchBar placeholder="Search here..." onSearch={handleSearch} />
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.id} // Replace 'id' with your table's primary key
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.resultItem}
            onPress={() => handleUserPress(item)}
          >
            <Text>{item.username}</Text>
          </TouchableOpacity>
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
