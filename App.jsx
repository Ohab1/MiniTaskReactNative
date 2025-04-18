import React, { useEffect, useState } from 'react';
import { ActivityIndicator, PermissionsAndroid, Platform, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import  {jwtDecode}  from 'jwt-decode';

import Login from './src/auth/Login';
import Signup from './src/auth/Signup';
import Home from './src/home/Home';
import CreateTask from './src/task/CreateTask';
import TaskList from './src/task/TaskList';
import EditTask from './src/task/EditTask';


const Stack = createNativeStackNavigator();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // To handle loading state during token check

  // Function to check token validity using jwt-decode
  const checkTokenValidity = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');

      
      if (userData) {
        const parsedUserData = JSON.parse(userData);
        const token = parsedUserData.token;
        console.log("token",token);
        
        // Decode the JWT token
        const decodedToken = jwtDecode(token);

        // Check if token is expired
        const isExpired = decodedToken.exp < Date.now() / 1000; // exp is in seconds

        if (isExpired) {
          console.log("Token expired");
          await AsyncStorage.removeItem('userData'); // Remove expired token from AsyncStorage
          setIsAuthenticated(false);
        } else {
          console.log("Token is valid");
          setIsAuthenticated(true); // Set the app as authenticated
        }
        setLoading(false)
      } else {
        setIsAuthenticated(false); // No user data, go to Login
        setLoading(false)
      }
    } catch (err) {
      console.error('Error checking token:', err);
      setLoading(false)
      setIsAuthenticated(false); // In case of error, go to Login
    }
  };

  // Check authentication and token validity when the app loads
  useEffect(() => {
    checkTokenValidity();
  }, []);

  // Request permissions on app launch (Android-specific)
  useEffect(() => {
    const requestPermissions = async () => {
      try {
        if (Platform.OS === 'android') {
          const permissions = [];

          if (Platform.Version >= 33) {
            permissions.push(PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES);
          } else {
            permissions.push(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
          }

          permissions.push(PermissionsAndroid.PERMISSIONS.CAMERA);

          const granted = await PermissionsAndroid.requestMultiple(permissions);
          console.log('Permission results:', granted);
        }
      } catch (err) {
        console.warn('Permission error:', err);
      }
    };

    requestPermissions();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="purple" />
        <Text style={{ marginTop: 10, color: 'gray', fontSize: 16 }}>Checking authentication...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isAuthenticated ? 'Home' : 'Login'}>
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="CreateTask" component={CreateTask} />
        <Stack.Screen name="TaskList" component={TaskList} />
        <Stack.Screen name="EditTask" component={EditTask} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
