import React from "react";
import { StyleSheet, View, ScrollView, Text, Image } from "react-native";
import { Button } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";

export default function UserGuest() {
  const navigation = useNavigation();

  return (
    <View style={styles.viewScreen}>
      <ScrollView centerContent={true} style={styles.viewBody}>
        <Image
          source={require("../../../assets/img/user-guest.jpg")}
          resizeMode="contain"
          style={styles.image}
        />
        <Text style={styles.title}>Consulta tu perfil de Salud en Casa</Text>
        <Text style={styles.description}>
          ¿Cómo describirías que sería tu mejor servicio médico a domicilio?
          Busca y visualiza los mejores profesionales de la salud de una forma
          rápida y sencilla, vota cual servicio médico a domicilio es tu
          preferido y comenta como ha sido tu experiencia.
        </Text>
        <View style={styles.viewBtn}>
          <Button
            title="Ver tu perfil"
            buttonStyle={styles.btnStyle}
            containerStyle={styles.btnContainer}
            onPress={() => navigation.navigate("login")}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  viewScreen: {
    backgroundColor: "#fff",
  },
  viewBody: {
    //backgroundColor: "#fff",
    marginLeft: 30,
    marginRight: 30,
  },
  image: {
    height: 300,
    width: "100%",
    marginBottom: 40,
    marginTop: 30,
  },
  title: {
    fontWeight: "bold",
    fontSize: 19,
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    textAlign: "center",
    marginBottom: 20,
  },
  viewBtn: {
    flex: 1,
    marginTop: 20,
    marginBottom: 80,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  btnStyle: {
    backgroundColor: "#00a680",
  },
  btnContainer: {
    width: "70%",
  },
});
