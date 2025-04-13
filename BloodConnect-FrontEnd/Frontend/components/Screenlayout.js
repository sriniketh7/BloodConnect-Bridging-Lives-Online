import React from "react";
import { View, StyleSheet } from "react-native";
import Topbar from "../pages/topbar";

const ScreenLayout = ({ children }) => {
  return (
    <View style={styles.container}>
      <Topbar />
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: 10, // Adjust padding so content doesn't overlap with Topbar
  },
});

export default ScreenLayout;
