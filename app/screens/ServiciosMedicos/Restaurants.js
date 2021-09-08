import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Icon } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
//Importamos Firestore ya que ahí tenemos guardada nuestra base de datos de Servicios Medicos
import "firebase/firestore";
//Importaciones propias
import ListServicios from "../../components/ServiciosMedicos/ListServicios";

//Creamos variable con la que trabajaremos los datos de la Base de Servicios Médicos
const db = firebase.firestore(firebaseApp);

export default function Restaurants(props) {
  const { navigation } = props;
  const [user, setUser] = useState(null);
  //const [tipoUser, setTipoUser] = useState(null);
  const [servicios, setServicios] = useState([]); //Estado que trabaja con los Servicios Médicos registrados en Base
  const [totalServicios, setTotalServicios] = useState(0); //Con este estado vemos cuantos servicios médicos nos han llegado
  const [startServicios, setStartServicios] = useState(null); //Estado que ayuda a saber por donde debe empezar la iteracción del Scroll Infinito
  const [isLoading, setIsLoading] = useState(false);
  const limitServicios = 6;

  /* useEffect que verifica si el usuario está logeado se muestra el ícono de agregar Servicio Médico */
  useEffect(() => {
    firebase.auth().onAuthStateChanged((userInfo) => {
      setUser(userInfo);
    });
  }, []);
  /*             *****************************             */

  /* useEffect que verifica el tipo de usuario logeado para mostrar el ícono de agregar Servicio Médico */
  /* useEffect(() => {
    db.collection("usuarios")
      .where("tipouser", "==", "ADMIN")
      .get((userInfo) => {
        setTipoUser(userInfo);
      });
  }, []); */
  /*             *****************************             */

  /* Hacemos la petición para mostrar el listado de Servicios Médicos 
     Para este punto se obtienen de Base los Servicios Médicos registrados 
  */
  /* useFocusEffect hace Focus sobre el componente de Restaurants y vuelve a 
    ejecutar el hook, cargando asi el nuevo servicio creado en tiempo real*/
  useFocusEffect(
    useCallback(() => {
      db.collection("serviciosmedicos")
        .get()
        .then((snap) => {
          setTotalServicios(snap.size);
        });

      const resultServicios = [];

      db.collection("serviciosmedicos")
        .orderBy("createAt", "desc")
        .limit(limitServicios)
        .get()
        .then((response) => {
          /* Utilizamos Foreach para pasar por todos los datos y guardarlos 
           Guardar por donde va a empezar el Scroll Infinito para mostrar de 5 en 5 los servicios médicos y que FireStore sepa 
           desde donde comenzar en la siguiente interacción de 5 servicios más y para esto tenemos que crear el estado startServicios
        */
          setStartServicios(response.docs[response.docs.length - 1]); // .docs para obtener todos los documentos; lenght -1 para sacar el último del Array

          //El forEach devuelve el documento de la información del Servicio Médico registrado
          response.forEach((doc) => {
            //console.log(doc.data());
            // .data() para que la información del documento llegue más clara y no como Objetos
            //Asignación del ID del Servicio ya que no se devuelve en el Objeto
            //console.log(doc.id);
            // ID del Servicio se lo encuentra de esta manera
            const servicio = doc.data(); //Guardamos la información de los Servicios en esa variable
            servicio.id = doc.id;
            resultServicios.push(servicio);
          });
          setServicios(resultServicios); //resultServicios contiene el Array de Servicios Médicos
        });
    }, [])
  );
  /*         *************************************         */

  /* Función para cargar los Servicios que faltan en el Componente ListServicios */
  const handleLoadMore = () => {
    const resultServicios = [];
    servicios.lenght < totalServicios && setIsLoading(true);

    db.collection("serviciosmedicos")
      .orderBy("createAt", "desc")
      .startAfter(startServicios.data().createAt)
      .limit(limitServicios)
      .get()
      .then((response) => {
        if (response.docs.length > 0) {
          setStartServicios(response.docs[response.docs.length - 1]); // .docs para obtener todos los documentos; lenght -1 para sacar el último del Array
        } else {
          setIsLoading(false);
        }
        //En esta parte del codigo es que carga los servicios faltantes
        response.forEach((doc) => {
          const servicio = doc.data();
          servicio.id = doc.id;
          resultServicios.push(servicio);
        });
        setServicios([...servicios, ...resultServicios]);
        /*         ************          */
      });
  };
  /*           *********************************             */

  return (
    <View style={styles.viewBody}>
      <ListServicios
        servicios={servicios}
        handleLoadMore={handleLoadMore}
        isLoading={isLoading}
      />

      {user && (
        <Icon
          reverse
          type="material-community"
          name="plus"
          color="#00a680"
          containerStyle={styles.btnContainer}
          onPress={() => navigation.navigate("add-servicios")}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
    backgroundColor: "#fff",
  },
  btnContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
    shadowColor: "black",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
  },
});
