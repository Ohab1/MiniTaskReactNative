import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { TextInput } from 'react-native-paper';
import axios from 'axios';
import styles from './authStyles';
import { url } from '../constant';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false); // 👈 Loader state

    const handleLogin = async () => {
        if (!email || !password) return Alert.alert("Enter email and password");
        if (email.length < 5 || password.length < 4) return Alert.alert("Email must be at least 5 characters & password at least 4 characters");
        if (!email.includes("@") || !email.includes(".")) return Alert.alert("Invalid email");

        console.log("Login button clicked");

        try {
            setLoading(true); // 👈 Start loading

            const res = await axios.post(`${url}/login`, { email, password });

            console.log("Axios success:", res.data);

            if (res.data?.token && res.data?.user) {
                await AsyncStorage.setItem('userData', JSON.stringify({
                    token: res.data.token,
                    user: res.data.user
                }));

                navigation.navigate("Home");
                setEmail("");
                setPassword("");
            } else {
                Alert.alert("Login Failed", "Invalid email or password.");
            }

        } catch (err) {
            console.log("Axios error:", err?.message);
            console.log("Full error:", err?.response?.data || err);
            Alert.alert("Error", "Could not connect to server. Please try again.");
        } finally {
            setLoading(false); // 👈 Stop loading
        }
    };

    return (
        <View style={styles.container}>
            <Image source={require("../assets/profile.png")} style={styles.logo} />
            <Text style={styles.title}>Welcome To MiniTask</Text>

            <TextInput
                style={styles.input}
                label="Enter your email"
                mode="outlined"
                value={email}
                onChangeText={setEmail}
                left={<TextInput.Icon icon="email-outline" color="#666" />}
            />

            <TextInput
                style={styles.input}
                label="Enter your password"
                mode="outlined"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                left={<TextInput.Icon icon="lock-outline" color="#666" />}
                right={
                    <TextInput.Icon
                        icon={showPassword ? "eye-off-outline" : "eye-outline"}
                        onPress={() => setShowPassword(!showPassword)}
                        color="#666"
                    />
                }
            />

            {/* Loader or Button */}
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
                        <Text style={{ marginTop: 10, color: 'gray', fontSize: 16 }}>Logging in... Please wait</Text>
                    </View>
                ) : (
                    <TouchableOpacity onPress={handleLogin} style={styles.btn}>
                        <Text style={styles.btnText}>Login</Text>
                    </TouchableOpacity>
                )
            }

            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                <Text style={styles.signupText}>
                    Don't have an account? <Text style={{ color: "purple", fontWeight: "bold" }}>Sign up here</Text>
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default Login;
