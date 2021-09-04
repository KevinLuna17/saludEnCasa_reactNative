import React, { useRef } from "react";
import { StyleSheet, View, Image } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Toast from "react-native-easy-toast";
import RegisterForm from "../../components/Account/RegisterForm";

export default function Register() {
  const toastRef = useRef();

  return (
    <KeyboardAwareScrollView>
      <View style={styles.viewScreen}>
        <Image
          source={require("../../../assets/img/sCCC_2.png")}
          resizeMode="contain"
          style={styles.logo}
        />
        <View style={styles.viewForm}>
          <RegisterForm toastRef={toastRef} />
        </View>
      </View>
      <Toast ref={toastRef} position="center" opacity={0.9} />
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  viewScreen: {
    backgroundColor: "#fff",
  },
  logo: {
    width: "100%",
    height: 150,
    marginTop: 25,
    marginBottom: 20,
  },
  viewForm: {
    //backgroundColor: "#fff",
    marginRight: 40,
    marginLeft: 40,
  },
});
