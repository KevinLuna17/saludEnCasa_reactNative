/* Esta vista es de la pantalla de Servicios Médicos para visualizar el botón de Agendar Cita en el caso que esté logeado o no */
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  ScrollView,
} from "react-native";
import { Button, Input } from "react-native-elements";

import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Picker } from "@react-native-community/picker";
//Agregando Modal y Map View de Mapa de Google
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import MapView from "react-native-maps";
/*          **********        */
import { size } from "lodash"; //Como estamos trabajando con un ARRAY usamos lodash
import Modal from "../Modal";
import { validatePhone } from "../../utils/validations";

//Importaciones para trabajar con Firestore
import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";
import { map } from "lodash";

const db = firebase.firestore(firebaseApp);
/*        ******************      */

export default function AgendamientoForm({
  navigation,
  agendamientos,
  setAgendamientos,
  toastRef,
  setisLoading,
  idServicio,
  nombreServicio,
}) {
  //Estado para manejar el Modal del GPS localización de usuario
  const [isVisibleMap, setIsVisibleMap] = useState(false);
  const [locationServicios, setLocationServicios] = useState(null); //Estado que se encarga de guardar la ubicación del lugar una vez ubicado correctamente el Marker
  /*    Estados para guardar los campos del formulario    */
  const [pacienteNombre, guardarPacienteNombre] = useState("");
  const [medico, guardarMedico] = useState("");
  const [tipoServicio, guardarTipoServicio] = useState("");
  const [telefono, guardarTelefono] = useState("");
  const [direccionPaciente, guardarDireccionPaciente] = useState("");
  const [selectAgendamiento, setSelectAgendamientos] = useState([]);
  const [select, guardaSelect] = useState("");

  //Imprimimos el correo electrónico con el que se registró el paciente

  /*       ******************      */
  /* Estados para Guardar Fecha y Hora */
  const [fecha, guardarFecha] = useState("");
  //const [hora, guardarHora] = useState(""); Para DateTimePickerModal
  const [hora, guardarHora] = useState([]); //Picker
  /*     **************      */
  /* Estados que manejan el DateTimePickerModal para abrir, cerrar, guardar valores*/
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  //const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  /*     ******************    */

  //Funcion que muestra el DatePicker
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
  //Funcion que oculta el DatePicker
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  //Funcion que confirma la fecha seleccionada por el usuario y oculta el DatePicker
  const confirmarFecha = (date) => {
    const opciones = { year: "numeric", month: "long", day: "2-digit" };
    guardarFecha(date.toLocaleDateString("es_ES", opciones));
    hideDatePicker();
  };

  //Muestra el Time Picker
  /* const showTimePicker = () => {
    setTimePickerVisibility(true);
  }; */
  //Funcion que oculta el DatePicker
  /* const hideTimePicker = () => {
    setTimePickerVisibility(false);
  }; */
  //Funcion que confirma el horario seleccionada por el usuario y oculta el DatePicker
  /* const confirmarHorario = (hora) => {
    const opciones = { hour: "numeric", minute: "2 - digit", hour12: false };
    //const opciones = { hour: "numeric", minute: "2-digit" };
    guardarHora(hora.toLocaleString("es-ES", opciones));

    hideTimePicker();
  }; */

  /* useEffect(() => {
    const obtenerAgendamientos = () => {
      //const ref = firebase.auth().currentUser.uid;
      db.collection("agendamientos")
        .where("createBy", "==", firebase.auth().currentUser.uid)
        //.where("hora", "==", "hora")
        //.where("fecha", "==", )
        .onSnapshot(manejarSnapshot);
      //db.collection("agendamientos").onSnapshot(manejarSnapshot);
    };
    obtenerAgendamientos();
  }, []);

  //Snapshot nos permite utilizar la base de datos en tiempo real de firestore
  function manejarSnapshot(snapshot) {
    const agendamiento = snapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });
    //Almacenar los resultados en el estado
    setSelectAgendamientos(agendamiento);
    console.log(agendamiento);
  }
 */

  useEffect(() => {
    db.collection("agendamientos")
      .where("createBy", "==", firebase.auth().currentUser.uid)
      .onSnapshot((querySnapshot) => {
        const users = []; //Arreglo en el cual voy a ir llenando el recorrido del forEach

        querySnapshot.docs.forEach((doc) => {
          const { fecha } = doc.data();
          users.push({
            id: doc.id,
            fecha,
          });
        });
        setSelectAgendamientos(users);

        const index = selectAgendamiento.findIndex(
          (obj) => obj.fecha === "09/14/21"
        );
        //console.log(selectAgendamiento[index]);
        guardaSelect(selectAgendamiento[index]);

        /* const index = selectAgendamiento.findIndex(
          (obj) => obj.fecha === "09/14/21"
        );
        guardaSelect(selectAgendamiento[index]); */
        //console.log(selectAgendamiento[index]);

        //console.log(selectAgendamiento[index]);
      });
  }, []);

  /*  const getIndex = () => {
    
  }; */

  function validoAgendamiento() {
    //obtenerAgendamientos();
    /* if (size(fecha) > 0) {
      return true;
    } else {
      return false;
    } */
    /* setSelectAgendamientos.forEach((agendamiento) => {
      console.log(agendamiento.data());
    }); */
  }

  //Crear nuevo registro de Agendamiento de Cita Médica
  const registrarAgendamiento = () => {
    /*Validaciones de los campos que vamos a registrar en Firebase
    y que enviaremos a la Screen de Visualizar Citas médicas Agendadas */
    if (
      pacienteNombre.trim() === "" ||
      //tipoServicio.trim() === "" ||
      medico.trim() === "" ||
      telefono.trim() === "" ||
      direccionPaciente.trim() === "" ||
      fecha.trim() === "" ||
      hora.trim() === ""
    ) {
      //Falla la validación
      mostrarAlerta();

      return;
    } else if (!validatePhone(telefono)) {
      mostrarAlertaTelefono();
      return;
    } else if (select === fecha) {
      console.log(select);
      Alert.alert("Alerta", "Ya tiene Agendado cita en ese horario", [
        {
          text: "Aceptar",
        },
      ]);
    } /* else if (validoAgendamiento()) {
    /* else if (!locationServicios) {
      toastRef.current.show(
        "Tiene que localizar su consultorio médico en el mapa",
        3000
      );
    } */ else {
      db.collection("agendamientos")
        .add({
          pacienteNombre: pacienteNombre,
          idServicio: idServicio,
          //tipoServicio: tipoServicio,
          nombreServicio: nombreServicio,
          medico: medico,
          direccionPaciente: direccionPaciente,
          location: locationServicios,
          telefono: telefono,
          fecha: fecha,
          hora: hora,
          createAt: new Date(),
          createBy: firebase.auth().currentUser.uid,
        })
        .then(() => {
          setisLoading(false);
          navigation.goBack();
          /* Alert.alert(
            "Alerta",
            "¿Estás seguro haber llenado correctamente el agendamiento?",
            [
              {
                text: "Aceptar",
                onPress: () => navigation.goBack(),
              },
              {
                text: "Cancelar",
                style: "cancel",
              },
            ]
          ); */
        })
        .catch(() => {
          setisLoading(false);
          Alert.alert(
            "Error", //Titulo de la alerta
            "Problemas con la base de datos", //Mensaje de la alerta
            [
              {
                text: "OK", //Arreglo de botones
              },
            ]
          );
        });

      //Agregar al State
      //const agendamientosNuevos = [...agendamientos, cita];
      //setAgendamientos(agendamientosNuevos);
      //navigation.navigate("search");
    }
  };

  //Muestra la alerta si falla alguna validación
  const mostrarAlerta = () => {
    Alert.alert(
      "Error", //Titulo de la alerta
      "Todos los campos son obligatorios", //Mensaje de la alerta
      [
        {
          text: "OK", //Arreglo de botones
        },
      ]
    );
  };

  //Muestra la alerta si el numero de telefono es incorrecto
  const mostrarAlertaTelefono = () => {
    Alert.alert(
      "Error", //Titulo de la alerta
      "Número de teléfono inválido", //Mensaje de la alerta
      [
        {
          text: "OK", //Arreglo de botones
        },
      ]
    );
  };

  //Funcion cierra teclado en iOS
  const cerrarTeclado = () => {
    Keyboard.dismiss();
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={() => cerrarTeclado()}>
        <ScrollView style={styles.formulario}>
          <View>
            <Text style={styles.label}>Ingrese sus nombres completos:</Text>
            <TextInput
              style={styles.input}
              onChangeText={(texto) => guardarPacienteNombre(texto)} //Metodo que captura lo que se escribe en TextInput
            />
          </View>

          <View>
            <Text>Tipo de Servicio Médico que agenda:</Text>
            <Text>{nombreServicio}</Text>
          </View>

          {/*  <View>
            <Text style={styles.label}>
              Seleccione el tipo de servicio médico que desea:
            </Text>
          </View>
          <Picker
            selectedValue={tipoServicio}
            itemStyle={{ height: 120, backgroundColor: "#FFF" }}
            onValueChange={(itemValue, itemIndex) =>
              guardarTipoServicio(itemValue)
            }
          >
            <Picker.Item label="-- Seleccione --" value="" />
            <Picker.Item label="Ozonoterapia" value="Ozonoterapia" />
            <Picker.Item label="Suero Terapia" value="Suero Terapia" />
            <Picker.Item label="Terapia Física" value="Terapia Física" />
            <Picker.Item label="Inyecciones" value="Inyecciones" />
            <Picker.Item
              label="Cuidado a Pacientes"
              value="Cuidado a Pacientes"
            />
            <Picker.Item label="Geriatría" value="Geriatría" />
          </Picker> */}

          <View>
            <Text style={styles.label}>
              Seleccione el profesional de salud:
            </Text>
          </View>
          <Picker
            selectedValue={medico}
            itemStyle={{ height: 120, backgroundColor: "#FFF" }}
            onValueChange={(itemValue, itemIndex) => guardarMedico(itemValue)}
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

          <View>
            <Input
              placeholder="Ingrese su dirección de domicilio"
              containerStyle={styles.label}
              onChangeText={(texto) => guardarDireccionPaciente(texto)}
              //onChange={(e) => guardarDireccion(e.nativeEvent.text)}
              rightIcon={{
                type: "material-community",
                name: "google-maps",
                color: locationServicios ? "#00a680" : "#c2c2c2",
                onPress: () => setIsVisibleMap(true),
              }}
            />
          </View>

          <View>
            <Text style={styles.label}>Ingrese un teléfono de contacto:</Text>
            <TextInput
              style={styles.input}
              keyboardType="phone-pad"
              onChangeText={(texto) => guardarTelefono(texto)} //Metodo que captura lo que se escribe en TextInput
            />
          </View>

          <View>
            <Text style={styles.label}>Fecha:</Text>
            <Button
              title="Seleccionar Fecha de Agendamiento"
              onPress={showDatePicker}
              containerStyle={styles.btnContainerFecha}
              buttonStyle={styles.btnFecha}
            />
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={confirmarFecha}
              onCancel={hideDatePicker}
              locale="es_ES"
              headerTextIOS="Elige la Fecha"
              confirmTextIOS="Confirmar"
              cancelTextIOS="Cancelar"
            />
            <Text>{fecha}</Text>
          </View>

          <View>
            <Text style={styles.labelHora}>Hora:</Text>
            <Picker
              selectedValue={hora}
              itemStyle={{ height: 120, backgroundColor: "#FFF" }}
              onValueChange={(itemValue, itemIndex) => guardarHora(itemValue)}
            >
              <Picker.Item label="-- Seleccione --" value="" />
              <Picker.Item label="9:00am a 10:00am" value="9:00am a 10:00am" />
              <Picker.Item
                label="10:30am a 11:30am"
                value="10:30am a 11:30am"
              />
              <Picker.Item
                label="17:00pm a 18:00pm"
                value="17:00pm a 18:00pm"
              />
              <Picker.Item
                label="18:30am a 19:30am"
                value="18:30am a 19:30am"
              />
              <Picker.Item
                label="20:00pm a 21:00pm"
                value="20:00pm a 21:00pm"
              />
            </Picker>

            {/* <Button
              title="Seleccionar Hora de Agendamiento"
              onPress={showTimePicker}
              containerStyle={styles.btnContainerHora}
              buttonStyle={styles.btnHora}
            />

            <DateTimePickerModal
              isVisible={isTimePickerVisible}
              mode="time"
              onConfirm={confirmarHorario}
              onCancel={hideTimePicker}
              locale="es_ES"
              headerTextIOS="Elige una Hora"
              confirmTextIOS="Confirmar"
              cancelTextIOS="Cancelar"
            /> */}

            <Text>{hora}</Text>
          </View>

          <View>
            <TouchableHighlight
              style={styles.btnSubmit}
              onPress={() => registrarAgendamiento()}
            >
              <Text style={styles.textSubmit}>AGENDAR CITA</Text>
            </TouchableHighlight>
          </View>
          <Map
            isVisibleMap={isVisibleMap}
            setIsVisibleMap={setIsVisibleMap}
            setLocationServicios={setLocationServicios}
            toastRef={toastRef}
          />
        </ScrollView>
      </TouchableWithoutFeedback>
    </>
  );
}

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
        //const loc = await Location.getCurrentPositionAsync({enableHighAccuracy: true}); Da error con este modo
        //Forma correcta actualmente de manejar la dirección GPS
        let loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
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
*/

const styles = StyleSheet.create({
  formulario: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    //paddingVertical: 1,
    //marginHorizontal: "2.5%", //Permite ayudar a centrar el formulario de los TextInput
  },
  containerCard: {
    marginBottom: 30,
    borderWidth: 0,
  },
  label: {
    //fontWeight: "bold",
    fontSize: 18,
    marginTop: 20,
  },
  labelHora: {
    //fontWeight: "bold",
    fontSize: 18,
    marginTop: 5,
  },
  btnContainerFecha: {
    //marginTop: 20,
    flexDirection: "row",
    //width: "95%",
  },
  btnFecha: {
    justifyContent: "space-between",
    backgroundColor: "#2196F3",
    //backgroundColor: "#007AFF", color Azul default iOS
    //backgroundColor: "#841584", color morado revisar
  },
  btnContainerHora: {
    //marginTop: 20,
    flexDirection: "row",
    //width: "95%",
  },
  btnHora: {
    justifyContent: "space-between",
    backgroundColor: "#2196F3", //color Azul default Android
  },
  input: {
    marginTop: 10,
    height: 50,
    borderColor: "#e1e1e1",
    borderWidth: 1,
    borderStyle: "solid",
  },
  btnSubmit: {
    padding: 10,
    backgroundColor: "#00a680",
    marginVertical: 10,
    marginHorizontal: 40,
  },
  textSubmit: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
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
});
