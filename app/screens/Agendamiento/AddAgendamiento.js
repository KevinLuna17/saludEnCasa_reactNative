/* Esta vista es de la pantalla de Servicios Médicos para visualizar el botón de Agendar Cita en el caso que esté logeado o no */
import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import Toast from "react-native-easy-toast";
import AgendamientoForm from "../../components/Agendamiento/AgendamientoForm";
import Loading from "../../components/Loading";

//Importaciones para trabajar con Firestore
import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);
/*        ******************      */

export default function AddAgendamiento(props) {
  const { navigation, agendamientos, setAgendamientos, route } = props;
  //console.log(props);
  const { idServicio, nombreServicio } = route.params;
  //console.log(idServicio);
  const [isLoading, setisLoading] = useState(false);
  const toastRef = useRef();
  //const [servicios, setServicios] = useState(null);

  return (
    <>
      <View>
        <AgendamientoForm
          navigation={navigation}
          agendamientos={agendamientos}
          setAgendamientos={setAgendamientos}
          toastRef={toastRef}
          setisLoading={setisLoading}
          idServicio={idServicio}
          nombreServicio={nombreServicio}
        />
        <Toast ref={toastRef} position="center" opacity={0.9} />
        <Loading
          isVisible={isLoading}
          text="Agendando cita médica a domicilio"
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({});
