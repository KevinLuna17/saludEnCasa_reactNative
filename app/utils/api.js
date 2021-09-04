import firebase from "firebase";

/*Importamos firebase, obtenemos el usuario actual que está logeado
Llamamos a la función de firebase auth.EmailAuthProvider para que me devuelva
las credenciales del usuario que le pasamos con la contraseña actual y luego
estas credenciales que devuelve se las mandaremos a la funcion reauthenticateWithCredential
que es una función que vuelve a logear por credencial y si es correcto hace un reauthenticate*/

export function reauthenticate(password) {
  const user = firebase.auth().currentUser;
  const credentials = firebase.auth.EmailAuthProvider.credential(
    user.email,
    password
  );
  return user.reauthenticateWithCredential(credentials);
}
