import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { useRouter } from "expo-router";

const jobs = ["Software Engineer", "Data Analyst", "Web Developer"];
const projects = ["React App", "AI Model", "Mobile App"];
const users = ["John Doe", "Jane Smith", "Alice Johnson"];

const SearchScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"jobs" | "projects" | "users">("jobs");
  const router = useRouter();

  const dataMap = {
    jobs,
    projects,
    users,
  };

  const filteredData = dataMap[selectedCategory].filter((item) =>
    item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder={`Search ${selectedCategory}...`}
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
        <TouchableOpacity onPress={() => router.push("../(tabs)/Home")}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.categoryTabs}>
        {["jobs", "projects", "users"].map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => setSelectedCategory(category as "jobs" | "projects" | "users")}
            style={[
              styles.tab,
              selectedCategory === category && styles.activeTab,
            ]}
          >
            <Text style={selectedCategory === category ? styles.activeTabText : styles.tabText}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={(item, index) => `${item}-${index}`}
        renderItem={({ item }) => (
          <View style={styles.resultItem}>
            <Text style={styles.resultText}>{item}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.noResults}>No results found.</Text>}
      />
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
  categoryTabs: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 5,
    backgroundColor: "#f5f5f5",
  },
  activeTab: {
    backgroundColor: "#007BFF",
  },
  tabText: {
    fontSize: 14,
    color: "#333",
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "bold",
  },
  resultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  resultText: {
    fontSize: 16,
    color: "#333",
  },
  noResults: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#999",
  },
});

export default SearchScreen;
