import React from "react";
import { StyleSheet, View } from "react-native";
import AgendamientoForm from "./AgendamientoForm";

export default function AddAgendamiento(props) {
  const { navigation, agendamientos, setAgendamientos } = props;

  return (
    <View>
      <AgendamientoForm
        navigation={navigation}
        agendamientos={agendamientos}
        setAgendamientos={setAgendamientos}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
