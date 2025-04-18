import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, Alert, ActivityIndicator } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './authStyles';
import { url } from '../constant';

const Signup = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
 const [loading, setLoading] = useState(false);
  const handleSignup = () => {
   
    
    if (!email || !password) return Alert.alert("Enter email and password");
    if (email.length < 5 || password.length < 4) return Alert.alert("Email must be at least 5 characters & password at least 4 characters");
    if (!email.includes("@") || !email.includes(".")) return Alert.alert("Invalid email");
    if (password !== confirm) {
      alert("Passwords do not match!");
      return;
    }
    setLoading(true)
    fetch(`${url}/signup`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((response) => {
        setLoading(false); 
        console.log(response);
          Alert.alert("Signup successful!");
          navigation.navigate("Login")
      })
      .catch((err) => {
        setLoading(false); 
        console.error(err);
        Alert.alert("Something went wrong. Please try again.");
      });
    
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/profile.png')} style={styles.image} />
      <Text style={styles.title}>Create Account</Text>

      {/* Email Input with icon */}
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={styles.input}
        keyboardType="email-address"
        left={<TextInput.Icon icon={() => <Icon name="email-outline" size={20} color="#666" />} />}
      />

      {/* Password Input with show/hide icon */}
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        secureTextEntry={!showPassword}
        style={styles.input}
        left={<TextInput.Icon icon={() => <Icon name="lock-outline" size={20} color="#666" />} />}
        right={
          <TextInput.Icon
            icon={showPassword ? "eye-off-outline" : "eye-outline"}
            onPress={() => setShowPassword(!showPassword)}
            color="#666"
          />
        }
      />

      {/* Confirm Password Input with show/hide icon */}
      <TextInput
        label="Confirm Password"
        value={confirm}
        onChangeText={setConfirm}
        mode="outlined"
        secureTextEntry={!showConfirm}
        style={styles.input}
        left={<TextInput.Icon icon={() => <Icon name="lock-outline" size={20} color="#666" />} />}
        right={
          <TextInput.Icon
            icon={showConfirm ? "eye-off-outline" : "eye-outline"}
            onPress={() => setShowConfirm(!showConfirm)}
            color="#666"
          />
        }
      />

{
                loading ? (
                    <View style={{
                        marginTop: 20,
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingVertical: 20,
                        borderRadius: 10
                    }}>
                        <ActivityIndicator size="large" color="purple" />
                        <Text style={{ marginTop: 10, color: 'gray', fontSize: 16 }}>Signing in... Please wait</Text>
                    </View>
                ) : (
                    <TouchableOpacity onPress={handleSignup} style={styles.btn}>
                        <Text style={styles.btnText}>Signup</Text>
                    </TouchableOpacity>
                )
            }

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginText}>
          Already have an account? <Text style={{ color: "purple", fontWeight: "bold" }}>Login</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Signup;




