// src/components/TaskList.js
import React, { useContext } from "react";
import { FlatList, Text, View, StyleSheet } from "react-native";
import { ThemeContext } from "../context/ThemeContext";

const TaskList = ({ tasks }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <FlatList
      data={tasks}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={[styles.task, { backgroundColor: theme.inputBackground }]}>
          <Text style={[styles.taskName, { color: theme.text }]}>
            {item.name}
          </Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  task: { padding: 10, marginVertical: 5, borderRadius: 5 },
  taskName: { fontSize: 16 },
});

export default TaskList;
