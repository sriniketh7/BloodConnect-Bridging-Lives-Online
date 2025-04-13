// import React, { useState } from "react";
// import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
// import api from "../api/api.js";

// const HospitalDetails = ({ route, navigation }) => {
//   const { token, user } = route.params;
//   const [hospitalName, setHospitalName] = useState("");
//   const [hospitalAddress, setHospitalAddress] = useState("");

//   const handleSubmit = async () => {
//     if (!hospitalName || !hospitalAddress) {
//       Alert.alert("Error", "Please fill out all fields.");
//       return;
//     }

//     try {
//       const response = await api.post(
//         "/recipient/hospital",
//         { hospitalName, hospitalAddress },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (response.status === 201) {
//         Alert.alert("Success", "Hospital details saved successfully!");
//         navigation.navigate("Recipient", { token, user });
//       } else {
//         Alert.alert("Error", response.data.message || "Submission failed.");
//       }
//     } catch (error) {
//       console.error("Error submitting hospital details:", error);
//       const errorMessage =
//         error.response?.data?.message || "An error occurred. Please try again.";
//       Alert.alert("Error", errorMessage);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Hospital Details</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Hospital Name"
//         value={hospitalName}
//         onChangeText={setHospitalName}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Hospital Address"
//         value={hospitalAddress}
//         onChangeText={setHospitalAddress}
//       />
//       <Button title="Submit" onPress={handleSubmit} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//     backgroundColor: "#f8f9fa",
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 20,
//   },
//   input: {
//     width: "100%",
//     padding: 10,
//     marginBottom: 15,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 5,
//   },
// });

// export default HospitalDetails;

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Alert,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import api from "../api/api.js";

const HospitalDetails = ({ route, navigation }) => {
  const { token, user } = route.params;
  const [hospitalName, setHospitalName] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [open, setOpen] = useState(false); // Controls dropdown visibility

  useEffect(() => {
    // Fetch hospitals when component mounts
    const fetchHospitals = async () => {
      try {
        const response = await api.get("/hospital/get-hospitals", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          const hospitalList = response.data.map((hospital) => ({
            label: hospital.hospitalName,
            value: hospital.hospitalName,
          }));
          setHospitals(hospitalList);
        }
      } catch (error) {
        console.error("Error fetching hospitals:", error);
        Alert.alert("Error", "Failed to load hospitals.");
      }
    };

    fetchHospitals();
  }, []);

  const handleSubmit = async () => {
    if (!hospitalName) {
      Alert.alert("Error", "Please select a hospital.");
      return;
    }

    try {
      const response = await api.post(
        "/recipient/hospital",
        { hospitalName },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        Alert.alert("Success", "Hospital details saved successfully!");
        navigation.navigate("Recipient", { token, user });
      } else {
        Alert.alert("Error", response.data.message || "Submission failed.");
      }
    } catch (error) {
      console.error("Error submitting hospital details:", error);
      const errorMessage =
        error.response?.data?.message || "An error occurred. Please try again.";
      Alert.alert("Error", errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      {/* ✅ Background Image Header */}
      <ImageBackground
        source={{
          uri: "https://cdn.usegalileo.ai/sdxl10/bc28fea5-2b13-4583-979f-f6ff16126f62.png",
        }}
        style={styles.headerImage}
      >
        <Text style={styles.headerText}>Select Hospital</Text>
      </ImageBackground>

      {/* ✅ Hospital Dropdown */}
      <DropDownPicker
        open={open}
        value={hospitalName}
        items={hospitals}
        setOpen={setOpen}
        setValue={setHospitalName}
        setItems={setHospitals}
        placeholder="Select a hospital"
        containerStyle={styles.dropdownContainer}
        style={styles.dropdown}
        dropDownStyle={styles.dropdown}
      />

      {/* ✅ Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fbf8f8",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  headerImage: {
    width: "110%",
    height: 200,
    justifyContent: "flex-end",
    padding: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  dropdownContainer: {
    width: "100%",
    marginTop: 15,
  },
  dropdown: {
    backgroundColor: "#f3e8e8",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
  },
  submitButton: {
    backgroundColor: "#e31c1c",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 20,
  },
  submitText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fbf8f8",
  },
});

export default HospitalDetails;
