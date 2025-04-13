// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Button,
//   TouchableOpacity,
//   Alert,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useNavigation, useRoute } from "@react-navigation/native";

// export default function DonorDashboard() {
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigation = useNavigation();
//   const route = useRoute(); // To access params passed to the screen

//   const { token, user, role } = route.params || {}; // Extract token, user, and role from params

//   useEffect(() => {
//     const checkTokenAndSetUserData = async () => {
//       const token = await AsyncStorage.getItem("token");
//       if (!token) {
//         setError("You need to log in first.");
//         setLoading(false);
//         return;
//       }
//       if (user && user.role === "Donor") {
//         setUserData(user); // Set user data if valid
//       } else {
//         setError("Invalid user data.");
//       }
//       setLoading(false);
//     };
//     checkTokenAndSetUserData();
//   }, [user, role]);

//   const handleLogout = async () => {
//     try {
//       await AsyncStorage.removeItem("token");
//       await AsyncStorage.removeItem("user");
//       navigation.replace("InitialPage");
//     } catch (error) {
//       console.error("Error during logout:", error);
//     }
//   };

//   const handleNavigateToRequests = () => {
//     if (userData) {
//       navigation.navigate("Myrequests", {
//         token,
//         user: userData,
//         role: "Donor",
//       });
//     }
//   };

//   if (loading) {
//     return <Text>Loading...</Text>;
//   }

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Donor Dashboard</Text>
//         <TouchableOpacity
//           style={styles.menuButton}
//           onPress={() => navigation.navigate("Profile", { token, user, role })}
//         >
//           <Text style={styles.menuText}>Profile</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.menuButton} onPress={handleLogout}>
//           <Text style={styles.menuText}>Logout</Text>
//         </TouchableOpacity>
//       </View>

//       {error ? (
//         <Text style={styles.errorText}>{error}</Text>
//       ) : (
//         <>
//           <Text style={styles.importanceTitle}>
//             Importance of Blood Donation
//           </Text>
//           <Text style={styles.importanceText}>
//             Blood donation is a vital service that saves lives. Donors help
//             ensure there is enough supply of blood available for patients in
//             need. By donating blood, you can make a life-saving difference in
//             someone’s life.
//           </Text>

//           {userData && (
//             <View style={styles.userInfo}>
//               <Text style={styles.userInfoText}>Welcome, {userData.name}</Text>
//               <Text>Email: {userData.email}</Text>
//               <Text>Blood Group: {userData.bloodGroup}</Text>
//             </View>
//           )}

//           <Button title="Go to Requests" onPress={handleNavigateToRequests} />
//         </>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//   },
//   menuButton: {
//     padding: 10,
//   },
//   menuText: {
//     color: "#007bff",
//     fontSize: 16,
//   },
//   importanceTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginVertical: 10,
//   },
//   importanceText: {
//     fontSize: 16,
//     marginBottom: 20,
//   },
//   userInfo: {
//     marginBottom: 20,
//   },
//   userInfoText: {
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   errorText: {
//     color: "red",
//     fontSize: 16,
//   },
// });

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function DonorDashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();

  const { token, user, role } = route.params || {};

  useEffect(() => {
    const checkTokenAndSetUserData = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      if (!storedToken) {
        setError("You need to log in first.");
        setLoading(false);
        return;
      }
      if (user && user.role === "Donor") {
        setUserData(user);
      } else {
        setError("Invalid user data.");
      }
      setLoading(false);
    };
    checkTokenAndSetUserData();
  }, [user, role]);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      navigation.replace("InitialPage");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleNavigateToRequests = () => {
    if (userData) {
      navigation.navigate("Myrequests", {
        token,
        user: userData,
        role: "Donor",
      });
    }
  };

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#e63333" style={styles.loader} />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Hello, {userData?.name || "Donor"}!</Text>

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.navigate("Profile", { token, user, role })}
        >
          <Text style={styles.menuText}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton} onPress={handleLogout}>
          <Text style={styles.menuText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <>
          <Text style={styles.title}>Benefits of Blood Donation</Text>
          <View style={styles.gridContainer}>
            <View style={styles.card}>
              <Image
                source={{
                  uri: "https://cdn.usegalileo.ai/sdxl10/d72fed10-7d75-411b-83f0-57067199406f.png",
                }}
                style={styles.image}
              />
              <Text style={styles.cardTitle}>Improve Heart Health</Text>
            </View>
            <View style={styles.card}>
              <Image
                source={{
                  uri: "https://cdn.usegalileo.ai/sdxl10/d72fed10-7d75-411b-83f0-57067199406f.png",
                }}
                style={styles.image}
              />
              <Text style={styles.cardTitle}>Burn Calories</Text>
            </View>
            <View style={styles.card}>
              <Image
                source={{
                  uri: "https://cdn.usegalileo.ai/sdxl10/d72fed10-7d75-411b-83f0-57067199406f.png",
                }}
                style={styles.image}
              />
              <Text style={styles.cardTitle}>Reduce Cancer Risk</Text>
            </View>
          </View>
          <Button
            title="Go to Requests"
            onPress={handleNavigateToRequests}
            color="#e63333"
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  greeting: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#181111",
    marginBottom: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  menuButton: {
    padding: 10,
  },
  menuText: {
    color: "#e63333",
    fontSize: 16,
    fontWeight: "bold",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#181111",
    marginBottom: 15,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5dcdc",
    padding: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#181111",
    textAlign: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
