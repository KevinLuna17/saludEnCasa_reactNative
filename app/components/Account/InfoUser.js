import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Avatar } from "react-native-elements";
//import firebase from "firebase";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";

//FIRESTORE
import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore"; //Importamos el firestore para la base de datos
const db = firebase.firestore(firebaseApp); //Le pasamos la configuración del firebaseApp

export default function InfoUser(props) {
  const {
    userInfo: { uid, photoURL, displayName, email },
    toastRef,
    setLoading,
    setLoadingText,
  } = props;
  //uid es un identificador único por usuario entonces se lo pasamos a userInfo para que sepa que usuario actualizar

  //Función que se encarga de pedir los permisos y obtener la imagen
  const changeAvatar = async () => {
    const resultPermission = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );
    const resultPermissionCamera =
      resultPermission.permissions.mediaLibrary.status;

    if (resultPermissionCamera === "denied") {
      toastRef.current.show("Es necesario aceptar los permisos de la galeria");
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (result.cancelled) {
        toastRef.current.show("Has cerrado la selección de imágenes");
      } else {
        uploadImage(result.uri)
          .then(() => {
            updatePhotoUrl();
          })
          .catch(() => {
            toastRef.current.show("Error al actualizar el avatar");
          });
      }
    }
  };

  //Función que se encarga de subir la imagen al Storage de firebase
  const uploadImage = async (uri) => {
    setLoadingText("Actualizando Avatar");
    setLoading(true);

    const response = await fetch(uri); //Devuelve el fichero de la uri
    const blob = await response.blob(); //Se usa await porque es una petición que devuelve una promesa

    const ref = firebase.storage().ref().child(`avatar/${uid}`); //Referenciamos para poder subirlo
    return ref.put(blob); //Devuelve la promesa por medio del return
  };

  //Función que actualiza el avatar en Screen InfoUser
  const updatePhotoUrl = () => {
    firebase
      .storage()
      .ref(`avatar/${uid}`)
      .getDownloadURL()
      .then(async (response) => {
        const update = {
          photoURL: response,
        };
        await firebase.auth().currentUser.updateProfile(update);
        setLoading(false); //Detiene spinner de Actualizando Avatar una vez esté actualizado
      })
      .catch(() => {
        toastRef.current.show("Error al actualizar el avatar");
      });
  };

  //Función para obtener el tipo de Usuario registrados ADMIN o USER
  /* const obtenerTipoUser = () => {
    db.collection("usuarios").where("createBy", "==", uid).get()
  };
 */
  return (
    <View style={styles.viewUserInfo}>
      <Avatar
        rounded
        size="large"
        onPress={changeAvatar}
        containerStyle={styles.userInfoAvatar}
        source={
          photoURL
            ? { uri: photoURL }
            : require("../../../assets/img/avatar-default.jpg")
        }
      >
        <Avatar.Accessory />
      </Avatar>

      <View>
        <Text style={styles.displayName}>
          {displayName ? displayName : "Anónimo"}
          {/* Si displayName tiene contenido muestra el nombre, caso contrario muestra Anónimo*/}
        </Text>
        <Text>
          {email ? email : "Social Login"}
          {/* Si el usuario tiene email lo muestra, caso contrario muestro Social Login ya que se registró de esa forma*/}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  viewUserInfo: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingBottom: 50,
  },
  userInfoAvatar: {
    height: 140,
    width: "40%",
    marginRight: 10,
  },
  displayName: {
    fontWeight: "bold",
    fontSize: 15,
    paddingTop: 20,
    paddingBottom: 10,
  },
});
