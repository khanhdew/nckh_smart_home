import {View, Text, SafeAreaView, StyleSheet} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {useTheme} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../redux/store';
import {GreetingState, initGreetingInformation} from '../redux/greetingSlice';
import {addDevice, filterDeviceByLocation} from '../redux/deviceSlice';
import {getAllDevice} from '../services/firebase';
import Device from '../interfaces/device';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {addEmail} from '../redux/userSlice';

const HomeScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();

  const greetingData = useSelector<RootState, GreetingState>(
    state => state.greeting,
  );

  const getUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');

      if (JSON.parse(userData).email) {
        dispatch(addEmail(JSON.parse(userData).email));
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUserData();
    // Firestore
    getAllDevice().then(data => {
      if (data) {
        data.deviceList.forEach(item => {
          dispatch(addDevice({device: item}));
        });
      }
    });

    dispatch(filterDeviceByLocation());
    dispatch(initGreetingInformation());
  }, []);

  return (
    <SafeAreaView style={styles.screenContainer}>
      {/* Greeting and Information */}
      <View style={styles.greetingSection}>
        {/* Greeting and Time */}
        <View
          style={{
            backgroundColor: '#FFF2D7',
            padding: 10,
            height: 100,
            borderRadius: 10,
          }}>
          <Text style={styles.greetingText}>
            {greetingData.greetingMessage}
          </Text>
          <Text style={{...styles.greetingText, fontWeight: 500, fontSize: 20}}>
            {greetingData.time.fullTimeStr}
          </Text>
        </View>

        {/* Weather Condition Section */}
        <View style={styles.weatherConditionContainer}>
          <View
            style={{
              ...styles.weatherConditionCard,
              backgroundColor: '#F3CA52',
            }}>
            <Text>Nhiệt độ</Text>
            <Text style={styles.greetingText}>
              {greetingData.weatherCondition?.current.feelslike_c || '-- '}°C
            </Text>
          </View>
          <View
            style={{
              ...styles.weatherConditionCard,
              backgroundColor: '#68D2E8',
            }}>
            <Text>Độ ẩm</Text>
            <Text style={styles.greetingText}>
              {greetingData.weatherCondition?.current.humidity || '-- '}%
            </Text>
          </View>
        </View>
      </View>

      {/* Analytic */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    marginHorizontal: 10,
    marginTop: 10,
  },
  greetingSection: {
    gap: 20,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  weatherConditionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    overflow: 'scroll',
  },
  weatherConditionCard: {
    width: 80,
    height: 70,
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
    backgroundColor: '#ccc',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    flex: 1,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HomeScreen;
