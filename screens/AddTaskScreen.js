import React, { useState, useEffect, useContext } from "react";
import { View, TextInput, Button, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchCategories } from "../utils/api";
import { ThemeContext } from "../context/ThemeContext";
import { Picker } from "@react-native-picker/picker";

const AddTaskScreen = ({ route, navigation }) => {
  const { setTasks } = route.params || {}; // Ensure setTasks is passed from parent
  const { theme } = useContext(ThemeContext); // Access theme for light/dark mode

  const [taskName, setTaskName] = useState("");
  const [taskDeadline, setTaskDeadline] = useState("");
  const [taskCategory, setTaskCategory] = useState("");
  const [categories, setCategories] = useState([]);

  // Fetch categories from the API when the component mounts
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const fetchedCategories = await fetchCategories();
        if (fetchedCategories && Array.isArray(fetchedCategories)) {
          setCategories(fetchedCategories);
        } else {
          Alert.alert("No Categories", "No categories available.");
        }
      } catch (error) {
        console.error("Error fetching categories", error);
        Alert.alert("Error", "Failed to load categories.");
      }
    };
    loadCategories();
  }, []);

  // Save new task to AsyncStorage and update parent state
  const saveTask = async (newTask) => {
    try {
      const storedTasks = await AsyncStorage.getItem("tasks");
      let tasks = storedTasks ? JSON.parse(storedTasks) : [];
      tasks.push(newTask);
      await AsyncStorage.setItem("tasks", JSON.stringify(tasks));
      
      // Update the parent component (Dashboard) with the new tasks
      if (setTasks) {
        setTasks(tasks); // Immediately update the task list in the parent
      }
    } catch (error) {
      console.error("Error saving task", error);
      Alert.alert("Error", "Failed to save the task.");
    }
  };

  // Handle adding a new task
  const handleAddTask = () => {
    if (taskName && taskDeadline && taskCategory) {
      const newTask = {
        id: Date.now(),
        name: taskName,
        deadline: taskDeadline,
        category: taskCategory,
        status: "Pending",
      };

      // Save the task to AsyncStorage and update the parent state
      saveTask(newTask);

      // Navigate back to the DashboardScreen after adding the task
      navigation.goBack();
    } else {
      Alert.alert("Validation Error", "Please fill in all fields.");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Task Name Input */}
      <TextInput
        style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.text }]}
        placeholder="Task Name"
        value={taskName}
        onChangeText={setTaskName}
      />

      {/* Deadline Input */}
      <TextInput
        style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.text }]}
        placeholder="Deadline"
        value={taskDeadline}
        onChangeText={setTaskDeadline}
      />

      {/* Category Dropdown */}
      <Picker
        selectedValue={taskCategory}
        style={[styles.picker, { backgroundColor: theme.inputBackground, color: theme.text }]}
        onValueChange={(itemValue) => setTaskCategory(itemValue)}
      >
        <Picker.Item label="Select Category" value="" />
        {categories.length > 0 ? (
          categories.map((category) => (
            <Picker.Item key={category} label={category} value={category} />
          ))
        ) : (
          <Picker.Item label="No Categories Available" value="" />
        )}
      </Picker>

      {/* Add Task Button */}
      <Button title="Add Task" onPress={handleAddTask} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
  },
  picker: {
    height: 50,
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    paddingHorizontal: 10,
  },
});

export default AddTaskScreen;
