import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet } from "react-native";
import Toast from "react-native-easy-toast";
import ListTopServicios from "../components/Ranking/ListTopServicios";

/* Para importar la base de Datos de Firestore se hacen estas 3 importaciones */
import { firebaseApp } from "../utils/firebase";
import firebase from "firebase";
import "firebase/firestore";
/*   **********************   */

const db = firebase.firestore(firebaseApp);

export default function TopRestaurants(props) {
  const { navigation } = props;
  const [servicios, setServicios] = useState([]);
  const toastRef = useRef();

  useEffect(() => {
    db.collection("serviciosmedicos")
      .orderBy("rating", "desc")
      .limit(5)
      .get()
      .then((response) => {
        const servicioArray = [];
        response.forEach((doc) => {
          const data = doc.data();
          data.id = doc.id;
          servicioArray.push(data);
        });
        setServicios(servicioArray);
      });
  }, []);

  return (
    <View style={styles.viewBody}>
      <ListTopServicios servicios={servicios} navigation={navigation} />
      <Toast ref={toastRef} position="center" opacity={0.9} />
    </View>
  );
}

const styles = StyleSheet.create({
  viewBody: {
    backgroundColor: "#fff",
  },
});
