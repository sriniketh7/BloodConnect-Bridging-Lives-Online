// import React, { useState } from "react";
// import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
// import api from "../api/api.js";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const HospitalAdminLogin = ({ navigation }) => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleLogin = async () => {
//     try {
//       const response = await api.post("/hospital/login", { email, password });

//       if (response.status == 200) {
//         const { token, user } = response.data;
//         console.log(token);
//         console.log(user);
//         await AsyncStorage.setItem("token", token);
//         await AsyncStorage.setItem("user", JSON.stringify(user));
//         setEmail("");
//         setPassword("");
//         Alert.alert("Success", "Logged in successfully");
//         navigation.navigate("HospitalDashBoard", { token, user });
//       } else {
//         Alert.alert("Error", response.data.message || "Login failed!");
//       }
//     } catch (error) {
//       Alert.alert(
//         "Error",
//         error.response?.data?.message || "Something went wrong"
//       );
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Hospital Admin Login</Text>

//       <Text style={styles.label}>Email:</Text>
//       <TextInput style={styles.input} value={email} onChangeText={setEmail} />

//       <Text style={styles.label}>Password:</Text>
//       <TextInput
//         style={styles.input}
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//       />

//       <Button title="Login" onPress={handleLogin} color="#007BFF" />
//       <Text
//         style={styles.switchText}
//         onPress={() => navigation.navigate("HospitalAdminRegister")}
//       >
//         Don't have an account? Register
//       </Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: "#f8f9fa",
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginBottom: 20,
//     color: "#333",
//   },
//   label: {
//     fontSize: 16,
//     marginBottom: 5,
//     color: "#555",
//   },
//   input: {
//     height: 40,
//     borderColor: "#ccc",
//     borderWidth: 1,
//     borderRadius: 5,
//     paddingHorizontal: 10,
//     marginBottom: 15,
//     backgroundColor: "#fff",
//   },
//   switchText: {
//     textAlign: "center",
//     marginTop: 15,
//     color: "#007BFF",
//     fontSize: 16,
//   },
// });

// export default HospitalAdminLogin;

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Alert,
} from "react-native";
import api from "../api/api.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HospitalAdminLogin = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await api.post("/hospital/login", { email, password });

      if (response.status == 200) {
        const { token, user } = response.data;
        console.log(token);
        console.log(user);
        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("user", JSON.stringify(user));
        setEmail("");
        setPassword("");
        Alert.alert("Success", "Logged in successfully");
        navigation.navigate("HospitalDashBoard", { token, user });
      } else {
        Alert.alert("Error", response.data.message || "Login failed!");
      }
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* <View style={styles.closeButtonContainer}> */}
      {/* <TouchableOpacity style={styles.closeButton}>
        <Text style={styles.closeButtonText}>X</Text>
      </TouchableOpacity> */}
      {/* </View> */}
      <ImageBackground
        source={{
          uri: "https://cdn.usegalileo.ai/sdxl10/9f152ec1-4fda-420f-ba56-1b4da38bef6f.png",
        }}
        style={styles.imageBackground}
      >
        <Text style={styles.headerText}>Hospital Admin Login</Text>
      </ImageBackground>
      <View style={styles.minimalSpacing} />
      <Text style={styles.title}>Hospital Admin Login</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          placeholderTextColor="#955050"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Password"
          placeholderTextColor="#955050"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <Text style={styles.forgotPassword}>Forgot password?</Text>
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Log in</Text>
      </TouchableOpacity>
      <Text
        style={styles.switchText}
        onPress={() => navigation.navigate("HospitalReg")}
      >
        Don't have an account? Register
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
  closeButtonContainer: {
    alignItems: "flex-end",
    padding: 16,
  },
  closeButton: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 24,
    color: "#1b0e0e",
  },
  imageBackground: {
    height: 400,
    justifyContent: "flex-end",
    padding: 16,
  },
  minimalSpacing: {
    height: 4,
  },
  headerText: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1b0e0e",
    paddingVertical: 4,
  },
  inputContainer: {
    marginVertical: 8,
  },
  input: {
    height: 56,
    backgroundColor: "#f3e8e8",
    borderRadius: 16,
    paddingHorizontal: 16,
    color: "#1b0e0e",
  },
  forgotPassword: {
    color: "#955050",
    fontSize: 14,
    textAlign: "left",
    marginTop: 4,
  },
  loginButton: {
    height: 48,
    backgroundColor: "#df2020",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
    marginTop: 16,
  },
  loginButtonText: {
    color: "#fbf8f8",
    fontSize: 16,
    fontWeight: "bold",
  },
  switchText: {
    textAlign: "center",
    marginTop: 15,
    color: "#007BFF",
    fontSize: 16,
  },
});

export default HospitalAdminLogin;
