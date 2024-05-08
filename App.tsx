/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import {Alert} from 'react-native';
// FCM
import messaging from '@react-native-firebase/messaging';
// Navigation
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DeviceInfoDetailScreen from './src/screens/DeviceInfoDetailScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from './src/screens/HomeScreen';
import DeviceManagerScreen from './src/screens/DeviceManagerScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import SettingScreen from './src/screens/SettingScreen';
// Other
import {Icon, MD3LightTheme, PaperProvider} from 'react-native-paper';
import BellCameraScreen from './src/screens/BellCameraScreen';
import {Provider, useDispatch} from 'react-redux';
import {AppDispatch, store} from './src/redux/store';
import {
  getAllDevice,
  getFCMToken,
  requestUserNotificationPermission,
} from './src/services/firebase';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import SettingItemScreen from './src/screens/SettingItemScreen';
import {addDevice} from './src/redux/deviceSlice';
import Device from './src/interfaces/device';

const AppCustomLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#DC6B19',
  },
};
//

const AppBottomNavigation = () => {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
      initialRouteName="App"
      screenOptions={{
        tabBarHideOnKeyboard: true,
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Trang chủ',
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({color, size}) => (
            <Icon source="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Device"
        component={DeviceManagerScreen}
        options={{
          title: 'Thiết bị',
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({color, size}) => (
            <Icon source="devices" color={color} size={size} />
          ),
        }}
      />
      {/* <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: 'Thông báo',
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({color, size}) => (
            <Icon source="bell" color={color} size={size} />
          ),
        }}
      /> */}
      <Tab.Screen
        name="Setting"
        component={SettingScreen}
        options={{
          title: 'Cài đặt',
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({color, size}) => (
            <Icon source="cog" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

function App(): React.JSX.Element {
  // Navigation
  const RootStack = createNativeStackNavigator();

  useEffect(() => {
    // Setting FCM
    requestUserNotificationPermission();
    getFCMToken();

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const messageData = JSON.stringify(remoteMessage);
      console.log('FCM: ', messageData);

      Alert.alert(
        messageData.notification.title,
        messageData.notification.body,
      );
    });
    // Setting Auth
    GoogleSignin.configure({
      webClientId:
        '786118704628-tkgc40j2od0qhclavmicpdv3quo5tnto.apps.googleusercontent.com',
    });

    return unsubscribe;
  }, []);

  return (
    <Provider store={store}>
      <PaperProvider theme={AppCustomLightTheme}>
        <NavigationContainer>
          <RootStack.Navigator
            screenOptions={{
              headerShown: false,
            }}>
            <RootStack.Screen name="App" component={AppBottomNavigation} />
            <RootStack.Screen
              name="DeviceDetailInfo"
              component={DeviceInfoDetailScreen}
              options={{
                headerShown: true,
                title: 'Chi tiết thiết bị',
              }}
            />
            <RootStack.Screen name="BellCamera" component={BellCameraScreen} />
            <RootStack.Screen
              name="SettingItem"
              options={{
                headerShown: true,
                title: 'Cài đặt',
              }}
              component={SettingItemScreen}
            />
          </RootStack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
}

export default App;
