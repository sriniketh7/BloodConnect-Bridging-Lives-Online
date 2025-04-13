// import React from "react";
// import { View, Text, Button, StyleSheet, Alert } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";
// import api from "../api/api.js";

// const RoleSelection = ({ route, navigation }) => {
//   const { token, user } = route.params;
//   const handleRoleSelection = async (role) => {
//     try {
//       const token = await AsyncStorage.getItem("token"); // Assuming token-based authentication
//       if (!token) {
//         alert("Error", "Please log in to continue.");
//         return;
//       }

//       const response = await api.put(
//         "/auth/setrole",
//         { role }, // Send the selected role to the server
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`, // Pass the token for authentication
//           },
//         }
//       );

//       if (response.status === 200) {
//         //console.log(role);
//         const { isFirstVisit } = response.data.user;

//         if (role === "Recipient" && isFirstVisit) {
//           navigation.navigate("HospitalDetails", { token, user }); // Navigate to Hospital Details Form
//         } else {
//           navigation.navigate(role, { token, user }); // Navigate to Dashboard directly
//         }
//       } else {
//         Alert.alert("Error", response.data.message || "Failed to update role.");
//       }
//     } catch (error) {
//       console.error("Error updating role:", error);
//       const errorMessage =
//         error.response?.data?.message || "An error occurred. Please try again.";
//       Alert.alert("Error", errorMessage);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Choose Your Role</Text>
//       <Button title="Donor" onPress={() => handleRoleSelection("Donor")} />
//       <Button
//         title="Recipient"
//         onPress={() => handleRoleSelection("Recipient")}
//         style={styles.buttonSpacing}
//       />
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
//     color: "#333",
//     marginBottom: 20,
//   },
//   buttonSpacing: {
//     marginTop: 20,
//   },
// });

// export default RoleSelection;
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import api from "../api/api.js";
import Svg, { Path } from "react-native-svg";

const { height } = Dimensions.get("window"); // Get screen height for layout adjustments

const RoleSelection = ({ route, navigation }) => {
  const { token, user } = route.params;

  const handleRoleSelection = async (role) => {
    try {
      const token = await AsyncStorage.getItem("token"); // Retrieve token
      if (!token) {
        Alert.alert("Error", "Please log in to continue.");
        return;
      }

      const response = await api.put(
        "/auth/setrole",
        { role }, // Send selected role
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Authentication header
          },
        }
      );

      if (response.status === 200) {
        const { isFirstVisit } = response.data.user;
        if (role === "Recipient" && isFirstVisit) {
          navigation.navigate("HospitalDetails", { token, user }); // Navigate to Hospital Details Form
        } else {
          navigation.navigate(role, { token, user }); // Navigate to respective Dashboard
        }
      } else {
        Alert.alert("Error", response.data.message || "Failed to update role.");
      }
    } catch (error) {
      console.error("Error updating role:", error);
      const errorMessage =
        error.response?.data?.message || "An error occurred. Please try again.";
      Alert.alert("Error", errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with Close Button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Svg width={24} height={24} viewBox="0 0 256 256" fill="currentColor">
            <Path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
          </Svg>
        </TouchableOpacity>
      </View>

      {/* Role Selection Title */}
      <Text style={styles.title}>Choose Your Role</Text>
      <Text style={styles.subtitle}>
        Are you looking to donate blood or are you in need of blood?
      </Text>

      {/* Role Selection Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.donorButton}
          onPress={() => handleRoleSelection("Donor")}
        >
          <Text style={styles.buttonText}>Donor</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.recipientButton}
          onPress={() => handleRoleSelection("Recipient")}
        >
          <Text style={styles.recipientText}>Recipient</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fbf8f8",
    paddingHorizontal: 16,
    justifyContent: "initial",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 100,
  },
  closeButton: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1b0e0e",
    textAlign: "center",
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#1b0e0e",
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    alignItems: "center",
  },
  donorButton: {
    backgroundColor: "#e31c1c",
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginBottom: 12,
  },
  buttonText: {
    color: "#fbf8f8",
    fontWeight: "bold",
    fontSize: 14,
  },
  recipientButton: {
    backgroundColor: "#f3e8e8",
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  recipientText: {
    color: "#1b0e0e",
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default RoleSelection;
