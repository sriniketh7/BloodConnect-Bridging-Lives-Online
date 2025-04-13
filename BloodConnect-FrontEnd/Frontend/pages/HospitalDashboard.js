// import React, { useEffect, useState } from "react";
// import { View, Text, FlatList, Button, Alert, StyleSheet } from "react-native";
// import api from "../api/api";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const HospitalDashboard = ({ route, navigation }) => {
//   const [requests, setRequests] = useState([]);
//   const { token, user } = route.params;

//   useEffect(() => {
//     fetchRequests();
//   }, []);

//   const fetchRequests = async () => {
//     try {
//       const token = await AsyncStorage.getItem("token");

//       if (!user) {
//         Alert.alert("Error", "User details not found");
//         return;
//       }
//       const response = await api.get("/hospital/requests", {
//         headers: { Authorization: `Bearer ${token}` },
//         params: { hospitalId: user.hospitalId }, // Send hospitalId as a query parameter
//       });

//       setRequests(response.data.requests); // Assuming response contains 'requests'
//     } catch (error) {
//       Alert.alert("Error", "Failed to fetch requests");
//     }
//   };

//   const handleApproval = async (requestId, status) => {
//     console.log(requestId);
//     try {
//       const token = await AsyncStorage.getItem("token");
//       const response = await api.post(
//         "/hospital/approve-request",
//         { requestId, status },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (response.status === 200) {
//         Alert.alert("Success", `Request ${status}`);
//         fetchRequests(); // Refresh list after action
//       }
//     } catch (error) {
//       console.log(error);
//       Alert.alert("Error", "Failed to update request status");
//     }
//   };

//   const handleConfirmation = async (requestId, status) => {
//     console.log(requestId);
//     try {
//       const token = await AsyncStorage.getItem("token");
//       const response = await api.post(
//         "/hospital/confirm",
//         { requestId, status },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (response.status === 200) {
//         Alert.alert("Success", `Request ${status}`);
//         fetchRequests();
//       }
//     } catch (error) {
//       console.log(error);
//       Alert.alert("Error", "Failed to update request status");
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>
//         Welcome, {user?.hospitalName || "Hospital Admin"}
//       </Text>
//       <FlatList
//         data={requests}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={({ item }) => (
//           <View style={styles.card}>
//             <Text style={styles.text}>
//               <Text style={styles.bold}>Recipient:</Text> {item.recipientName}
//             </Text>
//             <Text style={styles.text}>
//               <Text style={styles.bold}>Recipient Blood Group:</Text>{" "}
//               {item.recipientBloodGroup}
//             </Text>
//             <Text style={styles.text}>
//               <Text style={styles.bold}>Donor:</Text> {item.donorName}
//             </Text>
//             <Text style={styles.text}>
//               <Text style={styles.bold}>Donor Blood Group:</Text>{" "}
//               {item.donorBloodGroup}
//             </Text>
//             <Text style={styles.text}>
//               <Text style={styles.bold}>Request Date:</Text> {item.date}
//             </Text>
//             <View style={styles.buttonContainer}>
//               <Button
//                 title="Approve"
//                 onPress={() => handleApproval(item.id, "Approved")}
//                 color="green"
//               />
//               <Button
//                 title="Deny"
//                 onPress={() => handleApproval(item.id, "Denied")}
//                 color="red"
//               />

//               <Button
//                 title="Confirm"
//                 onPress={() =>
//                   handleConfirmation(item.id, "Donation Confirmed")
//                 }
//                 color="blue"
//               />
//             </View>
//           </View>
//         )}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: "#f8f9fa",
//   },
//   header: {
//     fontSize: 22,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginBottom: 20,
//     color: "#333",
//   },
//   card: {
//     padding: 15,
//     backgroundColor: "#fff",
//     borderRadius: 8,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     marginBottom: 15,
//   },
//   text: {
//     fontSize: 16,
//     color: "#555",
//   },
//   bold: {
//     fontWeight: "bold",
//   },
//   buttonContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 10,
//   },
// });

// export default HospitalDashboard;

import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Button, Alert, StyleSheet } from "react-native";
import api from "../api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HospitalDashboard = ({ route, navigation }) => {
  const [requests, setRequests] = useState([]);
  const { token, user } = route.params;

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!user) {
        Alert.alert("Error", "User details not found");
        return;
      }
      const response = await api.get("/hospital/requests", {
        headers: { Authorization: `Bearer ${token}` },
        params: { hospitalId: user.hospitalId },
      });

      setRequests(response.data.requests);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch requests");
    }
  };

  const handleApproval = async (requestId, status) => {
    console.log(requestId);
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await api.post(
        "/hospital/approve-request",
        { requestId, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        Alert.alert("Success", `Request ${status}`);
        fetchRequests();
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to update request status");
    }
  };

  const handleConfirmation = async (requestId, status) => {
    console.log(requestId);
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await api.post(
        "/hospital/confirm",
        { requestId, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        Alert.alert("Success", `Request ${status}`);
        fetchRequests();
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to update request status");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        Welcome, {user?.hospitalName || "Hospital Admin"}
      </Text>
      <FlatList
        data={requests}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.text}>
              <Text style={styles.bold}>Recipient:</Text> {item.recipientName}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>Recipient Blood Group:</Text>{" "}
              {item.recipientBloodGroup}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>Donor:</Text> {item.donorName}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>Donor Blood Group:</Text>{" "}
              {item.donorBloodGroup}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>Request Date:</Text> {item.date}
            </Text>
            <View style={styles.buttonContainer}>
              <Button
                title="Approve"
                onPress={() => handleApproval(item.id, "Approved")}
                color="#28a745"
              />
              <Button
                title="Deny"
                onPress={() => handleApproval(item.id, "Denied")}
                color="#dc3545"
              />
              <Button
                title="Confirm"
                onPress={() =>
                  handleConfirmation(item.id, "Donation Confirmed")
                }
                color="#007bff"
              />
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  card: {
    padding: 20,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 15,
  },
  text: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  bold: {
    fontWeight: "bold",
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 15,
  },
});

export default HospitalDashboard;
