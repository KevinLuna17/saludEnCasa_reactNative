/* 
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Alert,
  Dimensions,
  Text,
} from "react-native";
import { Icon, Avatar, Image, Input, Button } from "react-native-elements";
import { map, size, filter } from "lodash";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import MapView from "react-native-maps";
import uuid from "random-uuid-v4";
import Modal from "../Modal";
import CountryPicker from "react-native-country-picker-modal";
import { Picker } from "@react-native-community/picker";
import { validateEmail, validatePhone } from "../../utils/validations";

import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore"; //Importamos el firestore para la base de datos
const db = firebase.firestore(firebaseApp); //Le pasamos la configuración del firebaseApp

const widthScreen = Dimensions.get("window").width;

export default function AddServiciosForm(props) {
  const { toastRef, setisLoading, navigation } = props;
  const [country, setCountry] = useState("EC");
  const [callingCode, setCallingCode] = useState("593");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [nombreDr, setNombreDr] = useState("");
  const [serviciosName, setServiciosName] = useState("");
  const [serviciosAddress, setServiciosAddress] = useState("");
  const [serviciosDescription, setServiciosDescription] = useState("");
  const [costo, setCosto] = useState("");
  const [imagesSelected, setImagesSelected] = useState([]); //Se trabaja el estado de las imagenes como Array para poder contar cuantas imagenes subiremos al Storage, por medio del estado
  const [isVisibleMap, setIsVisibleMap] = useState(false); //Estado que permite trabajar con el icono de Mapa para abrir el Modal cuando se dé click en el
  const [locationServicios, setLocationServicios] = useState(null); //Estado que se encarga de guardar la ubicación del lugar una vez ubicado correctamente el Marker
 */

/* 
  const addServicios = () => {
    if (
      !nombreDr ||
      !serviciosName ||
      !serviciosAddress ||
      !serviciosDescription ||
      !costo ||
      !phone ||
      !email
    ) {
      toastRef.current.show(
        "Todos los campos del formulario son obligatorios",
        3000
      );
    }
    //Validación del correcto formato de número de teléfono del personal médico
    else if (!validatePhone(phone)) {
      toastRef.current.show(
        "Debes ingresar un número de teléfono válido",
        2000
      );
      //setError("El correo no es correcto");
    }
    //Validación del Correo Electrónico en correcto formato en el formulario
    else if (!validateEmail(email)) {
      toastRef.current.show("El correo electrónico no es correcto", 2000);
      //setError("El correo no es correcto");
    }
    //Caso contrario si el estado que contiene las imagenes cargadas es 0, es decir no hay imagenes cargadas presentamos un Toast
    else if (size(imagesSelected) === 0) {
      toastRef.current.show(
        "El servicio médico que está registrando debe tener al menos una foto",
        4000
      );
    } 
    */

//Si locationServicios es nulo, significa que el usuario no ha seleccionado una localización para registrar su servicio médico
/* else if (!locationServicios) {
      toastRef.current.show(
        "Tiene que localizar su consultorio médico en el mapa",
        3000
      );
    } */
//En este ELSE el usuario ha completado todos los campos del formulario

/* 
    else {
      setisLoading(true);
      uploadImageStorage().then((response) => {
        db.collection("serviciosmedicos")
          .add({
            nombreMedico: nombreDr,
            nombre: serviciosName,
            address: serviciosAddress,
            description: serviciosDescription,
            precioServicio: costo,
            callingCode: callingCode,
            phone: phone,
            email: email,
            location: locationServicios,
            images: response,
            rating: 0,
            ratingTotal: 0,
            quantityVoting: 0,
            createAt: new Date(),
            createBy: firebase.auth().currentUser.uid,
          })
          .then(() => {
            setisLoading(false);
            navigation.navigate("restaurants");
          })
          .catch(() => {
            setisLoading(false);
            toastRef.current.show(
              "Error al subir el servicio médico, inténtelo más tarde",
              3000
            );
          });
      });
    }
  }; 
  */

/*Función que se encarga de subir las Imagenes del servicio Médico registrado 
al Storage de Firebase. Función asincrona para que devuelva una promesa y de ese
modo poder decir termina de subir las fotos al Storage para yo luego continuar */

/*
  const uploadImageStorage = async () => {
    const imageBlob = [];

    //Promesa con await para que espere a que acabe el map, para luego hacer el return
    await Promise.all(
      /* El map lo que hace es actualizar al Array del estado imagesSelected y luego devolverlo todo junto
      Primero tiene que terminar el map para hacer el return de imageBlob*/
/*

      map(imagesSelected, async (image) => {
        const response = await fetch(image);
        const blob = await response.blob();
        const ref = firebase.storage().ref("serviciosmedicos").child(uuid()); //serviciosmedicos Es el nombre que se le dió a la carpeta en el Storage para guardar las imagenes
        /* En esta parte se sube la imagen*/
/*
        await ref.put(blob).then(async (result) => {
          //Para obtener la Url de las imagenes que se suben al Storage
          await firebase
            .storage()
            .ref(`serviciosmedicos/${result.metadata.name}`)
            .getDownloadURL()
            .then((photoUrl) => {
              imageBlob.push(photoUrl);
            });
        });
        
        /*     ********************     */

/*
     })
    );

    return imageBlob;
  };

  return (
    <ScrollView style={styles.scrollView}>
      <ImageServicioMedico imageServicioMedico={imagesSelected[0]} />
      <FormAdd
        nombreDr={nombreDr}
        setNombreDr={setNombreDr}
        serviciosName={serviciosName}
        setServiciosName={setServiciosName}
        setServiciosAddress={setServiciosAddress}
        setServiciosDescription={setServiciosDescription}
        setCosto={setCosto}
        setIsVisibleMap={setIsVisibleMap}
        locationServicios={locationServicios}
        country={country}
        setCountry={setCountry}
        callingCode={callingCode}
        setCallingCode={setCallingCode}
        phone={phone}
        setPhone={setPhone}
        setEmail={setEmail}
      />
      <UploadImage
        toastRef={toastRef}
        imagesSelected={imagesSelected}
        setImagesSelected={setImagesSelected}
      />
      <Button
        title="Crear Servicios Médicos"
        onPress={addServicios}
        buttonStyle={styles.btnAddServicios}
      />
      <Map
        isVisibleMap={isVisibleMap}
        setIsVisibleMap={setIsVisibleMap}
        setLocationServicios={setLocationServicios}
        toastRef={toastRef}
      />
    </ScrollView>
  );
}
/*

/*Función que muestra la imagen principal que será mostrada
en el formulario de Agregar Servicios Médicos*/

/*
function ImageServicioMedico(props) {
  const { imageServicioMedico } = props;

  return (
    <View style={styles.viewPhoto}>
      <Image
        source={
          imageServicioMedico
            ? { uri: imageServicioMedico }
            : require("../../../assets/img/no-image.png")
        }
        style={{ width: widthScreen, height: 200 }}
      />
    </View>
  );
}

function FormAdd(props) {
  const {
    nombreDr,
    setNombreDr,
    serviciosName,
    setServiciosName,
    country,
    setCountry,
    callingCode,
    setCallingCode,
    phone,
    setPhone,
    setEmail,
    setServiciosAddress,
    setServiciosDescription,
    setCosto,
    setIsVisibleMap,
    locationServicios,
  } = props;

  return (
    <View style={styles.viewForm}>
      {/* <Input
        placeholder="Ingrese sus Nombres Completos"
        containerStyle={styles.input}
        onChange={(e) => setNombreDr(e.nativeEvent.text)}
      /> */ //}

/*

      <Text style={styles.label}>Seleccione el profesional de salud:</Text>

      <Picker
        selectedValue={nombreDr}
        itemStyle={{ height: 120, backgroundColor: "#FFF" }}
        onValueChange={(itemValue, itemIndex) => setNombreDr(itemValue)}
      >
        <Picker.Item label="-- Seleccione --" value="" />
        <Picker.Item
          label="Dra. Mercedes Cardenas"
          value="Dra. Mercedes Cardenas"
        />
        <Picker.Item label="Lcdo. Ubaldo Sosa" value="Lcdo. Ubaldo Sosa" />
        <Picker.Item
          label="Lcdo. Reemberto Hernández"
          value="Lcdo. Reemberto Hernández"
        />
        <Picker.Item
          label="Lcda. Gexsys Frómeta"
          value="Lcda. Gexsys Frómeta"
        />
        <Picker.Item
          label="Aux. Isabel Terranova"
          value="Aux. Isabel Terranova"
        />
        <Picker.Item
          label="Aux. Cecibel González"
          value="Aux. Cecibel González"
        />
      </Picker>

      {/* <Input
        placeholder="Ingrese Nombre del Servicio Médico"
        containerStyle={styles.input}
        onChange={(e) => setServiciosName(e.nativeEvent.text)}
      /> */ //}
/*

      {/* <View> */ //}
/*
      <Text style={styles.label}>
        Seleccione el tipo de servicio médico que desea:
      </Text>
      {/* </View> */ //}
/*
      <Picker
        selectedValue={serviciosName}
        itemStyle={{ height: 120, backgroundColor: "#FFF" }}
        onValueChange={(itemValue, itemIndex) => setServiciosName(itemValue)}
      >
        <Picker.Item label="-- Seleccione --" value="" />
        <Picker.Item label="Ozonoterapia" value="Ozonoterapia" />
        <Picker.Item label="Suero Terapia" value="Suero Terapia" />
        <Picker.Item label="Terapia Física" value="Terapia Física" />
        <Picker.Item label="Inyecciones" value="Inyecciones" />
        <Picker.Item label="Cuidado a Pacientes" value="Cuidado a Pacientes" />
        <Picker.Item label="Geriatría" value="Geriatría" />
      </Picker>

      <Input
        placeholder="Dirección del Consultorio"
        containerStyle={styles.input}
        onChange={(e) => setServiciosAddress(e.nativeEvent.text)}
        rightIcon={{
          type: "material-community",
          name: "google-maps",
          color: locationServicios ? "#00a680" : "#c2c2c2",
          onPress: () => setIsVisibleMap(true),
        }}
      />
      <Input
        placeholder="Descripción del Servicio Médico"
        multiline={true}
        inputContainerStyle={styles.textArea}
        onChange={(e) => setServiciosDescription(e.nativeEvent.text)}
      />
      <Input
        placeholder="Costo del Servicio Médico"
        keyboardType="phone-pad"
        containerStyle={styles.inputCosto}
        onChange={(e) => setCosto(e.nativeEvent.text)}
        rightIcon={{
          type: "material-community",
          name: "currency-usd",
          color: "#00a680",
        }}
      />

      <View style={styles.phoneView}>
        <CountryPicker
          withFlag
          withCallingCode
          withFilter
          withCallingCodeButton
          containerStyle={styles.countryPicker}
          countryCode={country}
          onSelect={(country) => {
            //setCountry({ ...setCountry, country: country.cca2 });
            //setCallingCode({
            //...setCallingCode,
            //callingCode: country.callingCode[0],
            //});
            setCountry(country.cca2);
            setCallingCode(country.callingCode[0]);
          }}
        />
        <Input
          placeholder="WhatsApp de Contacto..."
          keyboardType="phone-pad"
          containerStyle={styles.inputPhone}
          onChange={(e) => setPhone(e.nativeEvent.text)}
        />
      </View>
      <Input
        placeholder="Correo Electrónico de Contacto"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCompleteType="email"
        onChange={(e) => setEmail(e.nativeEvent.text)}
      />
    </View>
  );
}
/*

/*Modal que se encargará de gestionar todo el Maps */
/*
function Map(props) {
  const { isVisibleMap, setIsVisibleMap, toastRef, setLocationServicios } =
    props;
  const [location, setLocation] = useState(null); //Guarda el estado de la localización

  /*Creamos un UseEffect que es donde vamos a trabajar la petición a la API
Hay que hacer una función asincrona para hacer peticiones await que esperen
a que devuelva la localización para continuar. Función anónimo autoejecutable*/
/*
  useEffect(() => {
    (async () => {
      const resultPermissions = await Permissions.askAsync(
        Permissions.LOCATION
      );
      const statusPermissions = resultPermissions.permissions.location.status;

      if (statusPermissions !== "granted") {
        toastRef.current.show(
          "Tienes que aceptar los permisos de localización para crear un servicio médico",
          3000
        );
      } else {
        const loc = await Location.getCurrentPositionAsync({}); //Actualmente da error
        //Forma correcta actualmente de manejar la dirección GPS
        /* const loc = await Location.getCurrentPositionAsync({
          //accuracy: Location.Accuracy.High,
        }); */
/*Este objeto se lo utilizará para el Mapa tiene que estar bien definido */
/*
        setLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        });
      }
    })();
  }, []);

  /*Función que guarda la Localización en el estado de setLocationServicios */
/*
  const confirmLocation = () => {
    setLocationServicios(location);
    toastRef.current.show("Localización guardada correctamente", 3000);
    setIsVisibleMap(false);
  };

  return (
    <Modal isVisible={isVisibleMap} setIsVisible={setIsVisibleMap}>
      <View>
        {location && (
          <MapView
            style={styles.mapStyle}
            initialRegion={location}
            showsUserLocation={true}
            onRegionChange={(region) => setLocation(region)}
          >
            <MapView.Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              draggable
            />
          </MapView>
        )}
        <View style={styles.viewMapBtn}>
          <Button
            title="Guardar Ubicación"
            containerStyle={styles.viewMapBtnContainerSave}
            buttonStyle={styles.viewMapBtnSave}
            onPress={confirmLocation}
          />
          <Button
            title="Cancelar Ubicación"
            containerStyle={styles.viewMapBtnContainerCancel}
            buttonStyle={styles.viewMapBtnCancel}
            onPress={() => setIsVisibleMap(false)}
          />
        </View>
      </View>
    </Modal>
  );
}

function UploadImage(props) {
  const { toastRef, imagesSelected, setImagesSelected } = props;

  const imageSelect = async () => {
    const resultPermissions = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );

    if (resultPermissions === "denied") {
      toastRef.current.show(
        "Es necesario aceptar los permisos de la galeria, si los has rechazado tienes que ir a ajustes y activarlos manualmente",
        3000
      );
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (result.cancelled) {
        toastRef.current.show(
          "Has cerrado la galería sin seleccionar ninguna imagen",
          2000
        );
      } else {
        setImagesSelected([...imagesSelected, result.uri]); //Con el ... Obtenemos el contenido de la imagen y se lo añadimos a nuestro estado y de este modo poder contar las imagenes
      }
    }
  };

  const removeImage = (image) => {
    const arrayImages = imagesSelected;

    Alert.alert(
      "Eliminar imagen",
      "¿Estás seguro de que quieres eliminar la imagen?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: () => {
            //Con setImagesSelected estamos actualizando el estado para con el filter poder eliminar la imagen que estamos seleccionando con el onPress de la miniatura del Avatar
            setImagesSelected(
              filter(arrayImages, (imageUrl) => imageUrl !== image) //Recorremos todo el Array de imagenes y con filter capturamos la que se parezca a la que estamos dando onPress y de ese modo la elimina
            );
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.viewImages}>
      {size(imagesSelected) < 4 && (
        <Icon
          type="material-community"
          name="camera"
          color="#7a7a7a"
          containerStyle={styles.containerIcon}
          onPress={imageSelect}
        />
      )}

      {map(imagesSelected, (imageServiciosMedicos, index) => (
        <Avatar
          key={index}
          containerStyle={styles.miniatureStyle}
          source={{ uri: imageServiciosMedicos }}
          onPress={() => removeImage(imageServiciosMedicos)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    height: "100%",
  },
  viewForm: {
    marginLeft: 10,
    marginRight: 10,
  },
  input: {
    marginTop: 10,
    marginBottom: 10,
  },
  textArea: {
    height: 100,
    width: "100%",
    padding: 0,
    margin: 0,
  },
  btnAddServicios: {
    backgroundColor: "#00a680",
    margin: 20,
  },
  viewImages: {
    flexDirection: "row",
    marginLeft: 20,
    marginRight: 20,
    marginTop: 30,
  },
  containerIcon: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    height: 70,
    width: 70,
    backgroundColor: "#e3e3e3",
  },
  miniatureStyle: {
    width: 70,
    height: 70,
    marginRight: 10,
  },
  viewPhoto: {
    alignItems: "center",
    height: 200,
    marginBottom: 20,
  },
  mapStyle: {
    width: "100%",
    height: 550,
  },
  viewMapBtn: {
    flexDirection: "row", //Un Botón alado del otro
    justifyContent: "center",
    marginTop: 10,
  },
  viewMapBtnContainerCancel: {
    paddingLeft: 5,
  },
  viewMapBtnCancel: {
    backgroundColor: "#a60d0d", //color rojo del Botón Cancelar
  },
  viewMapBtnContainerSave: {
    paddingRight: 5,
  },
  viewMapBtnSave: {
    backgroundColor: "#00a680", //color verde corporativo
  },
  phoneView: {
    width: "80%",
    flexDirection: "row",
  },
  inputPhone: {
    width: "80%",
  },
  inputCosto: {
    width: "80%",
  },
  label: {
    //fontWeight: "bold",
    fontSize: 18,
    //marginTop: 5,
  },
/*});*/
