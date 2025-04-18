import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Feather from "react-native-vector-icons/Feather";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { url } from "../constant";

const TaskList = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [jwtToken, setJwtToken] = useState(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    if (jwtToken) {
      fetchTasks();
    }
  }, [jwtToken]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${url}/taskslist`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
      });

      const text = await response.text();
      const data = JSON.parse(text);
      console.log("tasklist", data);

      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      Alert.alert("Error", "Failed to load tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const response = await fetch(`${url}/deletetasks/${taskId}`, {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${jwtToken}`,
                "Content-Type": "application/json",
              },
            });

            if (response.ok) {
              setTasks(tasks.filter((task) => task._id !== taskId));
              Alert.alert("Success", "Task deleted successfully");
            } else {
              Alert.alert("Error", "Failed to delete task");
            }
          } catch (error) {
            console.error("Error deleting task:", error);
            Alert.alert("Error", "Server not reachable");
          }
        },
      },
    ]);
  };

  const handleEditTask = (task) => {
    navigation.navigate("EditTask", { task, jwtToken });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ea" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Tasks</Text>
      {tasks.length === 0 ? (
        <Text style={styles.noTasksText}>No tasks found</Text>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.task}>
              <Text style={styles.taskTitle}>Title: {item.title}</Text>
              <Text>Description: {item.description}</Text>
              <Text>Status: {item.taskStatus}</Text>
              <Text>State: {item?.state?.name || "N/A"}</Text>
              <Text>District: {item?.district?.name || "N/A"}</Text>
              <Text>City: {item?.city?.name || "N/A"}</Text>

              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: `${url}/${item.image}` }}
                  style={styles.taskImage}
                  resizeMode="cover"
                />
              </View>

              <View style={styles.iconContainer}>
                <TouchableOpacity
                  onPress={() => handleEditTask(item)}
                  style={styles.iconButton}
                >
                  <Feather name="edit" size={22} color="#ff9800" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleDeleteTask(item._id)}
                  style={styles.iconButton}
                >
                  <MaterialIcons name="delete" size={24} color="#e53935" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      <TouchableOpacity onPress={fetchTasks} style={styles.button}>
        <Text style={styles.buttonText}>Refresh Tasks</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 20 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#6200ea",
    marginBottom: 10,
  },
  task: {
    backgroundColor: "#ffffff",
    padding: 15,
    marginVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  taskTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },
  imageContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  taskImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },
  iconButton: {
    padding: 10,
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
    marginHorizontal: 5,
  },
  button: {
    backgroundColor: "#6200ea",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
  },
  buttonText: { color: "white", fontSize: 16, fontWeight: "600" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  noTasksText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 20,
  },
});

export default TaskList;
