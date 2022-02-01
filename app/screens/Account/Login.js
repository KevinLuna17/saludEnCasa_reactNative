import React, { useRef } from "react";
import { StyleSheet, View, ScrollView, Text, Image } from "react-native";
import { Divider } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Toast from "react-native-easy-toast";
import LoginForm from "../../components/Account/LoginForm";
import LoginFacebook from "../../components/Account/LoginFacebook";

export default function Login() {
  const toastRef = useRef();

  return (
    <KeyboardAwareScrollView>
      <View style={styles.viewScreen}>
        <Image
          source={require("../../../assets/img/logo_sc.png")}
          resizeMode="contain"
          style={styles.logo}
        />
        <View style={styles.viewContainer}>
          <LoginForm toastRef={toastRef} />
          <LoginFacebook toastRef={toastRef} />
          <CreateAccount />
          <RecoverPassword />
        </View>
        <Divider style={styles.divider} />
        {/* <View style={styles.viewContainer}>
        <LoginFacebook toastRef={toastRef} />
      </View> */}
        <Toast ref={toastRef} position="center" opacity={0.9} />
      </View>
    </KeyboardAwareScrollView>
  );
}

function RecoverPassword() {
  const navigation = useNavigation();
  return (
    <Text
      style={styles.textRegister}
      onPress={() => navigation.navigate("recover-password")}
    >
      ¿Olvidaste tu contraseña?{" "}
      <Text style={styles.btnRegister}>Recupérala</Text>
    </Text>
  );
}

function CreateAccount() {
  const navigation = useNavigation();
  return (
    <Text style={styles.textRegister}>
      ¿Aún no tienes una cuenta?{" "}
      <Text
        style={styles.btnRegister}
        onPress={() => navigation.navigate("register")}
      >
        Regístrate
      </Text>
    </Text>
  );
}

const styles = StyleSheet.create({
  viewScreen: {
    backgroundColor: "#fff",
  },
  logo: {
    width: "100%",
    height: 150,
    marginTop: 20,
  },
  viewContainer: {
    //backgroundColor: "#fff",
    marginRight: 40,
    marginLeft: 40,
  },
  textRegister: {
    marginTop: 15,
    marginLeft: 10,
    marginRight: 10,
    textAlign: "center",
  },
  btnRegister: {
    color: "#00a680",
    fontWeight: "bold",
  },
  divider: {
    backgroundColor: "#00a680",
    margin: 45,
  },
});
