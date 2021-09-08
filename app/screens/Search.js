import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import Cita from "./Cita";
import { useNavigation } from "@react-navigation/core";

import { firebaseApp } from "../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

export default function Search() {
  //const navigation = useNavigation();
  //const [userInfo, setuserInfo] = useState(true);
  //Estado que guarda el agendamiento
  const [agendamientos, setAgendamientos] = useState([]);
  //const [horarios, setHorarios] = useState([]);

  //Obtener coleccion de agendamientos del usuario en tiempo Real
  //Si un usuario agrega otro agendamiento de otro servicio entonces
  //en tiempo real se renderiza y se muestra gracias a onSnapshot
  useEffect(() => {
    const obtenerAgendamientos = () => {
      //const ref = firebase.auth().currentUser.uid;
      db.collection("agendamientos")
        .where("createBy", "==", firebase.auth().currentUser.uid)
        .onSnapshot(manejarSnapshot);
      //db.collection("agendamientos").onSnapshot(manejarSnapshot);
    };
    obtenerAgendamientos();
  }, []);

  //Snapshot nos permite utilizar la base de datos en tiempo real de firestore
  function manejarSnapshot(snapshot) {
    const agendamiento = snapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });
    //Almacenar los resultados en el estado
    setAgendamientos(agendamiento);
    //console.log(agendamientos);
  }

  /*  Elimina los pacientes del Estado */
  const eliminarPaciente = (id) => {
    setAgendamientos((agendamientosActuales) => {
      return agendamientosActuales.filter((cita) => cita.id !== id); //Pequeño CallBack toma una copia del StateActual y lo filtra a la que deseamos eliminar y la quita
    });
  };
  /*        ******************        */

  /*  Reprograma los agendamiento del Estado */
  /* const reprogramarAgendamiento = (id) => {
    navigation.navigate("restaurants", { screen: "add-agendamiento" });
    const {
      pacienteNombre,
      tipoServicio,
      medico,
      telefono,
      fecha,
      hora,
      createAt,
    } = agendamientos;
    db.collection("agendamientos").doc(id).update({
      pacienteNombre,
      tipoServicio,
      medico,
      telefono,
      fecha,
      hora,
      createAt,
    });
  }; */
  /*        ******************        */

  /*  Actualiza los horarios del Agendamiento */
  const actualizarHorarios = (id) => {};
  /*        ******************        */

  /* Realizar en una función lo de si esta logeado o no y mandarselo como componente por Props a Cita */

  return (
    <View style={styles.contenedor}>
      {/* <Agendamiento /> */}
      <Text style={styles.titulo}>
        {agendamientos.length > 0
          ? "Administra tus citas"
          : "No tienes citas agendadas"}
      </Text>
      <FlatList
        data={agendamientos}
        renderItem={({ item }) => (
          //{}
          <Cita item={item} eliminarPaciente={eliminarPaciente} />
        )}
        keyExtractor={(cita) => cita.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    backgroundColor: "#fff",
    //backgroundColor: "#AA076B",
    flex: 1,
  },
  titulo: {
    color: "#000000",
    marginTop: 40,
    marginBottom: 20,
    fontSize: 24,
    //fontWeight: "bold",
    textAlign: "center",
  },
});
