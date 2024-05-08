import messaging from '@react-native-firebase/messaging';
import {PermissionsAndroid} from 'react-native';
// Auth
import auth from '@react-native-firebase/auth';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
// Firestore
import firestore from '@react-native-firebase/firestore';

// FCM
export const getFCMToken = async () => {
  const fcmToken = await messaging().getToken();
  console.log('🚀 ~ fcmToken:', fcmToken);

  return fcmToken;
};

export const requestUserNotificationPermission = () => {
  PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
};

// Authentication
export const signInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const {idToken} = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    return await auth().signInWithCredential(googleCredential);
  } catch (error) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      // user cancelled the login flow
    } else if (error.code === statusCodes.IN_PROGRESS) {
      // operation (e.g. sign in) is in progress already
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      // play services not available or outdated
    } else {
      // some other error happened
    }
  }
};

// FireStore
export const getAllDevice = async () => {
  const deviceDocument = await firestore().collection('User').get();

  if (deviceDocument.empty) {
    return undefined;
  }

  return deviceDocument.docs[0]._data;
};
export const addADeviceToUser = async (email, device) => {
  const docRef = await firestore()
    .collection('User')
    .where('email', '==', email)
    .get();

  if (!docRef.empty) {
    docRef.docs.forEach(async doc => {
      await firestore()
        .collection('User')
        .doc(doc.id)
        .update({
          deviceList: firestore.FieldValue.arrayUnion(device),
        });
    });
  } else {
    await firestore()
      .collection('User')
      .add({
        email: email,
        deviceList: firestore.FieldValue.arrayUnion(device),
      });
  }
};

export const deleteDeviceFromUser = async (email, idDevice) => {
  const docRef = await firestore()
    .collection('User')
    .where('email', '==', email)
    .get();

  if (!docRef.empty) {
    docRef.docs.forEach(async doc => {
      const updatedDeviceList = doc
        .data()
        .deviceList.filter(device => device.id !== idDevice);
      await firestore().collection('User').doc(doc.id).update({
        deviceList: updatedDeviceList,
      });
    });
  }
};
