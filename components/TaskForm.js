// src/components/TaskForm.js
import React, { useState, useEffect } from "react";
import { View, TextInput, Button, StyleSheet, Picker } from "react-native";
import { fetchCategories } from "../utils/api";

const TaskForm = ({ onSubmit, initialData = {} }) => {
  const [taskName, setTaskName] = useState(initialData.name || "");
  const [deadline, setDeadline] = useState(initialData.deadline || "");
  const [category, setCategory] = useState(initialData.category || "");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      const data = await fetchCategories();
      setCategories(data);
    };
    loadCategories();
  }, []);

  const handleSubmit = () => {
    onSubmit({ name: taskName, deadline, category, completed: false });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Task Name"
        value={taskName}
        onChangeText={setTaskName}
      />
      <TextInput
        style={styles.input}
        placeholder="Deadline"
        value={deadline}
        onChangeText={setDeadline}
      />
      <Picker selectedValue={category} onValueChange={setCategory} style={styles.input}>
        <Picker.Item label="Select Category" value="" />
        {categories.map((cat, index) => (
          <Picker.Item key={index} label={cat} value={cat} />
        ))}
      </Picker>
      <Button title="Save Task" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  input: { borderWidth: 1, marginBottom: 10, padding: 8, borderRadius: 5 },
});

export default TaskForm;
