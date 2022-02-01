import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import VisualizarCitas from "../screens/Agendamiento/VisualizarCitas";

const Stack = createStackNavigator();

export default function SearchStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="search"
        component={VisualizarCitas}
        options={{
          title: "Citas Médicas Agendadas",
          headerTintColor: "#00a680",
        }}
      />
    </Stack.Navigator>
  );
}
