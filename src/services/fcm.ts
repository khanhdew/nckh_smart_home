import messaging from '@react-native-firebase/messaging';
import {PermissionsAndroid} from 'react-native';

export const getFCMToken = async () => {
  const fcmToken = await messaging().getToken();
  console.log('🚀 ~ fcmToken:', fcmToken);

  return fcmToken;
};

export const requestUserNotificationPermission = () => {
  PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
};
