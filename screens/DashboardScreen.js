import React, { useState, useEffect, useContext } from "react";
import { View, StyleSheet, Switch, Text, FlatList, TouchableOpacity, Button, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SearchBar from "../components/SearchBar";
import { ThemeContext } from "../context/ThemeContext";
import { Picker } from "@react-native-picker/picker"; // Import Picker for filter options

const DashboardScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState([]); // State to store tasks
  const [search, setSearch] = useState(""); // State for search query
  const [categoryFilter, setCategoryFilter] = useState(""); // State for category filter
  const [statusFilter, setStatusFilter] = useState(""); // State for status filter
  const [selectedTask, setSelectedTask] = useState(null); // State to track selected task
  const { theme, toggleTheme } = useContext(ThemeContext); // Access theme for light/dark mode

  // Fetch tasks from AsyncStorage when component mounts
  useEffect(() => {
    const loadTasks = async () => {
      const storedTasks = await AsyncStorage.getItem("tasks");
      if (storedTasks) setTasks(JSON.parse(storedTasks)); // Set tasks from AsyncStorage
    };
    loadTasks();
  }, []);

  // Filter tasks based on the search query, category, and status
  const filteredTasks = tasks
    .filter((task) => task.name.toLowerCase().includes(search.toLowerCase()))
    .filter((task) => (categoryFilter ? task.category === categoryFilter : true))
    .filter((task) => (statusFilter ? task.status === statusFilter : true));

  // Handle task press to toggle visibility of details
  const handleTaskPress = (task) => {
    setSelectedTask((prevTask) => (prevTask?.id === task.id ? null : task)); // Toggle task details visibility
  };

  // Toggle task status (Completed / Pending)
  const toggleTaskStatus = async (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId
        ? { ...task, status: task.status === "Completed" ? "Pending" : "Completed" }
        : task
    );
    setTasks(updatedTasks);
    await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  // Delete a task
  const deleteTask = async (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
    await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Dark Mode Toggle */}
      <View style={styles.toggleContainer}>
        <Text style={[styles.toggleText, { color: theme.text }]}>Dark Mode</Text>
        <Switch
          value={theme.background === "#000000"}
          onValueChange={toggleTheme}
          thumbColor={theme.button}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
        />
      </View>

      {/* Add Task Button */}
      <Button
  title="Add Task"
  onPress={() => navigation.navigate("Add Task", { setTasks })} // Pass setTasks as prop
/>

      {/* Search Bar for filtering tasks */}
      <SearchBar search={search} setSearch={setSearch} />

      {/* Category Filter (Picker) */}
      <Picker
        selectedValue={categoryFilter}
        onValueChange={setCategoryFilter}
        style={[styles.picker, { backgroundColor: theme.inputBackground }]}
      >
        <Picker.Item label="All Categories" value="" />
        <Picker.Item label="Academic" value="Academic" />
        <Picker.Item label="Personal" value="Personal" />
        <Picker.Item label="Work" value="Work" />
      </Picker>

      {/* Status Filter (Picker) */}
      <Picker
        selectedValue={statusFilter}
        onValueChange={setStatusFilter}
        style={[styles.picker, { backgroundColor: theme.inputBackground }]}
      >
        <Picker.Item label="All Status" value="" />
        <Picker.Item label="Completed" value="Completed" />
        <Picker.Item label="Incomplete" value="Pending" />
      </Picker>

      {/* Render Task List */}
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.taskWrapper}>
            <TouchableOpacity onPress={() => handleTaskPress(item)}>
              <View
                style={[
                  styles.taskItem,
                  { backgroundColor: theme.inputBackground },
                  item.status === "Completed" && styles.completedTask, // Strike-through for completed tasks
                ]}
              >
                <Text style={[styles.taskText, { color: theme.text }]}>{item.name}</Text>
                <Text style={[styles.taskText, { color: theme.text }]}>{item.deadline}</Text>
                {/* Toggle for marking task as completed */}
                <Switch
                  value={item.status === "Completed"}
                  onValueChange={() => toggleTaskStatus(item.id)}
                  thumbColor={theme.button}
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                />
              </View>
            </TouchableOpacity>

            {/* Task Details Section */}
            {selectedTask?.id === item.id && (
              <View style={[styles.taskDetails, { backgroundColor: theme.inputBackground }]}>
                <Text style={[styles.taskDetailText, { color: theme.text }]}>Category: {item.category}</Text>
                <Text style={[styles.taskDetailText, { color: theme.text }]}>Status: {item.status}</Text>
              </View>
            )}

            {/* Delete Button (Cross) */}
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteTask(item.id)} // Delete task on press
            >
              <Text style={styles.deleteText}>X</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  toggleText: { fontSize: 16, fontWeight: "bold" },
  taskWrapper: {
    position: "relative", // Make task container relative to position delete button
  },
  taskItem: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  taskText: {
    fontSize: 16,
  },
  completedTask: {
    textDecorationLine: "line-through",
    color: "#888", // Add a gray color for completed tasks
  },
  taskDetails: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    marginLeft: 20,
  },
  taskDetailText: {
    fontSize: 14,
  },
  picker: {
    height: 50,
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  deleteButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#FF6347", // Tomato color for delete button
    padding: 5,
    borderRadius: 15,
  },
  deleteText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default DashboardScreen;
