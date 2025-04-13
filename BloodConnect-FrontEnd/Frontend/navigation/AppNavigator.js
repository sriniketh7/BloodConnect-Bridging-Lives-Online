import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import RegistrationScreen from "../pages/RegistrationScreen";
import LoginScreen from "../pages/LoginScreen";
import InitialPage from "../pages/InitialPage";
import RoleSelection from "../pages/RoleSelection";
import RequestsPage from "../pages/RequestsPage";
import DonorDashboard from "../pages/DonorDashboard";
import RecipientDashboard from "../pages/RecipientDashboard";
import ProfileScreen from "../pages/ProfileScreen";
import HospitalDetails from "../pages/HsptlRqst";
import HospitalAdminRegister from "../pages/HspAdminReg";
import HospitalAdminLogin from "../pages/HspLogin";
import HospitalDashboard from "../pages/HospitalDashboard";
// import DonorScreen from "../pages/DonorScreen";
// import RecipientScreen from "../pages/RecipientScreen";

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="InitialPage">
      <Stack.Screen name="InitialPage" component={InitialPage} />
      <Stack.Screen name="Registration" component={RegistrationScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="RoleSelection" component={RoleSelection} />
      <Stack.Screen name="Donor" component={DonorDashboard} />
      <Stack.Screen name="Myrequests" component={RequestsPage} />
      <Stack.Screen name="Recipient" component={RecipientDashboard} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="HospitalDetails" component={HospitalDetails} />
      <Stack.Screen name="HospitalReg" component={HospitalAdminRegister} />
      <Stack.Screen name="HospitalLogin" component={HospitalAdminLogin} />
      <Stack.Screen name="HospitalDashBoard" component={HospitalDashboard} />

      {/* <Stack.Screen name="Donor" component={DonorScreen} />
      <Stack.Screen name="Recipient" component={RecipientScreen} /> */}
    </Stack.Navigator>
  );
}
