// import React, { useState } from "react";
// import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
// import api from "../api/api.js";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const HospitalAdminRegister = ({ navigation }) => {
//   const [hospitalName, setHospitalName] = useState("");
//   //const [hospitalAddress, setHospitalAddress] = useState("");
//   const [registrationNumber, setRegistrationNumber] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleRegister = async () => {
//     if (!hospitalName || !registrationNumber || !email || !password) {
//       Alert.alert("Error", "All fields are required.");
//       return;
//     }

//     try {
//       const response = await api.post("/hospital/register", {
//         hospitalName,
//         registrationNumber,
//         email,
//         password,
//       });

//       if (response.status == 201) {
//         setHospitalName("");
//         setRegistrationNumber("");
//         setEmail("");
//         setPassword("");
//         Alert.alert("Success", "Registered successfully");
//         navigation.navigate("HospitalLogin");
//       } else {
//         Alert.alert("Error", response.data.message || "Registration failed.");
//       }
//     } catch (error) {
//       console.log(error);
//       Alert.alert(
//         "Error",
//         error.response?.data?.message || "Something went wrong"
//       );
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Hospital Registration</Text>

//       <Text style={styles.label}>Hospital Name:</Text>
//       <TextInput
//         style={styles.input}
//         value={hospitalName}
//         onChangeText={setHospitalName}
//       />
//       <Text style={styles.label}>Registration Number:</Text>
//       <TextInput
//         style={styles.input}
//         value={registrationNumber}
//         onChangeText={setRegistrationNumber}
//       />

//       <Text style={styles.label}>Email:</Text>
//       <TextInput style={styles.input} value={email} onChangeText={setEmail} />

//       <Text style={styles.label}>Password:</Text>
//       <TextInput
//         style={styles.input}
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//       />

//       <Button title="Register" onPress={handleRegister} color="#007BFF" />
//       <Text
//         style={styles.switchText}
//         onPress={() => navigation.navigate("HospitalAdminLogin")}
//       >
//         Already have an account? Login
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

// export default HospitalAdminRegister;

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import api from "../api/api.js";

const HospitalAdminRegister = ({ navigation }) => {
  const [hospitalName, setHospitalName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!hospitalName || !registrationNumber || !email || !password) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    try {
      const response = await api.post("/hospital/register", {
        hospitalName,
        registrationNumber,
        email,
        password,
      });

      if (response.status == 201) {
        setHospitalName("");
        setRegistrationNumber("");
        setEmail("");
        setPassword("");
        Alert.alert("Success", "Registered successfully");
        navigation.navigate("HospitalLogin");
      } else {
        Alert.alert("Error", response.data.message || "Registration failed.");
      }
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign up for a new account</Text>

      <Text style={styles.label}>Hospital Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Hospital name"
        placeholderTextColor="#886363"
        value={hospitalName}
        onChangeText={setHospitalName}
      />

      <Text style={styles.label}>Registration Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Registration number"
        placeholderTextColor="#886363"
        value={registrationNumber}
        onChangeText={setRegistrationNumber}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Email address"
        placeholderTextColor="#886363"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#886363"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#181111",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#181111",
    marginBottom: 5,
  },
  input: {
    height: 56,
    backgroundColor: "#f4f0f0",
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#181111",
    marginBottom: 15,
  },
  button: {
    height: 50,
    backgroundColor: "#e63333",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default HospitalAdminRegister;
