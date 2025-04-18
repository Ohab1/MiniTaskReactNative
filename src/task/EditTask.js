import React, { useEffect, useState } from "react";
import { View, Text,  TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import {TextInput} from "react-native-paper"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { url } from "../constant";

const EditTask = ({ navigation, route }) => {
  const { task } = route.params; // Get task details from navigation
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [taskStatus, setTaskStatus] = useState(task?.taskStatus || "pending");
  const [jwtToken, setJwtToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Retrieve JWT Token from AsyncStorage
  useEffect(() => {
    const getToken = async () => {
      try {
        const storedData = await AsyncStorage.getItem("userData");
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setJwtToken(parsedData.token);
        }
      } catch (error) {
        console.error("Error fetching token:", error);
      } finally {
        setLoading(false);
      }
    };

    getToken();
  }, []);

  // ✅ Handle Task Update
  const handleUpdateTask = async () => {
    console.log(task);
    
    if (!title.trim()) {
      Alert.alert("Error", "Title is required");
      return;
    }
  
    if (!jwtToken) {
      Alert.alert("Error", "Authentication failed. Please log in again.");
      navigation.replace("Login");
      return;
    }
  
    try {
      const response = await fetch(`${url}/updatetasks/${task._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({ title, description, taskStatus }),
      });
  
      const contentType = response.headers.get("Content-Type");
  
      if (response.ok) {
        // If the response is JSON
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          Alert.alert("Success", "Task updated successfully");
          navigation.navigate("TaskList");
        } else {
          Alert.alert("Error", "Unexpected response format");
        }
      } else {
        const errorData = await response.json();
        Alert.alert("Error", errorData.message || "Task update failed");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Server not reachable");
    }
  };
  

  // ✅ Show Loading Spinner
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ea" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Task</Text>

      {/* Title Input */}
      <TextInput mode="outlined" label="Task Title" value={title} onChangeText={setTitle} style={styles.input} />

      {/* Description Input */}
      <TextInput mode="outlined" label="Task Description" value={description} onChangeText={setDescription} style={styles.input} multiline />

      {/* Status Selection */}
      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Status:</Text>
        {["Pending", "Completed", "inProgress"].map((s) => (
          <TouchableOpacity key={s} onPress={() => setTaskStatus(s)} style={[styles.statusButton, taskStatus === s && styles.selectedStatus]}>
            <Text style={[styles.statusText, taskStatus === s && styles.selectedText]}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Update Button */}
      <TouchableOpacity onPress={handleUpdateTask} style={styles.button}>
        <Text style={styles.buttonText}>Update Task</Text>
      </TouchableOpacity>
    </View>
  );
};

// ✅ Styles
const styles = StyleSheet.create({
  container: {margin:20},
  title: { fontSize: 22, fontWeight: "bold", color: "#6200ea", marginBottom: 20 },
  input: {marginBottom:10},
  button: { backgroundColor: "#6200ea", paddingVertical: 12, paddingHorizontal: 30, borderRadius: 8, marginTop: 10 },
  buttonText: { color: "white", fontSize: 16, fontWeight: "600",textAlign:"center" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f5f5f5" },
  statusContainer: { flexDirection: "row", justifyContent: "space-around", width: "100%", marginVertical: 10 },
  statusLabel: { fontSize: 16, fontWeight: "bold", color: "#6200ea", marginBottom: 5 },
  statusButton: { padding: 10, borderRadius: 8, borderWidth: 1, borderColor: "#ccc", marginHorizontal: 5 },
  selectedStatus: { backgroundColor: "#6200ea" },
  statusText: { fontSize: 14 },
  selectedText: { color: "white", fontWeight: "bold" },
});

export default EditTask;
