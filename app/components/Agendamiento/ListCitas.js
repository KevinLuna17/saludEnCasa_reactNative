import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import Citas from "../../screens/Agendamiento/Citas";

import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

export default function ListCitas(props) {
  const { navigation } = props;

  const [agendamientos, setAgendamientos] = useState([]);

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

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>
        {agendamientos.length > 0
          ? "Administra tus citas"
          : "No tienes citas agendadas"}
      </Text>
      <FlatList
        data={agendamientos}
        renderItem={({ item }) => (
          //{}
          <Citas item={item} eliminarPaciente={eliminarPaciente} />
        )}
        keyExtractor={(cita) => cita.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    backgroundColor: "#fff",
    flex: 1,
  },
  titulo: {
    color: "#000000",
    marginTop: 40,
    marginBottom: 20,
    fontSize: 24,
    textAlign: "center",
  },
});
