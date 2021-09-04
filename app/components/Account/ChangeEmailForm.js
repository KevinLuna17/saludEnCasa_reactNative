import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Input, Button } from "react-native-elements";
//import firebase from "firebase";
import { validateEmail, validateContrasena } from "../../utils/validations";
import { reauthenticate } from "../../utils/api";

//FIRESTORE
import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore"; //Importamos el firestore para la base de datos
const db = firebase.firestore(firebaseApp); //Le pasamos la configuración del firebaseApp

export default function ChangeEmailForm(props) {
  const { email, setShowModal, toastRef, setReloadUserInfo, uid } = props;
  const [formData, setFormData] = useState(defaultValue());
  const [showPassword, setShowPassword] = useState(false); //Llegan 2 estados, como false para decirles que la contraseña llega como oculta
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  /*La función onChange lo que hace es recibir si es tipo email o contraseña
  Se utiliza [type] para que la key sea una variable dinámica*/
  const onChange = (e, type) => {
    setFormData({ ...formData, [type]: e.nativeEvent.text }); //Usamos ...formData para que no nos traiga el objeto, si no los valores que tiene el objeto
  };

  /*Para Firebase el Correo electrónico es un dato sensible es por eso que nos
  pide que volvamos autenticarnos para poder modificar el correo electrónico*/
  const onSubmit = () => {
    setErrors({});
    if (!formData.email || email === formData.email) {
      setErrors({
        email: "El correo no ha cambiado",
      });
    } else if (!validateEmail(formData.email)) {
      setErrors({
        email: "Correo electrónico incorrecto",
      });
    } else if (!formData.password) {
      setErrors({
        password: "La contraseña no puede estar vacía",
      });
    } else if (!validateContrasena(formData.password)) {
      setErrors({
        password:
          "La contraseña debe ser de 8 a 12 dígitos y solo puede contener letras, números y guión.",
      });
    } else {
      setIsLoading(true);
      reauthenticate(formData.password)
        .then(() => {
          firebase
            .auth()
            .currentUser.updateEmail(formData.email)
            .then(() => {
              setIsLoading(false);
              setReloadUserInfo(true);
              toastRef.current.show("Correo actualizado correctamente");
              setShowModal(false);
              var ref = db.collection("usuarios").doc(uid);
              return ref
                .update({
                  nombre: true,
                })
                .then(() => {
                  //console.log("Documento actualizado correctamente");
                })
                .catch(() => {
                  //console.log("Error al actualizar documento");
                });
            })
            .catch(() => {
              setErrors({ email: "Error al actualizar el correo" });
              setIsLoading(false);
            });
        })
        .catch(() => {
          setIsLoading(false);
          setErrors({ password: "La contraseña no es correcta" });
        });
    }
  };

  return (
    <View style={styles.view}>
      <Input
        placeholder="Correo electrónico"
        containerStyle={styles.input}
        defaultValue={email || ""} //Esta es una validación en casa que venga nulo, presente el input vacío
        keyboardType="email-address"
        autoCapitalize="none"
        autoCompleteType="email"
        rightIcon={{
          type: "material-community",
          name: "at",
          color: "#00a680",
        }}
        onChange={(e) => onChange(e, "email")}
        errorMessage={errors.email}
      />
      <Input
        placeholder="Contraseña"
        containerStyle={styles.input}
        autoCapitalize="none"
        password={true}
        secureTextEntry={showPassword ? false : true} //Si showPassword es true significa que la contraseña tiene que verse
        rightIcon={{
          type: "material-community",
          name: showPassword ? "eye-off-outline" : "eye-outline", //Si showPassword es true me vas a mostrar el icono del ojo tachado para decirle que ahora tiene que ocultar contraseña
          color: "#808080",
          onPress: () => setShowPassword(!showPassword), //Actualizamos al valor contrario de showPassword, es decir si es true lo mandamos como False y viceversa, por eso va con !
        }}
        onChange={(e) => onChange(e, "password")}
        errorMessage={errors.password}
      />
      <Button
        title="Cambiar Correo"
        containerStyle={styles.btnContainer}
        buttonStyle={styles.btn}
        onPress={onSubmit}
        loading={isLoading}
      />
    </View>
  );
}

function defaultValue() {
  return {
    email: "",
    password: "",
  };
}

const styles = StyleSheet.create({
  view: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 10,
  },
  input: {
    marginBottom: 10,
  },
  btnContainer: {
    marginTop: 20,
    width: "95%",
  },
  btn: {
    backgroundColor: "#00a680", //Verde Corporativo
  },
});
