// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   Button,
//   Alert,
//   StyleSheet,
//   TouchableOpacity,
// } from "react-native";
// import api from "../api/api";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const ProfileScreen = () => {
//   const [userData, setUserData] = useState(null); // Renamed from 'user'
//   const [editable, setEditable] = useState(false);
//   const [updatedUserData, setUpdatedUserData] = useState({}); // Renamed from 'updatedUser'
//   const [newHospitalId, setNewHospitalId] = useState("");

//   useEffect(() => {
//     fetchUserProfile();
//   }, []);

//   // Fetch User Profile
//   const fetchUserProfile = async () => {
//     try {
//       const token = await AsyncStorage.getItem("token");
//       const user = await AsyncStorage.getItem("user");
//       //console.log(user);
//       const response = await api.get("/user/profile", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       //console.log(response.data);
//       setUserData(response.data);
//       setUpdatedUserData(response.data);
//       //console.log(userData);
//     } catch (error) {
//       Alert.alert("Error", "Failed to load profile");
//     }
//   };

//   // Update User Profile
//   const handleUpdate = async () => {
//     try {
//       const token = await AsyncStorage.getItem("token");

//       const updatedData = {
//         name: updatedUserData.name,
//         MobileNumber: updatedUserData.mobile,
//         location: updatedUserData.location,
//       };

//       await api.put("/user/update", updatedData, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       Alert.alert("Success", "Profile updated successfully");
//       setEditable(false);
//       fetchUserProfile(); // Refresh user data after update
//     } catch (error) {
//       Alert.alert("Error", "Failed to update profile");
//     }
//   };

//   // Change Hospital (Only for Recipients)
//   const handleChangeHospital = async () => {
//     if (!newHospitalId) {
//       Alert.alert("Error", "Please enter a valid hospital ID");
//       return;
//     }

//     try {
//       const token = await AsyncStorage.getItem("token");
//       await api.put(
//         "/user/change-hospital",
//         { newHospitalId },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       Alert.alert("Success", "Hospital changed successfully");
//       fetchUserProfile();
//     } catch (error) {
//       Alert.alert("Error", "Failed to change hospital");
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {userData && (
//         <>
//           <Text style={styles.header}>Profile</Text>

//           <TextInput
//             style={styles.input}
//             value={updatedUserData.name}
//             editable={editable}
//             onChangeText={(text) =>
//               setUpdatedUserData({ ...updatedUserData, name: text })
//             }
//           />
//           <TextInput
//             style={styles.input}
//             value={updatedUserData.email}
//             editable={false}
//           />
//           <TextInput
//             style={styles.input}
//             value={updatedUserData.MobileNumber}
//             editable={editable}
//             onChangeText={(text) =>
//               setUpdatedUserData({ ...updatedUserData, MobileNumber: text })
//             }
//           />
//           <TextInput
//             style={styles.input}
//             value={updatedUserData.bloodGroup}
//             editable={false}
//           />
//           <TextInput
//             style={styles.input}
//             value={updatedUserData.address}
//             editable={editable}
//             onChangeText={(text) =>
//               setUpdatedUserData({ ...updatedUserData, address: text })
//             }
//           />

//           {/* Donor Specific Details */}
//           {userData.role === "Donor" && (
//             <View style={styles.infoContainer}>
//               <Text style={styles.infoText}>
//                 Number of Donations: {userData.donationsCount}
//               </Text>
//               <Text style={styles.infoText}>
//                 Last Donation Date: {userData.lastDonationDate || "N/A"}
//               </Text>
//             </View>
//           )}

//           {/* Recipient-Specific Change Hospital Option */}
//           {userData.role === "Recipient" && (
//             <View>
//               <Button title="Change Hospital" onPress={handleChangeHospital} />
//             </View>
//           )}

//           {/* Edit & Save Button */}
//           <TouchableOpacity
//             style={styles.button}
//             onPress={() => (editable ? handleUpdate() : setEditable(true))}
//           >
//             <Text style={styles.buttonText}>
//               {editable ? "Save Changes" : "Edit Profile"}
//             </Text>
//           </TouchableOpacity>
//         </>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20 },
//   header: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     padding: 10,
//     marginBottom: 10,
//     borderRadius: 5,
//   },
//   infoContainer: {
//     marginVertical: 10,
//     padding: 10,
//     backgroundColor: "#f0f0f0",
//     borderRadius: 5,
//   },
//   infoText: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
//   button: {
//     backgroundColor: "#007bff",
//     padding: 10,
//     borderRadius: 5,
//     alignItems: "center",
//     marginTop: 10,
//   },
//   buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
// });

// export default ProfileScreen;

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import api from "../api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfileScreen = () => {
  const [userData, setUserData] = useState(null);
  const [editable, setEditable] = useState(false);
  const [updatedUserData, setUpdatedUserData] = useState({});
  const [hospitalList, setHospitalList] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState("");
  const [hospitalName, setHospitalName] = useState(null);
  const [open, setOpen] = useState(false); // Controls dropdown visibility

  useEffect(() => {
    // Fetch user profile and hospitals on component mount
    const fetchUserProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        // Retrieve token
        if (!token) {
          Alert.alert("Error", "Please log in to continue.");
          return;
        }
        const response = await api.get("/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);
        setUpdatedUserData(response.data);
        setSelectedHospital(response.data.hospital || "");
      } catch (error) {
        Alert.alert("Error", "Failed to load profile");
      }
    };

    const fetchHospitals = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await api.get("/hospital/get-hospitals", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          const hospitalList = response.data.map((hospital) => ({
            label: hospital.hospitalName,
            value: hospital.hospitalName,
          }));
          setHospitalList(hospitalList);
        }
      } catch (error) {
        console.error("Error fetching hospitals:", error);
        Alert.alert("Error", "Failed to load hospitals.");
      }
    };

    fetchUserProfile(); // Fetch user profile
    fetchHospitals(); // Fetch hospitals
  }, []);

  // Update User Profile
  const handleUpdate = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const updatedData = {
        name: updatedUserData.name,
        MobileNumber: updatedUserData.MobileNumber,
        location: updatedUserData.location,
        hospital: hospitalName, // Store hospital name instead of ID
      };

      await api.put("/user/update", updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await api.put(
        "/user/change-hospital",
        { hospitalName: updatedData.hospital },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Alert.alert("Success", "Profile updated successfully");
      setEditable(false);
      fetchUserProfile(); // Refresh user data after update
    } catch (error) {
      Alert.alert("Error", "Failed to update profile");
    }
  };

  return (
    <View style={styles.container}>
      {userData && (
        <>
          <Text style={styles.header}>Profile</Text>

          <TextInput
            style={styles.input}
            value={updatedUserData.name}
            editable={editable}
            onChangeText={(text) =>
              setUpdatedUserData({ ...updatedUserData, name: text })
            }
          />
          <TextInput
            style={styles.input}
            value={updatedUserData.email}
            editable={false}
          />
          <TextInput
            style={styles.input}
            value={updatedUserData.MobileNumber}
            editable={editable}
            onChangeText={(text) =>
              setUpdatedUserData({ ...updatedUserData, MobileNumber: text })
            }
          />
          <TextInput
            style={styles.input}
            value={updatedUserData.bloodGroup}
            editable={false}
          />
          <TextInput
            style={styles.input}
            value={updatedUserData.address}
            editable={editable}
            onChangeText={(text) =>
              setUpdatedUserData({ ...updatedUserData, address: text })
            }
          />

          {/* Donor-Specific Details */}
          {userData.role === "Donor" && (
            <View style={styles.infoContainer}>
              <Text style={styles.infoText}>
                Number of Donations: {userData.donationsCount}
              </Text>
              <Text style={styles.infoText}>
                Last Donation Date: {userData.lastDonationDate || "N/A"}
              </Text>
            </View>
          )}

          {/* Recipient-Specific Hospital Dropdown */}
          {userData.role === "Recipient" && (
            <View style={styles.dropdownContainer}>
              <Text>Select Hospital:</Text>
              <DropDownPicker
                open={open}
                setOpen={setOpen}
                value={hospitalName}
                setValue={setHospitalName}
                items={hospitalList}
                placeholder="Select a hospital"
                containerStyle={styles.dropdownContainer}
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownList}
              />
            </View>
          )}

          {/* Edit & Save Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => (editable ? handleUpdate() : setEditable(true))}
          >
            <Text style={styles.buttonText}>
              {editable ? "Save Changes" : "Edit Profile"}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  infoContainer: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  infoText: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
  dropdownContainer: { marginVertical: 10, zIndex: 1000 },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
  },
  dropdownList: {
    borderColor: "#ccc",
  },
});

export default ProfileScreen;
