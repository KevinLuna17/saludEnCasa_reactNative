import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Account from "../screens/Account/Account";
import Login from "../screens/Account/Login";
import Register from "../screens/Account/Register";
import RecoverPassword from "../screens/Account/RecoverPassword";

const Stack = createStackNavigator();

export default function AccountStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="account"
        component={Account}
        options={{
          title: "Perfil",
          headerTintColor: "#00a680",
        }}
      />
      <Stack.Screen
        name="login"
        component={Login}
        options={{ title: "Iniciar Sesión", headerTintColor: "#00a680" }}
      />
      <Stack.Screen
        name="register"
        component={Register}
        options={{ title: "Registro", headerTintColor: "#00a680" }}
      />
      <Stack.Screen
        name="recover-password"
        component={RecoverPassword}
        options={{ title: "Recuperar Contraseña", headerTintColor: "#00a680" }}
      />
    </Stack.Navigator>
  );
}
