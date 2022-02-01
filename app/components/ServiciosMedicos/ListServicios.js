/* Componente que Renderiza el Listado de Servicios Médicos */
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Image } from "react-native-elements";
import { size } from "lodash"; //Como estamos trabajando con un ARRAY usamos lodash
import { useNavigation } from "@react-navigation/native"; //Con este Hook podemos hacer navegaciones de una screen a otra

export default function ListServicios(props) {
  const { servicios, handleLoadMore, isLoading } = props; //Recibe el Array de Servicios Médicos por medio de props
  const navigation = useNavigation();

  //ActivityIndicator es para realizar un SPINNER
  // onEndReachedThreshold={0.5} Antes de llegar al pie ahí se ejecuta la función de completar los demás servicios faltantes
  return (
    <View>
      {size(servicios) > 0 ? (
        <FlatList
          data={servicios}
          renderItem={(servicio) => (
            <ServicioMedico servicio={servicio} navigation={navigation} />
          )}
          keyExtractor={(item, index) => index.toString()}
          onEndReachedThreshold={0.5}
          onEndReached={handleLoadMore}
          ListFooterComponent={<FooterList isLoading={isLoading} />}
        />
      ) : (
        <View style={styles.loaderServicios}>
          <ActivityIndicator size="large" color="#00ff00" />
          <Text>Cargando servicios</Text>
        </View>
      )}
    </View>
  );
}

//Componente renderItem del FlatList, en cada iteracion renderiza un componente con diferentes datos
function ServicioMedico(props) {
  const { servicio, navigation } = props;

  //Destructuring para poder obtener la imagen del Objeto que nos llega de Base
  const {
    id,
    images,
    nombre,
    nombreMedico,
    address,
    description,
    precioServicio,
  } = servicio.item;
  //Este error en la aplicacion es porque la imagen no se maneja como un objeto
  const imageServicio = images[0];
  //const imageServicio = images;
  /*    *******************    */

  const goServicio = () => {
    navigation.navigate("servicio", {
      id,
      nombre,
    });
  };

  return (
    <TouchableOpacity onPress={goServicio}>
      <View style={styles.viewServicio}>
        <View style={styles.viewServicioImagen}>
          <Image
            resizeMode="cover"
            PlaceholderContent={<ActivityIndicator color="fff" />}
            source={
              imageServicio
                ? { uri: imageServicio }
                : require("../../../assets/img/no-image.png")
            }
            style={styles.imageServicio}
          />
        </View>
        <View>
          <Text style={styles.servicioNombre}>{nombre}</Text>
          <Text>{nombreMedico}</Text>
          <Text style={styles.servicioAddress}>Dirección: {address}</Text>
          <Text style={styles.servicioDescription}>
            {description.substr(0, 60)}...
          </Text>
          <Text style={styles.servicioPrecio}>Precio: ${precioServicio}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
/*     *********************       */

/* List Footer Component */
function FooterList(props) {
  const { isLoading } = props;

  if (isLoading) {
    return (
      <View style={styles.loaderServicios}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  } else {
    return (
      <View style={styles.notFoundServicios}>
        <Text>No quedan servicios médicos por cargar</Text>
      </View>
    );
  }
}
/*    ************      */

const styles = StyleSheet.create({
  loaderServicios: {
    marginTop: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  viewServicio: {
    flexDirection: "row", //Para que se vea una línea
    margin: 10,
  },
  viewServicioImagen: {
    marginTop: 7,
    marginRight: 15,
    marginLeft: 5,
  },
  imageServicio: {
    width: 100,
    height: 100,
  },
  servicioNombre: {
    fontWeight: "bold",
    fontSize: 15,
  },
  servicioAddress: {
    paddingTop: 2, //Para separarlo del Nombre del Servicio
    color: "grey",
    width: 300,
  },
  servicioDescription: {
    paddingTop: 2, //Para separarlo del Address del Servicio
    color: "grey",
    width: 300,
  },
  servicioPrecio: {
    paddingTop: 2, //Para separarlo del Nombre del Servicio
    color: "grey",
  },
  notFoundServicios: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: "center",
  },
});
