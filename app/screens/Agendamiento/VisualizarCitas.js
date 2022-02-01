import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { Icon, Button } from "react-native-elements";
import ListCitas from "../../components/Agendamiento/ListCitas";

//Firebase
import firebase from "firebase";

export default function VisualizarCitas(props) {
  const { navigation } = props;
  const [userLogged, setUserLogged] = useState(false);

  /* Voy a poner en un UseEffect esta verificación de si el usuario está logeado */
  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      user ? setUserLogged(true) : setUserLogged(false);
    });
  }, []);
  /*             ********************************                */

  if (!userLogged) {
    return <UserNotLogged navigation={navigation} />;
  } else {
    return <ListCitas navigation={navigation} />;
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
}
