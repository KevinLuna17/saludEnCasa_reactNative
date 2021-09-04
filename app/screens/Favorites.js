import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Image, Icon, Button } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import Toast from "react-native-easy-toast";
import Loading from "../components/Loading";

/* Para importar la base de Datos de Firestore se hacen estas 3 importaciones */
import { firebaseApp } from "../utils/firebase";
import firebase from "firebase";
import "firebase/firestore";
/*   **********************   */

const db = firebase.firestore(firebaseApp);

export default function Favorites(props) {
  const { navigation } = props;
  const [servicios, setServicios] = useState(null);
  const [userLogged, setUserLogged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reloadData, setReloadData] = useState(false);
  const toastRef = useRef();

  /* Voy a poner en un UseEffect esta verificación de si el usuario está logeado */
  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      user ? setUserLogged(true) : setUserLogged(false);
    });
  }, []);
  /*             ********************************                /*
  

  /* Al hacer uso del useFocusEffect se trabaja en el Virtual DOM
una vez comprobado los cambios con el DOM real ahí se muestra la
pantalla al usuario renderizada o igual que antes dependiendo*/
  useFocusEffect(
    useCallback(() => {
      if (userLogged) {
        const idUser = firebase.auth().currentUser.uid;
        db.collection("favorites")
          .where("idUser", "==", idUser)
          .get()
          .then((response) => {
            const idServiciosArray = [];
            response.forEach((doc) => {
              idServiciosArray.push(doc.data().idServicio);
            });
            getDataServicio(idServiciosArray).then((response) => {
              const servicios = [];
              response.forEach((doc) => {
                const servicio = doc.data();
                servicio.id = doc.id;
                servicios.push(servicio);
              });
              setServicios(servicios);
            });
          });
      }
      setReloadData(false);
    }, [userLogged, reloadData])
  );
  /*           *******************************             */

  /* Espera a que se obtenga todos los datos de todos los servicios para 
  devolverlos con una promesa que es un array */
  const getDataServicio = (idServiciosArray) => {
    const arrayServicios = [];
    idServiciosArray.forEach((idServicio) => {
      const result = db.collection("serviciosmedicos").doc(idServicio).get();
      arrayServicios.push(result);
    });
    return Promise.all(arrayServicios);
  };
  /*           *****************             */

  if (!userLogged) {
    return <UserNotLogged navigation={navigation} />;
  }

  if (servicios?.length === 0) {
    return <NotFoundServicios />;
  }

  return (
    <View style={styles.viewBody}>
      {servicios ? (
        <FlatList
          data={servicios}
          renderItem={(servicio) => (
            <Servicio
              servicio={servicio}
              setIsLoading={setIsLoading}
              toastRef={toastRef}
              setReloadData={setReloadData}
              navigation={navigation}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <View style={styles.loaderServicios}>
          <ActivityIndicator size="large" />
          <Text style={{ textAlign: "center" }}>
            Cargando servicios médicos
          </Text>
        </View>
      )}
      <Toast ref={toastRef} position="center" opacity={0.9} />
      <Loading text="Eliminando servicio médico" isVisible={isLoading} />
    </View>
  );
}

function NotFoundServicios() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Icon type="material-community" name="alert-outline" size={50} />
      <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center" }}>
        No tienes servicios médicos en tu lista de favoritos
      </Text>
    </View>
  );
}

function UserNotLogged(props) {
  const { navigation } = props;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Icon type="material-community" name="alert-outline" size={50} />
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        Necesitas estar logeado para ver esta sección
      </Text>
      <Button
        title="Ir al login"
        containerStyle={{ marginTop: 20, width: "80%" }}
        buttonStyle={{ backgroundColor: "#00a680" }}
        onPress={() => navigation.navigate("account", { screen: "login" })}
      />
    </View>
  );
}

function Servicio(props) {
  const { servicio, setIsLoading, toastRef, setReloadData, navigation } = props;
  const { id, nombre, images } = servicio.item;

  const confirmRemoveFavorite = () => {
    Alert.alert(
      "Eliminar servicio médico de favorito",
      "¿Estas seguro de que quieres eliminar el servicio médico de favoritos?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: removeFavorite,
        },
      ],
      { cancelable: false }
    );
  };

  const removeFavorite = () => {
    setIsLoading(true);
    db.collection("favorites")
      .where("idServicio", "==", id)
      .where("idUser", "==", firebase.auth().currentUser.uid)
      .get()
      .then((response) => {
        response.forEach((doc) => {
          const idFavorite = doc.id;
          db.collection("favorites")
            .doc(idFavorite)
            .delete()
            .then(() => {
              setIsLoading(false);
              setReloadData(true);
              toastRef.current.show(
                "Servicio médico eliminado correctamente",
                2000
              );
            })
            .catch(() => {
              setIsLoading(false);
              toastRef.current.show(
                "Error al eliminar el servicio médico",
                2000
              );
            });
        });
      });
  };

  return (
    <View style={styles.servicio}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("restaurants", {
            screen: "servicio",
            params: { id },
          })
        }
      >
        <Image
          resizeMode="cover"
          style={styles.image}
          PlaceholderContent={<ActivityIndicator color="#fff" />}
          source={
            images[0]
              ? { uri: images[0] }
              : require("../../assets/img/no-image.png")
          }
        />
        <View style={styles.info}>
          <Text style={styles.name}>{nombre}</Text>
          <Icon
            type="material-community"
            name="heart"
            color="#f00"
            containerStyle={styles.favorite}
            onPress={confirmRemoveFavorite}
            underlayColor="transparent"
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
    //backgroundColor: "#f2f2f2",
    backgroundColor: "#fff",
  },
  loaderServicios: {
    marginTop: 10,
    marginBottom: 10,
  },
  servicio: {
    margin: 10,
  },
  image: {
    width: "100%",
    height: 180,
  },
  info: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: -30,
    backgroundColor: "#fff",
  },
  name: {
    fontWeight: "bold",
    fontSize: 30,
  },
  favorite: {
    marginTop: -35,
    backgroundColor: "#fff", //color blanco
    padding: 15,
    borderRadius: 100,
  },
});
