import React, { useState, useRef } from "react";
import { View } from "react-native";
import Toast from "react-native-easy-toast";
import Loading from "../../components/Loading";
import AddServiciosForm from "../../components/ServiciosMedicos/AddServiciosForm";

export default function AddServicios(props) {
  const { navigation } = props;
  const [isLoading, setisLoading] = useState(false);
  const toastRef = useRef();

  return (
    <View>
      <AddServiciosForm
        toastRef={toastRef}
        setisLoading={setisLoading}
        navigation={navigation}
      />
      <Toast ref={toastRef} position="center" opacity={0.9} />
      <Loading isVisible={isLoading} text="Creando Servicio Médico" />
    </View>
  );
}
