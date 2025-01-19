// src/components/SearchBar.js
import React from "react";
import { TextInput, StyleSheet } from "react-native";

const SearchBar = ({ search, setSearch }) => {
  return (
    <TextInput
      style={styles.input}
      placeholder="Search tasks"
      value={search}
      onChangeText={setSearch} // Update search state when text changes
    />
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingLeft: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
});

export default SearchBar;
