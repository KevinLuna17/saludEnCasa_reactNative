import React, { useState } from "react";
import { StyleSheet, View, Platform, Alert, TextInput } from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import Loading from "../Loading";
import { validateEmail } from "../../utils/validations";
import { size, isEmpty } from "lodash";

import * as GoogleSignIn from "expo-google-sign-in";

import firebase from "firebase";

import { useNavigation } from "@react-navigation/native";

export default function LoginForm(props) {
  const { toastRef } = props;
  const [showPassword, setShowPassword] = useState(false); //Llegan 2 estados, como false para decirles que la contraseña llega como oculta
  const [formData, setFormData] = useState(defaultFormValue());
  const [formError, setFormError] = useState({});
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  /* firebase.auth().onAuthStateChanged((user) => {
    user && navigation.navigate("account"); //Si user existe hacemos navigation
  }); */

  const onChange = (e, type) => {
    setFormData({ ...formData, [type]: e.nativeEvent.text }); //Usamos ...formData para que no nos traiga el objeto, si no los valores que tiene el objeto
  };

  async function googleSignInAsync() {
    try {
      await GoogleSignIn.initAsync();
      if (Platform.OS === "android") {
        await GoogleSignIn.askForPlayServicesAsync();
      }
      const { type, user } = await GoogleSignIn.signInAsync();
      if (type === "success") {
        onSignIn(user);
        setLoading(false);
        return true;
      } else {
        setLoading(false);
        Alert.alert(JSON.stringify(result));
        return { cancelled: true };
      }
    } catch (error) {
      setLoading(false);
      Alert.alert(error.message);
      return { error: true };
    }
  }

  function onSignIn(googleUser) {
    const unsubscribe = firebase
      .auth()
      .onAuthStateChanged(function (firebaseUser) {
        unsubscribe();
        if (!isUserEqual(googleUser, firebaseUser)) {
          const credential = firebase.auth.GoogleAuthProvider.credential(
            googleUser.auth.idToken,
            googleUser.auth.accessToken
          );
          setLoading(true);
          firebase
            .auth()
            .signInWithCredential(credential)
            .then(() => {
              setLoading(false);
              navigation.navigate("account");
            })
            .catch(function (error) {
              setLoading(false);
              Alert.alert(error.message);
            });
        } else {
          Alert.alert("Usuario ya está logueado");
        }
      });
  }

  function isUserEqual(googleUser, firebaseUser) {
    if (firebaseUser) {
      let providerData = firebaseUser.providerData;
      for (let i = 0; i < providerData.length; i++) {
        if (
          providerData[i].providerId ===
            firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.getBasicProfile().getId()
        ) {
          return true;
        }
      }
    }
    return false;
  }

  const onSubmit = () => {
    let errors = {}; //Guardamos los errores de manera temporal y actualizamos estados de esta forma
    if (isEmpty(formData.email) || isEmpty(formData.password)) {
      if (!formData.email) errors.email = true; //Si está en true el error entonces es porque no tiene contenido
      if (!formData.password) errors.password = true; //Si está en true el error entonces es porque no tiene contenido
      toastRef.current.show("Todos los campos son obligatorios", 2000);
    } else if (!validateEmail(formData.email)) {
      toastRef.current.show("El correo electrónico no es correcto", 2000);
      errors.email = true;
    } else if (size(formData.password) < 8) {
      toastRef.current.show(
        "La contraseña tiene que ser de 8 a 12 dígitos y solo puede contener letras, números y guión bajo",
        3000
      );
      errors.password = true;
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
    setFormError(errors);
  };

  return (
    <View style={styles.formContainer}>
      {/* <Input
        placeholder="Correo Electrónico"
        keyboardType="email-address"
        //containerStyle={styles.inputForm}
        containerStyle={[styles.inputForm, formError.email && styles.error]} //Para añadir más de un estilo se debe envolver en un Array y separar con coma
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
      /> */}
      <View style={[styles.inputContainer, formError.email && styles.error]}>
        <Icon
          type="material-community"
          name="at"
          iconStyle={styles.iconRight}
        />
        <TextInput
          placeholder="Correo electrónico"
          placeholderTextColor="#c1c1c1"
          style={[styles.textInput, formError.email && styles.error]} //Para añadir más de un estilo se debe envolver en un Array y separar con coma
          keyboardType="email-address"
          autoCapitalize="none"
          autoCompleteType="email"
          autoCorrect
          onChange={(e) => onChange(e, "email")}
        />
      </View>
      {/* <Input
        placeholder="Contraseña"
        //containerStyle={styles.inputForm}
        containerStyle={[styles.inputForm, formError.password && styles.error]} //Para añadir más de un estilo se debe envolver en un Array y separar con coma
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
      /> */}
      <View style={[styles.inputContainer, formError.password && styles.error]}>
        <Icon
          type="material-community"
          name={showPassword ? "eye-off-outline" : "eye-outline"} //Si showPassword es true me vas a mostrar el icono del ojo tachado para decirle que ahora tiene que ocultar contraseña
          iconStyle={styles.iconRight}
          onPress={() => setShowPassword(!showPassword)} //Actualizamos al valor contrario de showPassword, es decir si es true lo mandamos como False y viceversa, por eso va con !
        />
        <TextInput
          placeholder="Contraseña"
          placeholderTextColor="#c1c1c1"
          style={[styles.textInput, formError.password && styles.error]} //Para añadir más de un estilo se debe envolver en un Array y separar con coma
          autoCapitalize="none"
          //password={true}
          secureTextEntry={showPassword ? false : true} //Si showPassword es true significa que la contraseña tiene que verse
          onChange={(e) => onChange(e, "password")}
        />
      </View>

      <Button
        title="Iniciar Sesión"
        containerStyle={styles.btnContainerLogin}
        buttonStyle={styles.btnLogin}
        onPress={onSubmit}
      />

      <Button
        title="Iniciar Sesión con Google"
        containerStyle={styles.btnContainerLogin}
        buttonStyle={styles.btnGoogle}
        onPress={googleSignInAsync}
        icon={
          <Icon
            name="google"
            type="material-community"
            marginRight={10}
            size={20}
            color="#fff"
          />
        }
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
  inputContainer: {
    flexDirection: "row",
    color: "#1e3040",
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    height: 50,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#1e3040",
    paddingBottom: 10,
    marginBottom: 20,
  },
  /* inputForm: {
    width: "100%",
    marginTop: 20,
    borderRadius: 50,
    //fontSize: 18,
    borderWidth: 1,
    borderColor: "#1e3040",
  }, */
  /* textInput: {
    flex: 1,
    height: 50,
    color: "#1e3040",
    width: "95%",
    marginBottom: 25,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    borderRadius: 50,
    fontSize: 18,
    borderWidth: 1,
    borderColor: "#1e3040",
  }, */
  textInput: {
    flex: 1,
    height: 50,
    color: "#1e3040",
    width: "95%",
    paddingHorizontal: 20,
    fontSize: 16,
    //marginBottom: 25,
    //backgroundColor: "#fff",
  },
  error: {
    //Error que pinta el TextInput de color rojo
    //borderColor: "#940c0c",
    borderColor: "#CC0000",
  },
  btnContainerLogin: {
    marginTop: 20,
    width: "95%",
    borderRadius: 20,
  },
  btnLogin: {
    backgroundColor: "#00a680",
  },
  btnGoogle: {
    backgroundColor: "#EA4335", //color de Google
  },
  iconRight: {
    color: "#808080",
    padding: 10,
    //marginTop: "10",
    //color: "#c1c1c1", color gris
  },
});
