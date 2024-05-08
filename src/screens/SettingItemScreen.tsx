import {View, ScrollView} from 'react-native';
import {Divider, Text} from 'react-native-paper';
import React from 'react';
import {DEVICE_LOCATIONS, DEVICE_TYPES} from '../constants/device';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';

const SettingItemScreen = ({route}) => {
  const type = route.params?.type;
  const locationList = useSelector<
    RootState,
    {
      [key: string]: string;
    }
  >(state => state.deviceManager.locationList);
  const locationListForSelect = Object.entries(locationList).map(
    ([key, label]) => label,
  );
  const deviceTypeList = useSelector<
    RootState,
    {
      [key: string]: string;
    }
  >(state => state.deviceManager.deviceTypeList);
  const deviceTypeListForSelect = Object.entries(deviceTypeList).map(
    ([key, label]) => label,
  );
  const data =
    type === 'location' ? locationListForSelect : deviceTypeListForSelect;

  return (
    <ScrollView style={{paddingHorizontal: 10, paddingTop: 10}}>
      {data.map((item, index) => {
        return (
          <>
            <Text style={{marginVertical: 10, fontSize: 16}} key={index}>
              {item}
            </Text>
            <Divider />
          </>
        );
      })}
    </ScrollView>
  );
};

export default SettingItemScreen;
