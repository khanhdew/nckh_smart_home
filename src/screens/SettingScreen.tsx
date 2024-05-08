import {ScrollView, StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  Text,
  Button,
  Card,
  useTheme,
  Portal,
  Modal,
  TextInput,
} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import {
  authWithEmail,
  signInWithEmail,
  signUpWithEmail,
} from '../services/auth';
import {useDispatch} from 'react-redux';
import {addEmail, removeEmail} from '../redux/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [user, setUser] = useState();
  // Sign In / Sign Up
  const [signInEmail, setSignInEmail] = useState<string>('');
  const [signInPassword, setSignInPassword] = useState<string>('');
  const [passwordShow, setPasswordShow] = useState<boolean>(false);
  const [formMessage, setFormMessage] = useState<string>('');
  const [modalVisible, setModalVisible] = React.useState(false);

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  const handleLogin = mode => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!signInEmail) {
      setFormMessage('Vui lòng nhập email.');
      return;
    } else if (!emailRegex.test(signInEmail)) {
      setFormMessage('Vui lòng nhập đúng định dạng email.');
      return;
    } else if (!signInPassword) {
      setFormMessage('Vui lòng nhập mật khẩu.');
      return;
    } else if (signInPassword.length < 6) {
      setFormMessage('Mật khẩu có độ dài tối thiểu 6 kí tự.');
      return;
    }

    if (mode === 'login') {
      signInWithEmail(signInEmail, signInPassword);
    } else if ((mode = 'signup')) {
      signUpWithEmail(signInEmail, signInPassword);
    }
    dispatch(addEmail(signInEmail));

    setSignInEmail('');
    setSignInPassword('');

    hideModal();
  };

  const onAuthStateChanged = async user => {
    setUser(user);
    try {
      await AsyncStorage.setItem('user', JSON.stringify(user));
    } catch (err) {
      console.log(err);
    }
  };
  const getUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      setUser(JSON.parse(userData));
      if (userData.email) {
        dispatch(addEmail(user.email));
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    getUserData();
    return subscriber; // unsubscribe on unmount
  }, []);

  return (
    <ScrollView style={styles.screenContainer}>
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={hideModal}
          contentContainerStyle={styles.containerStyle}>
          <Text
            variant="titleLarge"
            style={{fontWeight: 'bold', alignSelf: 'center', marginBottom: 5}}>
            Đăng nhập / Đăng Ký
          </Text>
          <View style={{gap: 12}}>
            <TextInput
              label="Email"
              value={signInEmail}
              onChangeText={text => setSignInEmail(text)}
            />
            <TextInput
              label="Mật khẩu"
              value={signInPassword}
              onChangeText={text => setSignInPassword(text)}
              secureTextEntry={!passwordShow}
              right={
                <TextInput.Icon
                  onPress={() => setPasswordShow(!passwordShow)}
                  icon="eye"
                />
              }
            />
          </View>
          {formMessage && (
            <Text variant="labelSmall" style={{color: 'red'}}>
              {formMessage}
            </Text>
          )}
          <Button mode="contained" onPress={() => handleLogin('login')}>
            Đăng nhập
          </Button>
          <Button mode="text" onPress={() => handleLogin('signUp')}>
            Đăng ký
          </Button>
        </Modal>
      </Portal>

      <Card style={styles.accountCard}>
        <Card.Content style={{height: 100}}>
          {user && <Text variant="titleMedium">Xin chào, {user.email}</Text>}
        </Card.Content>
        <Card.Actions style={{alignSelf: 'flex-end'}}>
          {!user ? (
            <Button mode="text" textColor="#fff" onPress={showModal}>
              Đăng nhập
            </Button>
          ) : (
            <Button
              mode="text"
              textColor="#fff"
              onPress={() => {
                auth().signOut();
                dispatch(removeEmail());
              }}>
              Đăng xuất
            </Button>
          )}
        </Card.Actions>
      </Card>
      <View style={{marginTop: 20}}>
        <Button style={styles.settingItem}>
          <Text
            variant="titleMedium"
            onPress={() =>
              navigation.navigate('SettingItem', {type: 'deciceType'})
            }>
            Quản lý loại thiết bị
          </Text>
        </Button>
        <Button style={styles.settingItem}>
          <Text
            variant="titleMedium"
            onPress={() =>
              navigation.navigate('SettingItem', {type: 'location'})
            }>
            Quản lý vị trí
          </Text>
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    marginHorizontal: 10,
    marginTop: 10,
  },
  accountCard: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 170,
    backgroundColor: '#FBAB7E',
    padding: 10,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },
  settingItem: {
    alignItems: 'flex-start',
    marginVertical: 5,
    marginHorizontal: 5,
    backgroundColor: '#ada8a83c',
  },
  containerStyle: {
    backgroundColor: 'white',
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    gap: 15,
  },
});

export default SettingScreen;
