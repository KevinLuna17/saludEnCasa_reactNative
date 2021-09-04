import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { AirbnbRating, Button, Input } from "react-native-elements";
import Toast from "react-native-easy-toast";
import Loading from "../../components/Loading";

import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

export default function AddReviewServicio(props) {
  const { navigation, route } = props; //Estos son los props que me permiten obtener el ID del servicio
  const { idServicio } = route.params; //Destructuring para obtener el ID del servicio y saber con cual estamos trabajando

  /* Estados que guardarán cada uno de los datos del formulario */
  const [rating, setRating] = useState(null); //Estado que guarda la puntuación del Rating.
  const [titulo, setTitulo] = useState(""); //Estado que guarda el título del comentario.
  const [review, setReview] = useState(""); //Estado que guarda el comentario escrito.
  /*           *************        */
  const [isLoading, setIsLoading] = useState(false); //Estado que genera Spinner de cargando pantalla
  /* Creando referencia para el Toast que importamos y colocamos abajo del Componente Button */
  const toastRef = useRef();
  /*  *******************  */

  /* Funcion que se encarga de validar los datos del formulario y enviar dichos
  datos guardados en estados a Firebase */
  const addReview = () => {
    /* Validando los datos del formulario para luego enviar a Firebase */
    if (!rating) {
      toastRef.current.show(
        "No has dado ninguna puntuación al servicio médico",
        2000
      );
    } else if (!titulo) {
      toastRef.current.show("El título es obligatorio", 2000);
    } else if (!review) {
      toastRef.current.show("El comentario es obligatorio", 2000);
    } else {
      /* Envío de los datos del formulario ya validados a la coleccion creada en FireStore*/
      setIsLoading(true);
      const user = firebase.auth().currentUser; //Traemos los datos del usuario que está logeado para enviar el ID del usuario que está comentando
      const paylod = {
        idUser: user.uid, //ID único del usuario con el cual se lo identifica
        avatarUser: user.photoURL, //variable que trae el Avatar de usuario
        idServicio: idServicio, //variable del ID del Servicio traido por props haciendo destructuring
        titulo: titulo, // variable del Estado titulo
        review: review, // variable del Estado comentario
        rating: rating, // variable del estado de puntuaciones de rating
        createAt: new Date(),
      };
      /* Una vez que tengamos en la variable paylod todos los datos que enviaremos a la coleccion
      de FireStore a guardar entonces procedemos con: */
      db.collection("reseñas")
        .add(paylod)
        .then(() => {
          updateServicio();
        })
        .catch(() => {
          toastRef.current.show(
            "Error al enviar la reseña acerca del servicio médico",
            2000
          );
          setIsLoading(false);
        });
    }
  };

  //Obtener puntuacion del Servicio médico
  const updateServicio = () => {
    const servicioRef = db.collection("serviciosmedicos").doc(idServicio);

    servicioRef.get().then((response) => {
      const servicioData = response.data();
      const ratingTotal = servicioData.ratingTotal + rating;
      const quantityVoting = servicioData.quantityVoting + 1;
      const ratingResult = ratingTotal / quantityVoting;

      servicioRef
        .update({
          rating: ratingResult,
          ratingTotal,
          quantityVoting,
        })
        .then(() => {
          setIsLoading(false);
          navigation.goBack();
        });
    });
  };

  return (
    <View style={styles.viewBody}>
      <View style={styles.viewRating}>
        <AirbnbRating
          count={5}
          reviews={["Pésimo", "Deficiente", "Normal", "Muy Bueno", "Excelente"]}
          defaultRating={0}
          size={35}
          /* Funcion propia de AirbnbRating que se encarga de setear un valor
          a un estado que hayamos creado para guardar el Rating */
          onFinishRating={(value) => {
            setRating(value);
          }}
          /*   **************************     */
        />
      </View>
      <View style={styles.formReview}>
        <Input
          placeholder="Título"
          containerStyle={styles.input}
          /* onChange que se encarga de guardar el evento de lo escrito en el Input
        en la variable del estado setTitulo*/
          onChange={(e) => setTitulo(e.nativeEvent.text)}
          /*   ********************   */
        />
        <Input
          placeholder="Comentario..."
          multiline={true}
          inputContainerStyle={styles.textArea}
          /* onChange que se encarga de guardar el evento de lo escrito en el Input
        en la variable del estado setReview*/
          onChange={(e) => setReview(e.nativeEvent.text)}
          /*    ************************   */
        />
        <Button
          title="Enviar Comentario"
          containerStyle={styles.btnContainer}
          buttonStyle={styles.btn}
          onPress={addReview}
        />
      </View>
      <Toast ref={toastRef} position="center" opacity={0.9} />
      <Loading isVisible={isLoading} text="Enviando Comentario" />
    </View>
  );
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
  },
  viewRating: {
    height: 110,
    backgroundColor: "#f2f2f2",
  },
  formReview: {
    flex: 1,
    alignItems: "center",
    margin: 10,
    marginTop: 40,
  },
  input: {
    marginBottom: 10,
  },
  textArea: {
    height: 150,
    width: "100%",
    padding: 0,
    margin: 0,
  },
  btnContainer: {
    flex: 1,
    justifyContent: "flex-end",
    marginTop: 20,
    marginBottom: 10,
    width: "95%",
  },
  btn: {
    backgroundColor: "#00a680", //color verde corporativo
  },
});
