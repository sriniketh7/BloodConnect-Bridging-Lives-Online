import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, Alert, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute, useNavigation } from "@react-navigation/native";
import api from "../api/api.js"; // Make sure this is the correct API path
import ScreenLayout from "../components/Screenlayout.js";

const RequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const route = useRoute();
  const navigation = useNavigation();

  const { token, user, role } = route.params || {}; // Extract token, user, and role from params

  useEffect(() => {
    const checkTokenAndFetchRequests = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      // console.log("Fetched requests:", response.data.requests);

      if (!storedToken) {
        setError("You need to log in first.");
        setLoading(false);
        return;
      }

      if (user && user.role === "Donor") {
        try {
          const response = await api.get("/donor/requests", {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });

          if (response.status === 200) {
            //console.log(response.data.requests);
            setRequests(response.data.requests || []);
          } else {
            setError(response.data.message || "Failed to fetch requests.");
          }
        } catch (error) {
          console.error("Error fetching requests:", error);
          setError("An error occurred while fetching requests.");
        } finally {
          setLoading(false);
        }
      } else {
        setError("Invalid user data or role.");
        setLoading(false);
      }
    };

    checkTokenAndFetchRequests();
  }, [token, user, role, navigation]);

  const handleAcceptRequest = async (requestId) => {
    try {
      const storedToken = await AsyncStorage.getItem("token");
      if (!storedToken) {
        Alert.alert("Error", "You need to log in first.");
        return;
      }

      const response = await api.post(
        "/requests/respond",
        { requestId, action: "accept" },
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );

      if (response.status === 200 && response.data.success) {
        // Alert.alert("Success", "Request accepted successfully.");
        //console.log("Before update:", requests);
        // Optionally refresh the requests list
        setRequests((prevRequests) => [
          ...prevRequests.filter((req) => req._id !== requestId),
        ]);

        console.log("after update:", requests);
      } else {
        Alert.alert(
          "Error",
          response.data.message || "Failed to accept request."
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred while accepting the request.");
    }
  };

  const handleDenyRequest = async (requestId) => {
    try {
      const storedToken = await AsyncStorage.getItem("token");
      if (!storedToken) {
        Alert.alert("Error", "You need to log in first.");
        return;
      }

      const response = await api.post(
        "/requests/respond",
        { requestId, action: "deny" },
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );

      if (response.status === 200 && response.data.success) {
        Alert.alert("Success", "Request denied successfully.");
        // Optionally refresh the requests list
        setRequests((prev) =>
          prev.filter((request) => request._id !== requestId)
        );
      } else {
        Alert.alert(
          "Error",
          response.data.message || "Failed to deny request."
        );
      }
    } catch (error) {
      console.error("Error denying request:", error);
      Alert.alert("Error", "An error occurred while denying the request.");
    }
  };

  if (loading) {
    return (
      <ScreenLayout>
        <View style={styles.loadingContainer}>
          {/* <ActivityIndicator size="large" color="#007bff" /> */}
          <Text>Loading...</Text>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <View style={styles.container}>
        <Text style={styles.title}>Recipient Requests</Text>
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <FlatList
            data={requests}
            keyExtractor={(item) => item?.requestId?.toString()}
            renderItem={({ item }) => (
              <View style={styles.requestCard}>
                <Text style={styles.requestText}>
                  Recipient: {item?.recipientName || "Unknown"}
                </Text>
                <Text>Blood Group: {item?.bloodGroup || "N/A"}</Text>
                {/* <Text>Hospital: {item?.hospitalName || "N/A"}</Text>
              <Text>Location: {item?.hospitalLocation || "N/A"}</Text> */}

                <View style={styles.buttonContainer}>
                  <Button
                    title="Accept"
                    onPress={() => handleAcceptRequest(item?.requestId)}
                    color="#28a745"
                  />
                  <View style={styles.buttonSpacing} />
                  <Button
                    title="Deny"
                    onPress={() => handleDenyRequest(item?.requestId)}
                    color="#dc3545"
                  />
                </View>
              </View>
            )}
            ListEmptyComponent={
              <Text style={styles.noData}>
                No recipient requests available.
              </Text>
            }
          />
        )}
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  requestCard: {
    padding: 15,
    marginBottom: 15,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  requestText: {
    fontSize: 16,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonSpacing: {
    width: 10,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
  noData: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
    color: "#777",
  },
});

export default RequestsPage;
