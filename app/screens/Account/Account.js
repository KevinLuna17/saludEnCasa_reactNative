import React, { useState, useEffect } from "react";
import firebase from "firebase";
import Loading from "../../components/Loading";
import UserGuest from "./UserGuest";
import UserLogged from "./UserLogged";

export default function Account() {
  const [login, setLogin] = useState(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      !user ? setLogin(false) : setLogin(true); //Si usuario no tiene contenido entonces no está logeado, caso contrario Sí está logeado
    });
  }, []);

  if (login === null) return <Loading isVisible={true} text="Cargando..." />;

  return login ? <UserLogged /> : <UserGuest />; //Verificamos si el estado de Login no es nulo, entonces renderizamos componente UserLogged caso contrario UserGuest
}
