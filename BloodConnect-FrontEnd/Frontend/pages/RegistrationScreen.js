import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
  ScrollView, // Import ScrollView
} from "react-native";
import axios from "axios";
import api from "../api/api.js"; // Assuming api.js exports an Axios instance

const Registration = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [MobileNumber, setMobileNumber] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = async () => {
    if (
      !name ||
      !email ||
      !password ||
      !bloodGroup ||
      !MobileNumber ||
      !address
    ) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
        bloodGroup,
        MobileNumber,
        location: address, // Only send the address
      });

      if (response.status === 201) {
        setName("");
        setEmail("");
        setPassword("");
        setBloodGroup("");
        setMobileNumber("");
        setAddress("");
        Alert.alert("Success", "Registration successful!");
        navigation.navigate("Login");
      } else {
        Alert.alert("Error", response.data.message || "Registration failed.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred. Please try again.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Wrap everything in a ScrollView */}
      <View style={styles.container}>
        <View style={styles.header} />

        <ImageBackground
          source={{
            uri: "https://cdn.usegalileo.ai/sdxl10/b73f9c7b-2b10-45cc-a26d-b6bbf6d5b74d.png",
          }}
          style={styles.imageBackground}
        >
          {/* Content can be added here if needed, but we'll leave it empty for now */}
        </ImageBackground>

        <Text style={styles.title}>Sign up to donate blood</Text>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="#955050"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#955050"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#955050"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Text style={styles.label}>Blood group</Text>
          <TextInput
            style={styles.input}
            placeholder="Blood group"
            placeholderTextColor="#955050"
            value={bloodGroup}
            onChangeText={setBloodGroup}
          />

          <Text style={styles.label}>Mobile Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Mobile Number"
            placeholderTextColor="#955050"
            value={MobileNumber}
            onChangeText={setMobileNumber}
          />

          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            placeholder="Location"
            placeholderTextColor="#955050"
            value={address}
            onChangeText={setAddress}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <View style={styles.footer} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    // Style for ScrollView's content
    flexGrow: 1, // Allows content to expand and scroll
    justifyContent: "center", // Keep content centered when not scrolling
  },
  container: {
    backgroundColor: "#fbf8f8",
    fontFamily: "Manrope, Noto Sans, sans-serif",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fbf8f8",
    padding: 16,
    paddingBottom: 8,
  },
  imageBackground: {
    width: "100%",
    height: 320,
    justifyContent: "flex-end",
    overflow: "hidden",
    borderRadius: 12,
  },
  title: {
    color: "#1b0e0e",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    paddingTop: 20,
    paddingBottom: 12,
  },
  formContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  label: {
    color: "#1b0e0e",
    fontSize: 16,
    fontWeight: "500",
    paddingBottom: 8,
  },
  input: {
    width: "100%",
    height: 56,
    borderWidth: 1,
    borderColor: "#e6d1d1",
    backgroundColor: "#fbf8f8",
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#1b0e0e",
  },
  button: {
    backgroundColor: "#df2020",
    borderRadius: 24,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 12,
  },
  buttonText: {
    color: "#fbf8f8",
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    height: 20,
    backgroundColor: "#fbf8f8",
  },
});

export default Registration;
