import React, { useState, useEffect, useCallback, useRef } from "react";
import { StyleSheet, Text, View, ScrollView, Dimensions } from "react-native";
import { map } from "lodash"; //Este map es para hacer iteraciones no de un MAPA
import { Rating, ListItem, Icon, Button } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import Toast from "react-native-easy-toast";
import Loading from "../../components/Loading";
import Carousel from "../../components/Carousel";
import Map from "../../components/Map";
import ListReviews from "../../components/ServiciosMedicos/ListReviews";

import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";
import Agendamiento from "../Agendamiento/Agendamiento";

const db = firebase.firestore(firebaseApp);
const screenWidth = Dimensions.get("window").width;

export default function Servicio(props) {
  const { navigation, route } = props;
  const { id, nombre } = route.params;
  const [servicio, setServicio] = useState(null); //Estado que obtiene coleccion de la Base de datos del servicio medico
  const [rating, setRating] = useState(0); //Estado que guarda puntuacion de los servicios medicos
  const [isFavorite, setIsFavorite] = useState(false); //Estado que indica si el servicio está en la lista de favoritos
  const [userLogged, setUserLogged] = useState(false); //Estado que indica si el usuario está logeado o no
  const toastRef = useRef(); //Referencia creada para el Toast que se importó

  /*useEffect de la Funcion que coloca titulo a la Screen*/
  useEffect(() => {
    navigation.setOptions({ title: nombre });
  }, []);
  /*           ******************             */

  /* Funcion que comprueba si el usuario está logeado para permitirle añadir a favoritos
   */
  //ELIMINAR USE EFFECT SI DA PROBLEMAS
  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      user ? setUserLogged(true) : setUserLogged(false);
    });
  }, []);

  /* ******************************************  */

  /* useEffect para poder traer la coleccion de datos de la Base*/
  useFocusEffect(
    useCallback(() => {
      db.collection("serviciosmedicos")
        .doc(id)
        .get()
        .then((response) => {
          const data = response.data();
          data.id = response.id;
          setServicio(data);
          setRating(data.rating);
        });
    }, [])
  );
  /*        ************************         */

  useEffect(() => {
    if (userLogged && servicio) {
      db.collection("favorites")
        .where("idServicio", "==", servicio.id)
        .where("idUser", "==", firebase.auth().currentUser.uid)
        .get()
        .then((response) => {
          if (response.docs.length === 1) {
            setIsFavorite(true);
          }
        });
    }
  }, [userLogged, servicio]);

  /* Funcion para añadir y eliminar de favoritos un servicio médico */
  /* Añadiendo a Firestore la colección de Favoritos */
  const addFavorite = () => {
    if (!userLogged) {
      toastRef.current.show(
        "Para usar el sistema de favoritos tienes que estar logeado",
        2000
      );
    } else {
      const payload = {
        idUser: firebase.auth().currentUser.uid,
        idServicio: servicio.id,
      };
      db.collection("favorites")
        .add(payload)
        .then(() => {
          setIsFavorite(true);
          toastRef.current.show("Servicio médico añadido a favoritos", 2000);
        })
        .catch(() => {
          toastRef.current.show(
            "Error al añadir el servicio médico a favoritos",
            2000
          );
        });
    }
  };

  const removeFavorite = () => {
    db.collection("favorites")
      .where("idServicio", "==", servicio.id)
      .where("idUser", "==", firebase.auth().currentUser.uid)
      .get()
      .then((response) => {
        response.forEach((doc) => {
          const idFavorite = doc.id;
          db.collection("favorites")
            .doc(idFavorite)
            .delete()
            .then(() => {
              setIsFavorite(false);
              toastRef.current.show(
                "Servicio médico eliminado de favoritos",
                2000
              );
            })
            .catch(() => {
              toastRef.current.show(
                "Error al eliminar el servicio médico de favoritos",
                2000
              );
            });
        });
      });
  };

  /*          ************************          */

  if (!servicio) return <Loading isVisible={true} text="Cargando..." />;

  return (
    <ScrollView vertical style={styles.viewBody}>
      <View style={styles.viewFavorite}>
        <Icon
          type="material-community"
          name={isFavorite ? "heart" : "heart-outline"}
          onPress={isFavorite ? removeFavorite : addFavorite}
          color={isFavorite ? "#f00" : "#000"}
          size={35}
          underlayColor="transparent"
        />
      </View>
      <Carousel
        arrayImages={servicio.images}
        height={250}
        width={screenWidth}
      />
      <TitleServicio
        nombre={servicio.nombre}
        description={servicio.description}
        rating={rating}
      />
      <ServicioInfo
        location={servicio.location}
        nombre={servicio.nombre}
        address={servicio.address}
      />
      <Agendamiento navigation={navigation} />
      <ListReviews navigation={navigation} idServicio={servicio.id} />
      <Toast ref={toastRef} position="center" opacity={0.9} />
    </ScrollView>
  );
}

/* Componente para mostrar nombre del Servicio y Puntuacion */
function TitleServicio(props) {
  const { nombre, description, rating } = props;

  return (
    <View style={styles.viewServicioTitle}>
      <View style={{ flexDirection: "row" }}>
        <Text style={styles.nombreServicio}>{nombre}</Text>
        <Rating
          style={styles.rating}
          imageSize={20}
          readonly
          startingValue={parseFloat(rating)}
        />
      </View>
      <Text style={styles.descriptionServicio}>{description}</Text>
    </View>
  );
}

/* */
function ServicioInfo(props) {
  const { location, nombre, address } = props;

  /* la funcion map de Lodash nos ayudara a iterar este ARRAY */
  const listInfo = [
    {
      text: address,
      iconName: "map-marker",
      iconType: "material-community",
      iconColor: "#00a680",
      action: null,
    },
    {
      text: "0982903220",
      iconName: "phone",
      iconType: "material-community",
      iconColor: "#00a680",
      action: null,
    },
    {
      text: "s.c_saludencasa@gmail.com",
      iconName: "at",
      iconType: "material-community",
      iconColor: "#00a680",
      action: null,
    },
  ];
  /*      ************       */

  return (
    <View style={styles.viewServicioInfo}>
      <Text style={styles.servicioInfoTitle}>
        Información sobre el servicio médico
      </Text>
      <Map location={location} nombre={nombre} height={100} />
      {map(listInfo, (item, index) => (
        <ListItem key={index} style={styles.containerListItem}>
          <Icon
            name={item.iconName}
            type={item.iconType}
            color={item.iconColor}
          />
          <ListItem.Content>
            <ListItem.Title>{item.text}</ListItem.Title>
          </ListItem.Content>
        </ListItem>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
    backgroundColor: "#fff",
  },
  viewServicioTitle: {
    padding: 15,
  },
  nombreServicio: {
    fontSize: 20,
    fontWeight: "bold",
  },
  descriptionServicio: {
    marginTop: 5,
    color: "grey",
  },
  rating: {
    position: "absolute",
    right: 0,
  },
  viewServicioInfo: {
    margin: 15,
    marginTop: 25,
    marginBottom: 1,
  },
  servicioInfoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  containerListItem: {
    borderBottomColor: "#d8d8d8",
    borderBottomWidth: 1,
  },
  viewFavorite: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 2,
    backgroundColor: "#fff", //color blanco
    borderBottomLeftRadius: 100,
    padding: 5,
    paddingLeft: 15,
  },
});
