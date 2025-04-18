import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { TextInput } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DropDownPicker from "react-native-dropdown-picker";
import * as ImagePicker from "react-native-image-picker";
import { url } from "../constant";

const CreateTask = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [jwtToken, setJwtToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [openState, setOpenState] = useState(false);
  const [openDistrict, setOpenDistrict] = useState(false);
  const [openCity, setOpenCity] = useState(false);
  const [image, setImage] = useState(null);

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
      const fetchStates = async () => {
        try {
          const response = await fetch(`${url}/states`, {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
              "Content-Type": "application/json",
            },
          });
          const data = await response.json();
          if (response.ok) {
            setStates(data.map((state) => ({ label: state.name, value: state._id })));
          } else {
            Alert.alert("Error", "Failed to load states");
          }
        } catch (error) {
          console.error("Error fetching states:", error);
        }
      };
      fetchStates();
    }
  }, [jwtToken]);

  useEffect(() => {
    if (selectedState) {
      const fetchDistricts = async () => {
        try {
          const response = await fetch(`${url}/districts/${selectedState}`, {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
              "Content-Type": "application/json",
            },
          });
          const data = await response.json();
          if (response.ok) {
            setDistricts(data.map((d) => ({ label: d.name, value: d._id })));
            setCities([]);
          } else {
            Alert.alert("Error", "Failed to load districts");
          }
        } catch (error) {
          console.error("Error fetching districts:", error);
        }
      };
      fetchDistricts();
    }
  }, [selectedState, jwtToken]);

  useEffect(() => {
    if (selectedDistrict) {
      const fetchCities = async () => {
        try {
          const response = await fetch(`${url}/cities/${selectedDistrict}`, {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
              "Content-Type": "application/json",
            },
          });
          const data = await response.json();
          if (response.ok) {
            setCities(data.map((c) => ({ label: c.name, value: c._id })));
          } else {
            Alert.alert("Error", "Failed to load cities");
          }
        } catch (error) {
          console.error("Error fetching cities:", error);
        }
      };
      fetchCities();
    }
  }, [selectedDistrict, jwtToken]);

  const handleImagePick = () => {
    ImagePicker.launchCamera({ mediaType: 'photo' }, (response) => {
      if (response.didCancel || response.errorCode) {
        return;
      }
      const asset = response.assets[0];
      setImage(asset);
    });
  };

  // Function to handle image upload
 // ✅ Upload Image API (uses /upload-image)
const handleImageUpload = async (imageUri) => {
  const formData = new FormData();
  formData.append("image", {
    uri: imageUri,
    type: "image/jpeg",
    name: "task_image.jpg",
  });

  try {
    const response = await fetch(`${url}/uploadimage`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.log({ errorData });
      return null;
    }

    const data = await response.json();
   console.log("Image Uploaded successfully",data);
   

    return data.imageUrl || null;
  } catch (error) {
    console.log("Upload error:", error);
    return null;
  }
};


 // ✅ Create Task (JSON only)
const handleCreateTask = async () => {
  if (!title.trim()) {
    Alert.alert("Error", "Title is required");
    return;
  }

  if (!selectedState || !selectedDistrict || !selectedCity) {
    Alert.alert("Error", "Please select state, district, and city");
    return;
  }

  if (!jwtToken) {
    Alert.alert("Error", "Authentication failed. Please log in again.");
    navigation.replace("Login");
    return;
  }

  setLoading(true);

  // 1. Upload Image if available
  let imageUrl = null;
  if (image) {
    imageUrl = await handleImageUpload(image.uri);
    if (!imageUrl) {
      Alert.alert("Error", "Image upload failed");
      setLoading(false);
      return;
    }
  }

  // 2. Prepare task data
  const taskData = {
    title,
    description,
    state: selectedState,
    district: selectedDistrict,
    city: selectedCity,
    imageUrl // image path string
  };

  // 3. Send to backend
  try {
    const response = await fetch(`${url}/createtasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(taskData),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Task created successfully",data);
      
      Alert.alert("Success", "Task created successfully");
      navigation.navigate("TaskList");
      setTitle("");
      setDescription("");
      setSelectedState(null);
      setSelectedDistrict(null);
      setSelectedCity(null);
      setImage(null);
    } else {
      Alert.alert("Error", data.message || "Task creation failed");
    }
  } catch (error) {
    Alert.alert("Error", "Server not reachable");
  } finally {
    setLoading(false);
  }
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
      <Text style={styles.title}>Create New Task</Text>
      <TextInput
        mode="outlined"
        label="Task Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        mode="outlined"
        label="Task Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
        multiline
      />

      {/* Image Preview & Upload */}
      {image && <Image source={{ uri: image.uri }} style={{ height: 50, width: 50, marginBottom: 10, borderRadius: 10 }} />}
      <TouchableOpacity onPress={handleImagePick} style={[styles.button, { backgroundColor: "#03dac5" }]}>
        <Text style={styles.buttonText}>Upload Image</Text>
      </TouchableOpacity>

      {/* Dropdowns */}
      <View style={{ zIndex: openState ? 3000 : 1000 }}>
        <Text style={styles.label}>Select State:</Text>
        <DropDownPicker
          open={openState}
          value={selectedState}
          items={states}
          setOpen={setOpenState}
          setValue={setSelectedState}
          setItems={setStates}
          placeholder="Select a State"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
        />
      </View>

      {selectedState && (
        <View style={{ zIndex: openDistrict ? 2000 : 999 }}>
          <Text style={styles.label}>Select District:</Text>
          <DropDownPicker
            open={openDistrict}
            value={selectedDistrict}
            items={districts}
            setOpen={setOpenDistrict}
            setValue={setSelectedDistrict}
            setItems={setDistricts}
            placeholder="Select a District"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
          />
        </View>
      )}

      {selectedDistrict && (
        <View style={{ zIndex: openCity ? 1000 : 999 }}>
          <Text style={styles.label}>Select City:</Text>
          <DropDownPicker
            open={openCity}
            value={selectedCity}
            items={cities}
            setOpen={setOpenCity}
            setValue={setSelectedCity}
            setItems={setCities}
            placeholder="Select a City"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
          />
        </View>
      )}

      <TouchableOpacity onPress={handleCreateTask} style={styles.button}>
        <Text style={styles.buttonText}>Create Task</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#6200ea",
  },
  input: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#6200ea",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  dropdown: {
    marginBottom: 20,
  },
  dropdownContainer: {
    backgroundColor: "#fafafa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});

export default CreateTask;
