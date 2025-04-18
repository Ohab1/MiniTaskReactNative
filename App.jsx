import React, { useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from './src/auth/Login';
import Signup from './src/auth/Signup';
import Home from './src/home/Home';
import CreateTask from './src/task/CreateTask';
import TaskList from './src/task/TaskList';
import EditTask from './src/task/EditTask';

const Stack = createNativeStackNavigator();

const App = () => {

  useEffect(() => {
    const requestPermissions = async () => {
      try {
        if (Platform.OS === 'android') {
          const permissions = [];

          if (Platform.Version >= 33) {
            // Android 13+
            permissions.push(PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES);
          } else {
            // Older versions
            permissions.push(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
          }

          permissions.push(PermissionsAndroid.PERMISSIONS.CAMERA);

          const granted = await PermissionsAndroid.requestMultiple(permissions);

          console.log("Permission results:", granted);
        }
      } catch (err) {
        console.warn("Permission error:", err);
      }
    };

    requestPermissions();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
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
