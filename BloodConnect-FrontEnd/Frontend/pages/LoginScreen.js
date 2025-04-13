// import React, { useState } from "react";
// import { View, TextInput, Button, Alert } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";
// import api from "../api/api.js";

// const LoginScreen = ({ navigation }) => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleLogin = async () => {
//     if (!email || !password) {
//       alert("Please enter both email and password!");
//       return;
//     }

//     try {
//       const response = await api.post("/auth/login", {
//         email,
//         password,
//       });

//       if (response.status === 200) {
//         const { token, user } = response.data;
//         await AsyncStorage.setItem("token", token);
//         await AsyncStorage.setItem("user", JSON.stringify(user));
//         setEmail("");
//         setPassword("");
//         // Store JWT token in AsyncStorage
//         alert("Login successful!");
//         navigation.navigate("RoleSelection", { token, user });
//       } else {
//         alert(response.data.message || "Login failed!");
//       }
//     } catch (error) {
//       console.error("Error logging in:", error);
//       const errorMessage =
//         error.response?.data?.message || "An error occurred. Please try again.";
//       alert(errorMessage);
//     }
//   };

//   return (
//     <View style={{ padding: 20 }}>
//       <TextInput
//         style={{
//           height: 40,
//           borderColor: "gray",
//           borderWidth: 1,
//           marginBottom: 20,
//         }}
//         placeholder="Email"
//         value={email}
//         onChangeText={setEmail}
//       />
//       <TextInput
//         style={{
//           height: 40,
//           borderColor: "gray",
//           borderWidth: 1,
//           marginBottom: 20,
//         }}
//         placeholder="Password"
//         secureTextEntry
//         value={password}
//         onChangeText={setPassword}
//       />
//       <Button title="Login" onPress={handleLogin} />
//     </View>
//   );
// };

// export default LoginScreen;
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Alert,
  StyleSheet,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import api from "../api/api.js";
import Svg, { Path } from "react-native-svg";

const { height } = Dimensions.get("window"); // Get screen height for image scaling

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password!");
      return;
    }

    try {
      const response = await api.post("/auth/login", { email, password });

      if (response.status === 200) {
        const { token, user } = response.data;
        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("user", JSON.stringify(user));
        setEmail("");
        setPassword("");
        Alert.alert("Success", "Login successful!");
        navigation.navigate("RoleSelection", { token, user });
      } else {
        Alert.alert("Error", response.data.message || "Login failed!");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      const errorMessage =
        error.response?.data?.message || "An error occurred. Please try again.";
      Alert.alert("Error", errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Svg width={24} height={24} viewBox="0 0 256 256" fill="currentColor">
            <Path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z" />
          </Svg>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Blood Connect</Text>
      </View>

      {/* Background Image (1/4 screen height) */}
      <ImageBackground
        source={{
          uri: "https://cdn.usegalileo.ai/sdxl10/179cbdf3-542d-4336-b02e-c103dffd0a0b.png",
        }}
        style={styles.imageBackground}
      >
        <View style={styles.overlay}>
          <Text style={styles.imageText}>Blood Connect</Text>
        </View>
      </ImageBackground>

      {/* Login Form */}
      <Text style={styles.loginTitle}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#964f4f"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholderTextColor="#964f4f"
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleLogin}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>

      <Text
        style={styles.signupText}
        onPress={() => navigation.navigate("Registration")}
      >
        Not registered? Sign Up »
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fbf8f8",
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 16,
  },
  backButton: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1b0e0e",
    textAlign: "center",
    flex: 1,
  },
  imageBackground: {
    height: height / 4, // 1/4 of screen height
    borderRadius: 10,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    padding: 16,
  },
  imageText: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
  },
  loginTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1b0e0e",
    textAlign: "center",
    paddingTop: 20,
    paddingBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e6d0d0",
    backgroundColor: "#fbf8f8",
    color: "#1b0e0e",
    height: 56,
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: "#e31c1c",
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  signupText: {
    color: "#964f4f",
    textAlign: "center",
    marginTop: 10,
    textDecorationLine: "underline",
    fontSize: 14,
  },
});

export default LoginScreen;
