import React from "react";
import { LogBox, StyleSheet } from "react-native";
import { firebaseApp } from "./app/utils/firebase";
import Navigation from "./app/navigations/Navigation";
import { decode, encode } from "base-64";

LogBox.ignoreLogs(["Setting a timer", "expo-permissions is now"]);

if (!global.btoa) global.btoa = encode;
if (!global.atob) global.atob = decode;

export default function App() {
  return <Navigation />;
}

const styles = StyleSheet.create({
  app: {
    backgroundColor: "#68D7B5",
  },
});
