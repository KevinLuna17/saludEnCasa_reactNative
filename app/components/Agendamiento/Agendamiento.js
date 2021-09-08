/* Esta vista es de la pantalla de Servicios Médicos para visualizar el botón de Agendar Cita en el caso que esté logeado o no */
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-elements";

import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

export default function Agendamiento(props) {
  const { navigation, idServicio, nombreServicio } = props;
  const [userLogged, setUserLogged] = useState(false); //Estado que indica si el usuario está logeado o no

  useEffect(() => {
    //ELIMINAR USE EFFECT SI DA PROBLEMAS
    firebase.auth().onAuthStateChanged((user) => {
      user ? setUserLogged(true) : setUserLogged(false);
    });
  }, []);

  return (
    <View style={styles.btnAgendamiento}>
      {userLogged ? (
        <Button
          title="Agende su cita médica"
          buttonStyle={styles.btnAddReview}
          titleStyle={styles.btnTitleAddReview}
          icon={{
            type: "material-community",
            name: "calendar-clock",
            color: "#00a680",
          }}
          //En esta parte navegamos a esta Screen pero obteniendo el ID del servicio a través de props con AddReviewServicio
          onPress={() =>
            navigation.navigate("add-agendamiento", {
              idServicio: idServicio,
              nombreServicio: nombreServicio,
            })
          }
        />
      ) : (
        <View>
          <Text
            style={{ textAlign: "center", color: "#00a680", padding: 20 }}
            onPress={() => navigation.navigate("account", { screen: "login" })}
          >
            Para agendar una cita médica es necesario estar logeado{" "}
            <Text style={{ fontWeight: "bold" }}>
              pulsa AQUÍ para iniciar sesión
            </Text>
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  btnAddReview: {
    backgroundColor: "transparent",
  },
  btnTitleAddReview: {
    color: "#00a680",
  },
  btnAgendamiento: {
    marginTop: 10,
  },
});
