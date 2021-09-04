import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Input, Button } from "react-native-elements";
import { size } from "lodash";
import firebase from "firebase";
import { reauthenticate } from "../../utils/api";
import { validateContrasena } from "../../utils/validations";

export default function ChangePasswordForm(props) {
  const { setShowModal, toastRef } = props;
  const [formData, setFormData] = useState(defaultValue());
  const [showPassword, setShowPassword] = useState(false); //Llegan 2 estados, como false para decirles que la contraseña llega como oculta
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  /*La función onChange lo que hace es recibir si es tipo email o contraseña
  Se utiliza [type] para que la key sea una variable dinámica*/
  const onChange = (e, type) => {
    setFormData({ ...formData, [type]: e.nativeEvent.text }); //Usamos ...formData para que no nos traiga el objeto, si no los valores que tiene el objeto
  };

  const onSubmit = async () => {
    let isSetErrors = true;
    let errorsTemp = {};
    setErrors({});

    if (
      !formData.password ||
      !formData.newPassword ||
      !formData.repeatNewPassword
    ) {
      errorsTemp = {
        password: !formData.password
          ? "La contraseña no puede estar vacía"
          : "",
        newPassword: !formData.newPassword
          ? "La contraseña no puede estar vacía"
          : "",
        repeatNewPassword: !formData.repeatNewPassword
          ? "La contraseña no puede estar vacía"
          : "",
      };
    } else if (formData.newPassword !== formData.repeatNewPassword) {
      errorsTemp = {
        newPassword: "Las contraseñas no son iguales",
        repeatNewPassword: "Las contraseñas no son iguales",
      };
    } //else if (size(formData.newPassword) < 8) {
    else if (!validateContrasena(formData.newPassword)) {
      errorsTemp = {
        newPassword:
          "La contraseña debe ser de 8 a 12 dígitos y solo puede contener letras, números y guión.",
        repeatNewPassword:
          "La contraseña debe ser de 8 a 12 dígitos y solo puede contener letras, números y guión.",
      };
    } else {
      setIsLoading(true);
      await reauthenticate(formData.password)
        .then(async () => {
          await firebase
            .auth()
            .currentUser.updatePassword(formData.newPassword)
            .then(() => {
              isSetErrors = false;
              setIsLoading(false);
              setShowModal(false);
              firebase.auth().signOut();
            })
            .catch(() => {
              errorsTemp = {
                other: "Error al actualizar la contraseña",
              };
              setIsLoading(false);
            });
        })
        .catch(() => {
          errorsTemp = {
            password: "La contraseña no es correcta",
          };
          setIsLoading(false);
        });
    }
    isSetErrors && setErrors(errorsTemp);
  };

  return (
    <View style={styles.view}>
      <Input
        placeholder="Contraseña Actual"
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
      <Input
        placeholder="Nueva Contraseña"
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
        onChange={(e) => onChange(e, "newPassword")}
        errorMessage={errors.newPassword}
      />
      <Input
        placeholder="Repetir Nueva Contraseña"
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
        onChange={(e) => onChange(e, "repeatNewPassword")}
        errorMessage={errors.repeatNewPassword}
      />
      <Button
        title="Cambiar Contraseña"
        containerStyle={styles.btnContainer}
        buttonStyle={styles.btn}
        onPress={onSubmit}
        loading={isLoading}
      />
      <Text>{errors.other}</Text>
    </View>
  );
}

function defaultValue() {
  return {
    password: "",
    newPassword: "",
    repeatNewPassword: "",
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
