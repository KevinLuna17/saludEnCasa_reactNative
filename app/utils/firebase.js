import firebase from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyChX0hT6HjQpqb-EkDQRZeeFb-mu-Xg-Vg",
  authDomain: "saludencasa-fb2c7.firebaseapp.com",
  projectId: "saludencasa-fb2c7",
  storageBucket: "saludencasa-fb2c7.appspot.com",
  messagingSenderId: "831098518614",
  appId: "1:831098518614:web:c5e3aa477a5895731e0ff7",
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);
