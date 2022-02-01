import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import { Picker } from "@react-native-community/picker";
//import { Picker } from "@react-native-picker/picker";
import md5, { str_md5 } from "react-native-md5";
import Loading from "../Loading";
import { validateEmail, validateContrasena } from "../../utils/validations";
import { size, isEmpty } from "lodash";
//import firebase from "firebase";
import { useNavigation } from "@react-navigation/native";

//FIRESTORE
import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore"; //Importamos el firestore para la base de datos
import darkColors from "react-native-elements/dist/config/colorsDark";
const db = firebase.firestore(firebaseApp); //Le pasamos la configuración del firebaseApp

export default function RegisterForm(props) {
  const { toastRef } = props; //Se hace destructuring para recuperar nuestra Referencia de los props que lo habiamos llamado toastRef
  const [showPassword, setShowPassword] = useState(false); //Llegan 2 estados como false para decirles que la contraseña llega como oculta
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  //Estados de errores en cada input
  const [errorUsuario, setErrorUsuario] = useState(
    "Escriba un nombre y un apellido"
  );
  const [errorEmail, setErrorEmail] = useState(null);
  const [errorPassword, setErrorPassword] = useState(
    "La contraseña tiene que ser de 8 a 12 dígitos y solo puede contener letras, números y guión."
  );
  const [errorRepeatPassword, setErrorRepeatPassword] = useState(
    "La contraseña tiene que ser de 8 a 12 dígitos y solo puede contener letras, números y guión."
  );
  const [errorTipoUser, setErrorTipoUser] = useState(
    "Debes elegir un tipo de usuario: Médico o Paciente."
  );

  /* Estados de FireStore */
  const [usuario, setUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [tipoUser, setTipoUser] = useState("");
  /*    **********    */
  const navigation = useNavigation();

  const onSubmit = () => {
    clearErrors();
    let isValid = true;
    //Validaciones
    if (!tipoUser || !email || !password || !repeatPassword) {
      toastRef.current.show("Todos los campos son obligatorios", 2000);
    } else if (!validateEmail(email)) {
      setErrorEmail("Debes ingresar un correo electrónico válido.");
      isValid = false;
    } else if (password !== repeatPassword) {
      toastRef.current.show("Las contraseñas tienen que ser iguales", 2000);
    } /* else if (size(password) < 8) {
      toastRef.current.show(
        "La contraseña tiene que tener al menos 8 caracteres",
        2000
      );
    } */ else if (!validateContrasena(password)) {
      setErrorPassword(errorPassword);
      setErrorRepeatPassword(errorRepeatPassword);
      isValid = false;
      Alert.alert(
        "Error",
        "La contraseña debe ser de 8 a 12 dígitos y solo puede contener letras, números y guión."
      );
    } else {
      setLoading(true);

      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
          setLoading(false);
          db.collection("usuarios").add({
            nombre: usuario,
            correo: email,
            contrasena: str_md5(password),
            createAt: new Date(),
            tipouser: tipoUser,
            createBy: usuario,
            estado: "DC",
            //createBy: firebase.auth().currentUser.uid,
          });
          navigation.navigate("login");
        })
        .catch(() => {
          setLoading(false);
          toastRef.current.show(
            "El email ya está en uso, pruebe con otro",
            2000
          );
        });

      //Aquí tenía el add de Usuarios
      /*       ************************         */
      // Agregando datos a FireStore Tabla Usuarios
      /* db.collection("usuarios")
        .add({
          correo: email,
          contrasena: str_md5(password),
          createAt: new Date(),
          tipouser: tipoUser,
          createBy: firebase.auth().currentUser.uid,
        })
        .then(() => {
          setLoading(false);
          //navigation.navigate("login");
        })
        .catch(() => {
          setLoading(false);
          toastRef.current.show(
            "Error al registrar el usuario, inténtelo más tarde",
            2000
          );
        }); */
      /*        *************************        */
    }
    return isValid;
  };

  //Limpia la pantalla de los errores seteados en estados
  const clearErrors = () => {
    setErrorUsuario(null);
    setErrorEmail(null);
    setErrorPassword(null);
    setErrorRepeatPassword(null);
    setErrorTipoUser(null);
  };

  //Función que oculta el teclado al dar click en cualquier otra parte
  const ocultarTeclado = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={() => ocultarTeclado()}>
      <View style={styles.viewPickerUser}>
        <Picker
          selectedValue={tipoUser}
          itemStyle={{ height: 120, backgroundColor: "#FFF" }}
          onValueChange={(itemValue, itemIndex) => setTipoUser(itemValue)}
        >
          <Picker.Item label="-- Seleccione Tipo de Usuario --" value="" />
          <Picker.Item label="Médico" value="MEDICO" />
          <Picker.Item label="Paciente" value="USER" />
        </Picker>
        <View style={styles.formContainer}>
          <Input
            placeholder="Nombre de Usuario"
            containerStyle={styles.inputForm}
            autoCapitalize="none"
            //onChange={(e) => onChange(e, "email")}
            onChange={(e) => setUsuario(e.nativeEvent.text)}
            errorMessage={errorUsuario}
            rightIcon={
              <Icon
                type="material-community"
                name="account-circle"
                iconStyle={styles.iconRightEmail}
              />
            }
          />
          <Input
            placeholder="Correo Electrónico"
            keyboardType="email-address"
            containerStyle={styles.inputForm}
            autoCapitalize="none"
            autoCompleteType="email"
            //onChange={(e) => onChange(e, "email")}
            onChange={(e) => setEmail(e.nativeEvent.text)}
            errorMessage={errorEmail}
            rightIcon={
              <Icon
                type="material-community"
                name="at"
                iconStyle={styles.iconRightEmail}
              />
            }
          />
          <Input
            placeholder="Contraseña"
            containerStyle={styles.inputForm}
            autoCapitalize="none"
            password={true}
            secureTextEntry={showPassword ? false : true} //Si showPassword es true significa que la contraseña tiene que verse
            //onChange={(e) => onChange(e, "password")}
            onChange={(e) => setPassword(e.nativeEvent.text)}
            errorMessage={errorPassword}
            rightIcon={
              <Icon
                type="material-community"
                name={showPassword ? "eye-off-outline" : "eye-outline"} //Si showPassword es true me vas a mostrar el icono del ojo tachado para decirle que ahora tiene que ocultar contraseña
                iconStyle={styles.iconRightPassword}
                onPress={() => setShowPassword(!showPassword)} //Actualizamos al valor contrario de showPassword, es decir si es true lo mandamos como False y viceversa, por eso va con !
              />
            }
          />
          <Input
            placeholder="Repetir Contraseña"
            containerStyle={styles.inputForm}
            autoCapitalize="none"
            password={true}
            secureTextEntry={showRepeatPassword ? false : true} //Si ShowRepeatPassword es true lo que tiene que hacer es mostrar la contraseña por lo cual secureTextEntry es false
            //onChange={(e) => onChange(e, "repeatPassword")}
            onChange={(e) => setRepeatPassword(e.nativeEvent.text)}
            errorMessage={errorRepeatPassword}
            rightIcon={
              <Icon
                type="material-community"
                name={showRepeatPassword ? "eye-off-outline" : "eye-outline"}
                iconStyle={styles.iconRightPassword}
                onPress={() => setShowRepeatPassword(!showRepeatPassword)}
              />
            }
          />
        </View>
        <Button
          title="Unirse"
          containerStyle={styles.btnContainerRegister}
          buttonStyle={styles.btnRegister}
          onPress={onSubmit}
        />

        <Loading isVisible={loading} text="Creando Cuenta" />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  viewPickerUser: {
    marginTop: 20,
    //backgroundColor: "#fff",
  },
  formContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  inputForm: {
    width: "100%",
    marginTop: 20,
  },
  btnContainerRegister: {
    marginTop: 20,
    marginBottom: 15,
    width: "95%",
  },
  btnRegister: {
    backgroundColor: "#00a680",
  },
  iconRightEmail: {
    color: "#808080", //color gris fuerte
    //color: "#000000", color negro
    // color verde #00a680
  },
  iconRightPassword: {
    color: "#808080",
  },
  iconRightTipoUser: {
    color: "#808080",
  },
});
