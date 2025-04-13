// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   Button,
//   FlatList,
//   StyleSheet,
//   ActivityIndicator,
//   Alert,
// } from "react-native";
// import axios from "axios";
// import api from "../api/api.js";
// import ScreenLayout from "../components/Screenlayout.js";

// const RecipientDashboard = ({ route }) => {
//   const [donors, setDonors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");
//   const [hospitalId, setHospitalId] = useState(null);

//   const { token, user } = route.params;

//   useEffect(() => {
//     fetchDonors();
//   }, []);

//   const fetchDonors = async (searchTerm = "") => {
//     try {
//       setLoading(true);
//       const { bloodGroup } = user;
//       const [longitude, latitude] = user.location.coordinates;

//       const response = await api.post(
//         "/recipient/recdashboard",
//         { latitude, longitude, bloodGroup, search: searchTerm },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       //console.log(response.data.hospital.hospitalid);
//       setDonors(response.data.donors);
//       setHospitalId(response.data.hospital.hospitalid); // Store hospitalId from response
//     } catch (error) {
//       console.error("Error fetching donors:", error.response?.data || error);
//       Alert.alert("Error", "Could not fetch donors.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearch = () => {
//     if (search.trim()) {
//       fetchDonors(search);
//     } else {
//       Alert.alert("Warning", "Please enter a valid search term.");
//     }
//   };

//   const handleClearSearch = () => {
//     setSearch("");
//     fetchDonors(); // Reset to initial list
//   };

//   const sendRequest = async (donor) => {
//     try {
//       const recipientId = user.id;
//       console.log(hospitalId);

//       await api.post(
//         "/requests/send",
//         { donorId: donor._id, recipientId, hospitalId },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       Alert.alert("Success", "Request sent successfully!");
//     } catch (error) {
//       console.error("Error sending request:", error.response?.data || error);
//       Alert.alert("Error", "Could not send request.");
//     }
//   };

//   if (loading) {
//     return (
//       <ScreenLayout>
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="#007bff" />
//           <Text>Loading...</Text>
//         </View>
//       </ScreenLayout>
//     );
//   }

//   return (
//     <ScreenLayout>
//       <View style={styles.container}>
//         {/* Search Bar */}
//         <View style={styles.searchBar}>
//           <TextInput
//             style={styles.input}
//             placeholder="Search by name, location, or blood type..."
//             value={search}
//             onChangeText={setSearch}
//           />
//           <Button title="Search" onPress={handleSearch} />
//           <Button title="Clear" onPress={handleClearSearch} color="red" />
//         </View>

//         {/* Donor List */}
//         <FlatList
//           data={donors}
//           keyExtractor={(item) => item._id}
//           renderItem={({ item }) => (
//             <View style={styles.card}>
//               <Text style={styles.cardTitle}>{item.name}</Text>
//               <Text>Blood Group: {item.bloodGroup}</Text>
//               <Button title="Send Request" onPress={() => sendRequest(item)} />
//             </View>
//           )}
//           ListEmptyComponent={
//             <Text style={styles.noData}>No donors found.</Text>
//           }
//         />
//       </View>
//     </ScreenLayout>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   searchBar: {
//     flexDirection: "row",
//     marginBottom: 16,
//   },
//   input: {
//     flex: 1,
//     borderColor: "#ccc",
//     borderWidth: 1,
//     borderRadius: 8,
//     paddingHorizontal: 8,
//     marginRight: 8,
//   },
//   card: {
//     backgroundColor: "#f9f9f9",
//     padding: 16,
//     marginBottom: 8,
//     borderRadius: 8,
//   },
//   cardTitle: {
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   noData: {
//     textAlign: "center",
//     marginTop: 16,
//     color: "#888",
//   },
// });

// export default RecipientDashboard;

import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import api from "../api/api.js";
import ScreenLayout from "../components/Screenlayout.js";

const RecipientDashboard = ({ route }) => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [hospitalId, setHospitalId] = useState(null);
  const [messages, setMessages] = useState({}); // State to store messages for each donor

  const { token, user } = route.params;

  const fetchDonors = async (searchTerm = "") => {
    try {
      setLoading(true);
      const { bloodGroup } = user;
      const [longitude, latitude] = user.location.coordinates;

      const response = await api.post(
        "/recipient/recdashboard",
        { latitude, longitude, bloodGroup, search: searchTerm },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDonors(response.data.donors);
      setHospitalId(response.data.hospital.hospitalid);
    } catch (error) {
      console.error("Error fetching donors:", error.response?.data || error);
      Alert.alert("Error", "Could not fetch donors.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDonors();
    }, [])
  );

  const handleSearch = () => {
    if (search.trim()) {
      fetchDonors(search);
    } else {
      Alert.alert("Warning", "Please enter a valid search term.");
    }
  };

  const handleClearSearch = () => {
    setSearch("");
    fetchDonors();
  };

  // Function to handle message input for each donor
  const handleMessageChange = (donorId, text) => {
    setMessages((prevMessages) => ({
      ...prevMessages,
      [donorId]: text, // Store message for each donor separately
    }));
  };

  const sendRequest = async (donor) => {
    try {
      const recipientId = user.id;
      const message = messages[donor._id] || ""; // Get message for this donor

      await api.post(
        "/requests/send",
        { donorId: donor._id, recipientId, hospitalId, message }, // Send message along with request
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Alert.alert("Success", "Request sent successfully!");
      setMessages((prevMessages) => ({ ...prevMessages, [donor._id]: "" })); // Clear message after sending
    } catch (error) {
      console.error("Error sending request:", error.response?.data || error);
      Alert.alert("Error", "Could not send request.");
    }
  };

  if (loading) {
    return (
      <ScreenLayout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text>Loading...</Text>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <View style={styles.container}>
        {/* Search Bar */}
        <View style={styles.searchBar}>
          <View style={styles.searchIconContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Search by name, location, or blood type..."
            value={search}
            onChangeText={setSearch}
          />
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              onPress={handleSearch}
              style={styles.searchButton}
            >
              <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleClearSearch}
              style={styles.clearButton}
            >
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Donor List */}
        <FlatList
          data={donors}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardBloodGroup}>{item.bloodGroup}</Text>
                {/* Message Input Field */}
                <TextInput
                  style={styles.messageInput}
                  placeholder="Enter your message..."
                  value={messages[item._id] || ""}
                  onChangeText={(text) => handleMessageChange(item._id, text)}
                />
              </View>
              <TouchableOpacity
                style={styles.requestButton}
                onPress={() => sendRequest(item)}
              >
                <Text style={styles.requestButtonText}>Send Request</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.noData}>No donors found.</Text>
          }
        />
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchBar: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "center",
    backgroundColor: "#EEEEEE",
    borderRadius: 8,
    paddingLeft: 10,
    paddingRight: 10,
  },
  searchIconContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  searchIcon: {
    fontSize: 20,
    color: "#999",
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingLeft: 10,
    fontSize: 16,
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 10,
  },
  searchButton: {
    backgroundColor: "#007bff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  clearButton: {
    backgroundColor: "#ec1313",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  clearButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTextContainer: {
    flexDirection: "column",
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  cardBloodGroup: {
    fontSize: 14,
    color: "#777",
    marginBottom: 8,
  },
  messageInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
    marginBottom: 8,
  },
  requestButton: {
    backgroundColor: "#007bff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  requestButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  noData: {
    textAlign: "center",
    marginTop: 16,
    color: "#888",
  },
});

export default RecipientDashboard;
