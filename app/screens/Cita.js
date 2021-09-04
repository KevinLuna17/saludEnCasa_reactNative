import React from "react";
import { StyleSheet, Text, View, TouchableHighlight } from "react-native";

export default function Cita({ item, eliminarPaciente }) {
  //Función que muestra un dialogo si desea Eliminar el agendamiento
  const dialogoEliminar = (id) => {
    //console.log("Eliminando Agendamiento", id);
    eliminarPaciente(id);
  };
  /*        *******************       */

  return (
    <View style={styles.cita}>
      <View>
        <Text style={styles.label}>Paciente: </Text>
        <Text style={styles.texto}>{item.pacienteNombre}</Text>
      </View>

      <View>
        <Text style={styles.label}>Tipo de Servicio: </Text>
        <Text style={styles.texto}>{item.tipoServicio}</Text>
      </View>

      <View>
        <Text style={styles.label}>Nombre del Médico: </Text>
        <Text style={styles.texto}>{item.medico}</Text>
      </View>

      <View>
        <Text style={styles.label}>Teléfono de Contacto: </Text>
        <Text style={styles.texto}>{item.telefono}</Text>
      </View>

      <View>
        <Text style={styles.label}>Fecha de Agendamiento: </Text>
        <Text style={styles.texto}>{item.fecha}</Text>
      </View>

      <View>
        <Text style={styles.label}>Horario: </Text>
        <Text style={styles.texto}>{item.hora}</Text>
      </View>

      <View>
        <TouchableHighlight
          style={styles.btnEliminar}
          onPress={() => dialogoEliminar(item.id)}
        >
          <Text style={styles.textEliminar}>Eliminar &times;</Text>
        </TouchableHighlight>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cita: {
    backgroundColor: "#fff",
    borderBottomColor: "#e1e1e1",
    borderStyle: "solid",
    borderBottomWidth: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  label: {
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 20,
  },
  texto: {
    fontSize: 18,
  },
  btnEliminar: {
    padding: 10,
    backgroundColor: "red",
    marginVertical: 10,
  },
  textEliminar: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});
