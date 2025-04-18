import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const { width } = Dimensions.get("window");

const Home = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedData = await AsyncStorage.getItem("userData");
        if (storedData) {
          setUser(JSON.parse(storedData));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("userData");
    navigation.replace("Login");
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
      {/* Welcome Text */}
      <Text style={styles.welcomeText}>
        Welcome, <Text style={styles.username}>{user?.name || "User"}</Text> 👋
      </Text>
      <Text style={styles.subText}>Manage your tasks with MiniTask</Text>

      {/* Button Card Group */}
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[styles.cardButton, { backgroundColor: "#4CAF50" }]}
          onPress={() => navigation.navigate("CreateTask", user)}
        >
          <Icon name="plus-circle-outline" size={28} color="#fff" />
          <Text style={styles.cardText}>Create Task</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.cardButton, { backgroundColor: "#2196F3" }]}
          onPress={() => navigation.navigate("TaskList", user)}
        >
          <Icon name="clipboard-text-outline" size={28} color="#fff" />
          <Text style={styles.cardText}>Show Tasks</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.cardButton, { backgroundColor: "#E53935" }]}
          onPress={handleLogout}
        >
          <Icon name="logout" size={28} color="#fff" />
          <Text style={styles.cardText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f2ff",
    paddingHorizontal: 20,
    paddingTop: 60,
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f2ff",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 6,
    textAlign: "center",
  },
  subText: {
    fontSize: 16,
    color: "#777",
    marginBottom: 40,
    textAlign: "center",
  },
  username: {
    color: "#6200ea",
  },
  buttonGroup: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
  },
  cardButton: {
    width: "100%",
    paddingVertical: 18,
    borderRadius: 16,
    marginBottom: 25,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  cardText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 16,
  },
});
