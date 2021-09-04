import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import Loading from "../Loading";
import { validateEmail } from "../../utils/validations";
import { size, isEmpty } from "lodash";

import firebase from "firebase";

import { useNavigation } from "@react-navigation/native";

export default function LoginForm(props) {
  const { toastRef } = props;
  const [showPassword, setShowPassword] = useState(false); //Llegan 2 estados, como false para decirles que la contraseña llega como oculta
  const [formData, setFormData] = useState(defaultFormValue());
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  /* firebase.auth().onAuthStateChanged((user) => {
    user && navigation.navigate("account"); //Si user existe hacemos navigation
  }); */

  const onChange = (e, type) => {
    setFormData({ ...formData, [type]: e.nativeEvent.text }); //Usamos ...formData para que no nos traiga el objeto, si no los valores que tiene el objeto
  };

  const onSubmit = () => {
    if (isEmpty(formData.email) || isEmpty(formData.password)) {
      toastRef.current.show("Todos los campos son obligatorios", 2000);
    } else if (!validateEmail(formData.email)) {
      toastRef.current.show("El correo electrónico no es correcto", 2000);
    } else if (size(formData.password) < 8) {
      toastRef.current.show(
        "La contraseña tiene que ser de 8 a 12 dígitos y solo puede contener letras, números y guión bajo",
        3000
      );
    } else {
      setLoading(true);
      firebase
        .auth()
        .signInWithEmailAndPassword(formData.email, formData.password)
        .then(() => {
          setLoading(false);
          navigation.navigate("account");
        })
        .catch(() => {
          setLoading(false);
          toastRef.current.show("Correo electrónico o contraseña incorrecta");
        });
    }
  };

  return (
    <View style={styles.formContainer}>
      <Input
        placeholder="Correo Electrónico"
        keyboardType="email-address"
        containerStyle={styles.inputForm}
        autoCapitalize="none"
        autoCompleteType="email"
        autoCorrect
        onChange={(e) => onChange(e, "email")}
        rightIcon={
          <Icon
            type="material-community"
            name="at"
            iconStyle={styles.iconRight}
          />
        }
      />
      <Input
        placeholder="Contraseña"
        containerStyle={styles.inputForm}
        autoCapitalize="none"
        password={true}
        secureTextEntry={showPassword ? false : true} //Si showPassword es true significa que la contraseña tiene que verse
        onChange={(e) => onChange(e, "password")}
        rightIcon={
          <Icon
            type="material-community"
            name={showPassword ? "eye-off-outline" : "eye-outline"} //Si showPassword es true me vas a mostrar el icono del ojo tachado para decirle que ahora tiene que ocultar contraseña
            iconStyle={styles.iconRight}
            onPress={() => setShowPassword(!showPassword)} //Actualizamos al valor contrario de showPassword, es decir si es true lo mandamos como False y viceversa, por eso va con !
          />
        }
      />
      <Button
        title="Iniciar Sesión"
        containerStyle={styles.btnContainerLogin}
        buttonStyle={styles.btnLogin}
        onPress={onSubmit}
      />
      <Loading isVisible={loading} text="Iniciando Sesión" />
    </View>
  );
}

function defaultFormValue() {
  return {
    email: "",
    password: "",
  };
}

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  inputForm: {
    width: "100%",
    marginTop: 20,
    //textAlign: "center",
    //justifyContent: "center",
  },
  btnContainerLogin: {
    marginTop: 20,
    width: "95%",
  },
  btnLogin: {
    backgroundColor: "#00a680",
  },
  iconRight: {
    color: "#808080",
    //color: "#c1c1c1", color gris
  },
});
