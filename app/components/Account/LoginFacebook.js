import React, { useState } from "react";
import { SocialIcon } from "react-native-elements";
import firebase from "firebase";
import Facebook from "expo-facebook";
import { useNavigation } from "@react-navigation/native";
import { FacebookApi } from "../../utils/social";
import Loading from "../Loading";

export default function LoginFacebook(props) {
  const { toastRef } = props;
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const login = async () => {
    await Facebook.initializeAsync(FacebookApi.application_id);

    const { type, token } = await Facebook.logInWithReadPermissionsAsync({
      permissions: FacebookApi.permissions,
    });

    if (type === "success") {
      setLoading(true);
      const credentials = firebase.auth.FacebookAuthProvider.credential(token);
      firebase
        .auth()
        .signInWithCredential(credentials)
        .then(() => {
          setLoading(false);
          navigation.navigate("account");
        })
        .catch(() => {
          setLoading(false);
          toastRef.current.show("Credenciales incorrectas.");
        });
    } else if (type === "cancel") {
      toastRef.current.show("Inicio de sesion cancelado");
    } else {
      toastRef.current.show("Error desconocido, intentelo más tarde");
    }
  };

  /* const login = async () => {
    try {
      await Facebook.initializeAsync("167006848883694");
      const { type, token } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ["public_profile", "email"],
      });
      if (type === "success") {
        // Get the user's name using Facebook's Graph API
        const response = await fetch(
          `https://graph.facebook.com/me?access_token=${token}`
        );
        Alert.alert("Logged in!", `Hi ${(await response.json()).name}!`);
        setLoading(false);
        navigation.navigate("account");
      } else if (type === "cancel") {
        toastRef.current.show("Inicio de sesion cancelado");
      } else {
        toastRef.current.show("Error desconocido, intentelo más tarde");
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  }; */

  return (
    <>
      <SocialIcon
        title="Iniciar sesión con Facebook"
        button
        type="facebook"
        onPress={login}
      />
      <Loading isVisible={loading} text="Iniciando sesión" />
    </>
  );
}
