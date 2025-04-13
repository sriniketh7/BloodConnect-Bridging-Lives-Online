// import React from "react";
// import { View, Text, Button, StyleSheet } from "react-native";

// export default function InitialPage({ navigation }) {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Welcome to BloodConnect</Text>
//       <Text style={styles.subtitle}>Please choose an option to proceed.</Text>

//       {/* User Section (Donor/Recipient) */}
//       <View style={styles.sectionContainer}>
//         <Text style={styles.sectionTitle}>For General Users</Text>
//         <Button title="Login" onPress={() => navigation.navigate("Login")} />
//         <Button
//           title="Register"
//           onPress={() => navigation.navigate("Registration")}
//           style={styles.buttonSpacing}
//         />
//       </View>

//       {/* Hospital Admin Section */}
//       <View style={styles.sectionContainer}>
//         <Text style={styles.sectionTitle}>For Hospital Admins</Text>
//         <Button
//           title="Login as Admin"
//           onPress={() => navigation.navigate("HospitalLogin")}
//         />
//         <Button
//           title="Register as Admin"
//           onPress={() => navigation.navigate("HospitalReg")}
//           style={styles.buttonSpacing}
//         />
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//     backgroundColor: "#f8f9fa",
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "bold",
//     color: "#333",
//     marginBottom: 20,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: "#555",
//     textAlign: "center",
//     marginBottom: 40,
//   },
//   sectionContainer: {
//     width: "100%",
//     marginBottom: 30,
//     alignItems: "center",
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#333",
//     marginBottom: 10,
//   },
//   buttonSpacing: {
//     marginTop: 15,
//   },
// });

import React from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";

const { width: screenWidth } = Dimensions.get("window");

const carouselItems = [
  {
    image:
      "https://cdn.usegalileo.ai/sdxl10/6a2cba2e-8fa9-4e91-aa4c-dda6c6b62699.png",
    quote: "Donate blood, save lives.",
  },
  {
    image: require("../assets/bc.jpg"),
    quote: "Your little act of kindness can bring a big smile.",
  },
  {
    image: require("../assets/11[1].jpg"),
    quote: "Be a hero, give blood.",
  },
];

export default function InitialPage({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Blood Connect</Text>

      {/* Image Carousel */}
      <Carousel
        loop
        width={screenWidth}
        height={400}
        autoPlay
        autoPlayInterval={3000}
        data={carouselItems}
        scrollAnimationDuration={1000}
        renderItem={({ item }) => (
          <View style={styles.carouselItem}>
            <Image
              source={
                typeof item.image === "string"
                  ? { uri: item.image }
                  : item.image
              }
              style={styles.carouselImage}
            />

            <Text style={styles.carouselText}>{item.quote}</Text>
          </View>
        )}
      />

      {/* For General Users Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Are you a donor?</Text>
        <View style={styles.buttonContainer}>
          <Button
            title="Register"
            onPress={() => navigation.navigate("Registration")}
            color="#ec1313"
          />
          <Button
            title="Log in"
            onPress={() => navigation.navigate("Login")}
            color="#f4f0f0"
          />
        </View>
        <Text style={styles.sectionText}>
          Find a blood drive near you or schedule an appointment.
        </Text>
      </View>

      {/* For Hospital Admins Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>
          Are you a hospital administrator?
        </Text>
        <View style={styles.buttonContainer}>
          <Button
            title="Register"
            onPress={() => navigation.navigate("HospitalReg")}
            color="#ec1313"
          />
          <Button
            title="Log in"
            onPress={() => navigation.navigate("HospitalLogin")}
            color="#f4f0f0"
          />
        </View>
        <Text style={styles.sectionText}>
          Connect your hospital with our donor community.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#181111",
    textAlign: "center",
    marginBottom: 20,
  },
  // Carousel styles
  carouselItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  carouselImage: {
    width: screenWidth * 0.9,
    height: 400,
    borderRadius: 15,
  },
  carouselText: {
    position: "absolute",
    bottom: 20,
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 5,
    textAlign: "center",
  },
  // Sections
  sectionContainer: {
    width: "100%",
    marginTop: 30,
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#181111",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 10,
  },
  sectionText: {
    color: "#896161",
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
  },
});
