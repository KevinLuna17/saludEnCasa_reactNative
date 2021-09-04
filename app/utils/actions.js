import { firebaseApp } from "./firebase";
//import { FireSQL } from "firesql";
import firebase from "firebase";
import "firebase/firestore";
import { validateEmail } from "./validations";
//import * as Notifications from 'expo-notifications'
//import Constans from 'expo-constants'

//import { fileToBlob } from './helpers'
//import { map } from 'lodash'
//import { Alert } from 'react-native'
//import { Platform } from 'react-native'

const db = firebase.firestore(firebaseApp);
//const fireSQL = new FireSQL(firebase.firestore(), { includeId: "id" });

/*

export const searchRestaurants = async(criteria) => {
    const result = { statusResponse: true, error: null, restaurants: [] }
    try {
        result.restaurants = await fireSQL.query(`SELECT * FROM restaurants WHERE name LIKE '${criteria}%'`)
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
}

export const getToken = async() => {
    if (!Constans.isDevice) {
        Alert.alert("Debes utilizar un dispositivo físico para poder utilizar las notificaciones.")
        return
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus
    if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync()
        finalStatus = status 
    }

    if (finalStatus !== "granted") {
        Alert.alert("Debes dar permiso para acceder a las notificaciones.")
        return
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data

    if (Platform.OS == "android") {
        Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C"
        })
    }

    return token
}

export const addDocumentWithId = async(collection, data, doc) => {
    const result = { statusResponse: true, error: null }
    try {
        await db.collection(collection).doc(doc).set(data)
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
}

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true
    })
 })

 export const startNotifications = (notificationListener, responseListener) => {
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        //console.log(notification)
    })   
    responseListener.current = Notifications.addNotificationResponseReceivedListener(notification => {
       // console.log(notification)
    })  
    return () => {
        Notifications.removeNotificationSubscription(notificationListener)
        Notifications.removeNotificationSubscription(responseListener)
    }
 }

export const sendPushNotification = async(message) => {
    let response = false
    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    }).then(() => response = true)
    return response
}

export const setNotificationMessage = (token, title, body, data) => {
    const message = {
        to: token,
        sound: "default",
        title: title,
        body: body,
        data: data
    }
  
    return message
}
 
export const getUsersFavorite = async(restaurantId) => {
    const result = { statusResponse: true, error: null, users: [] }
    try {
        const response = await db.collection("favorites").where("idRestaurant", "==", restaurantId).get()
        await Promise.all(
            map(response.docs, async(doc) => {
                const favorite = doc.data()
                const user = await getDocumentById("users", favorite.idUser)
                if (user.statusResponse) {
                    result.users.push(user.document)
                }
            })
        )
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result
} */

export const sendEmailResetPassword = async (email) => {
  const result = { statusResponse: true, error: null };
  try {
    await firebase.auth().sendPasswordResetEmail(email);
    /* if (!validateEmail(email)) {
      alert(
        "La contraseña debe ser de 8 a 12 dígitos y solo puede contener letras, números y guión."
      );
    } */
  } catch (error) {
    result.statusResponse = false;
    result.error = error;
  }
  return result;
};
