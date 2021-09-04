import React, { useState } from "react";
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
import "react-native-get-random-values";
import { nanoid } from "nanoid";
import { validatePhone } from "../../utils/validations";
import Animbutton from "../../utils/animbutton";

import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

export default function AgendamientoForm({
  navigation,
  agendamientos,
  setAgendamientos,
}) {
  /*    Estados para guardar los campos del formulario    */
  const [pacienteNombre, guardarPacienteNombre] = useState("");
  const [medico, guardarMedico] = useState("");
  const [tipoServicio, guardarTipoServicio] = useState("");
  // Estado de la Ubicación GPS del Paciente
  const [telefono, guardarTelefono] = useState("");
  //Imprimimos el correo electrónico con el que se registró el paciente

  /*       ******************      */
  /* Estados para Guardar Fecha y Hora */
  const [fecha, guardarFecha] = useState("");
  //const [hora, guardarHora] = useState(""); Para DateTimePickerModal
  const [hora, guardarHora] = useState([]); //Picker
  /*     **************      */
  /* Estados que manejan el DateTimePickerModal para abrir, cerrar, guardar valores*/
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  /*     ******************    */

  //Funcion que muestra el DatePicker
  const showDatePicker = () => {
    setDatePickerVisibility(true);
    setTimeout(() =>
      Alert.alert(
        "Alerta", //Titulo de la alerta
        "¿Está seguro de la fecha de agendamiento seleccionada?", //Mensaje de la alerta
        [
          //Arreglo de botones
          {
            text: "Cancelar",
            onPress: () => showDatePicker,
            style: "cancel",
          },
          {
            text: "OK", //Arreglo de botones
          },
        ]
      )
    );
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

  //Crear nuevo registro de Agendamiento de Cita Médica
  const registrarAgendamiento = () => {
    /*Validaciones de los campos que vamos a registrar en Firebase
    y que enviaremos a la Screen de Visualizar Citas médicas Agendadas */
    if (
      pacienteNombre.trim() === "" ||
      tipoServicio.trim() === "" ||
      medico.trim() === "" ||
      telefono.trim() === "" ||
      fecha.trim() === "" ||
      hora.trim() === ""
    ) {
      //Falla la validación
      mostrarAlerta();

      return;
    } else if (!validatePhone(telefono)) {
      mostrarAlertaTelefono();
      return;
    } else {
      /* const cita = {
        pacienteNombre: pacienteNombre,
        tipoServicio: tipoServicio,
        medico: medico,
        telefono: telefono,
        fecha: fecha,
        hora: hora,
        createAt: new Date(),
        createBy: firebase.auth().currentUser.uid,
      }; */

      //Al guardar en la base de datos tenemos que asignarle un ID único de usuario
      //Crear ID de Agendamiento
      //cita.id = nanoid();
      //console.log(cita);

      db.collection("agendamientos")
        .add({
          pacienteNombre: pacienteNombre,
          tipoServicio: tipoServicio,
          medico: medico,
          telefono: telefono,
          fecha: fecha,
          hora: hora,
          createAt: new Date(),
          createBy: firebase.auth().currentUser.uid,
        })
        .then(() => {
          navigation.goBack();
        })
        .catch(() => {
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
      /* const agendamientosNuevos = [...agendamientos, cita];
      setAgendamientos(agendamientosNuevos); */
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

          {/* <View>
            <Text style={styles.label}>
              Seleccione el tipo de servicio médico que desea:
            </Text>
            <TextInput
              style={styles.input}
              onChangeText={(texto) => guardarTipoServicio(texto)} //Metodo que captura lo que se escribe en TextInput
            />
          </View> */}

          <View>
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
          </Picker>

          {/* <View>
            <Text style={styles.label}>
              Seleccione el profesional de salud:
            </Text>
            <TextInput
              style={styles.input}
              onChangeText={(texto) => guardarMedico(texto)} //Metodo que captura lo que se escribe en TextInput
            />
          </View> */}
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

          {/* <View>
            <Text style={styles.label}>Precio:</Text>
            <Input
              placeholder="Precio"
              containerStyle={styles.input}
              onChange={(e) => CAMPO DE LA BASE DEL COSTO (e.nativeEvent.text)}
              rightIcon={{
                type: "material-community",
                name: "currency-usd",
                color: "#00a680",
              }}
            />
          </View> */}

          <View>
            <TouchableHighlight
              style={styles.btnSubmit}
              onPress={() => registrarAgendamiento()}
            >
              <Text style={styles.textSubmit}>AGENDAR CITA</Text>
            </TouchableHighlight>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </>
  );
}

const styles = StyleSheet.create({
  formulario: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    //paddingVertical: 1,
    //marginHorizontal: "2.5%", //Permite ayudar a centrar el formulario de los TextInput
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
});
