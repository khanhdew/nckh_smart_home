import React from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-paper';
import WebView from 'react-native-webview';

const BellCameraScreen = () => {
  return (
    <View style={{flex: 1}}>
      <WebView
        style={{
          flex: 1,
          borderBlockColor: '#000',
          backgroundColor: '#ccc',
        }}
        source={{
          uri: 'https://1062-14-162-241-59.ngrok-free.app/_capture',
        }}
      />
    </View>
  );
};

export default BellCameraScreen;
