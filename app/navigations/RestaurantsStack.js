import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Restaurants from "../screens/ServiciosMedicos/Restaurants";
import AddServicios from "../screens/ServiciosMedicos/AddServicios";
import Servicio from "../screens/ServiciosMedicos/Servicio";
import AddReviewServicio from "../screens/ServiciosMedicos/AddReviewServicio";
import AddAgendamiento from "../screens/Agendamiento/AddAgendamiento";
const Stack = createStackNavigator();

export default function RestaurantsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="restaurants"
        component={Restaurants}
        options={{ title: "Salud en Casa", headerTintColor: "#00a680" }}
      />
      <Stack.Screen
        name="add-servicios"
        component={AddServicios}
        options={{
          title: "Añadir Nuevo Servicio Médico",
          headerTintColor: "#00a680",
        }}
      />
      <Stack.Screen name="servicio" component={Servicio} />
      <Stack.Screen
        name="add-review-servicio"
        component={AddReviewServicio}
        options={{ title: "Nuevo comentario", headerTintColor: "#00a680" }}
      />
      <Stack.Screen
        name="add-agendamiento"
        component={AddAgendamiento}
        options={{
          title: "Agendamiento Cita Médica",
          headerTintColor: "#00a680",
        }}
      />
      {/* <Stack.Screen
        name="agendamiento-state"
        component={AgendamientoState}
        options={{
          title: "Confirmar Cita Médica",
          headerTintColor: "#00a680",
        }}
      /> */}
    </Stack.Navigator>
  );
}
