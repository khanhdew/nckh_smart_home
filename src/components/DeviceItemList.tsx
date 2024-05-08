import React, {useEffect, useState} from 'react';
import {
  Button,
  Card,
  Icon,
  IconButton,
  Text,
  useTheme,
} from 'react-native-paper';
import Device from '../interfaces/device';
import {useNavigation} from '@react-navigation/native';
import type {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../interfaces/reactNavigation';
import {Alert, View} from 'react-native';
import {
  DEVICE_LOCATIONS,
  DEVICE_TYPES,
  DEVICE_TYPE_ICON,
} from '../constants/device';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../redux/store';
import {
  changeDeviceQuickAction,
  filterDeviceByLocation,
} from '../redux/deviceSlice';
import Slider from '@react-native-community/slider';
import {TriangleColorPicker, toHsv, fromHsv} from 'react-native-color-picker';

interface IProps {
  deviceUuid: string;
}
type DeviceDetailScreenProps = RouteProp<RootStackParamList, 'deviceDetail'>;

const DeviceItemList = ({deviceUuid}: IProps) => {
  const navigation = useNavigation<DeviceDetailScreenProps>();
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const device: Device | undefined = useSelector<RootState, Device[]>(
    state => state.device.listDevice,
  ).find(device => device.uuid === deviceUuid);
  const [changedDevice, setChangedDevice] = useState<Device>(device);
  const [lightDimValue, setLightDimValue] = useState<number>(0);
  const [lightColor, setLightColor] = useState(toHsv('white'));

  const deviceInfoHandle = (): void => {
    navigation.navigate('DeviceDetailInfo', {
      device: device,
    });
  };

  const handleGoToWebview = () => {
    navigation.navigate('BellCamera');
  };

  useEffect(() => {
    dispatch(changeDeviceQuickAction({changedDevice, undefined}));

    dispatch(filterDeviceByLocation());
  }, [changedDevice]);

  const handleQuickAction = (
    changedQuickActionStatus: boolean,
    changeDimValue: number,
  ) => {
    console.log('PARAMS', changedQuickActionStatus, changeDimValue);

    setChangedDevice(prev => {
      return {
        ...prev,
        quickActionStatus: changedQuickActionStatus,
        dimValue: changeDimValue,
      };
    });
    console.log(changedDevice);
  };
  return (
    <Card onPress={() => deviceInfoHandle()} style={{marginVertical: 8}}>
      <Card.Content
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View>
          <Text variant="titleLarge">{device.name}</Text>
          <Text variant="bodyMedium">
            <Icon source="map-marker" size={20} />
            <Text>{DEVICE_LOCATIONS[device.location]}</Text>
          </Text>
        </View>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Icon
            source={DEVICE_TYPE_ICON[device.type].name}
            size={30}
            color={DEVICE_TYPE_ICON[device.type].color}
          />
          <Text variant="labelSmall">{DEVICE_TYPES[device.type]}</Text>
        </View>
      </Card.Content>
      {device.type === 'light' ? (
        <Card.Actions>
          <Text>{lightDimValue}</Text>
          <Slider
            style={{width: 200, height: 40}}
            onValueChange={value => setLightDimValue(value)}
            minimumValue={0}
            maximumValue={100}
            step={1}
            onSlidingComplete={() =>
              handleQuickAction(
                !!lightDimValue,
                Math.round(lightDimValue * 2.55),
              )
            }
            thumbTintColor={theme.colors.primary}
            minimumTrackTintColor="yellow"
            maximumTrackTintColor="#000000"
          />
          <IconButton
            icon={DEVICE_TYPE_ICON[device.type].name}
            size={20}
            onPress={() =>
              handleQuickAction(!device.quickActionStatus, lightDimValue)
            }
            containerColor={
              device.quickActionStatus === true ? '#ecfa21' : '#fff'
            }
          />
        </Card.Actions>
      ) : device.type === 'fan' ? (
        <Card.Actions>
          <IconButton
            icon="fan-off"
            size={20}
            onPress={() => handleQuickAction(false, Math.round(0))}
            containerColor={device.dimValue === 0 ? '#ecfa21' : '#fff'}
          />
          <IconButton
            icon="fan-speed-1"
            size={20}
            onPress={() => handleQuickAction(true, Math.round(255 / 3))}
            containerColor={
              device.dimValue === Math.round(255 / 3) ? '#ecfa21' : '#fff'
            }
          />
          <IconButton
            icon="fan-speed-2"
            size={20}
            onPress={() => handleQuickAction(true, Math.round((255 / 3) * 2))}
            containerColor={
              device.dimValue === Math.round((255 / 3) * 2) ? '#ecfa21' : '#fff'
            }
          />
          <IconButton
            icon="fan-speed-3"
            size={20}
            onPress={() => handleQuickAction(true, Math.round(255))}
            containerColor={
              device.dimValue === Math.round(255) ? '#ecfa21' : '#fff'
            }
            borderless
          />
        </Card.Actions>
      ) : (
        <View style={{marginVertical: 10}}>
          {/* <Button mode="text" onPress={handleGoToWebview}>
            Xem trực tiếp camera
          </Button> */}
        </View>
      )}
    </Card>
  );
};

export default DeviceItemList;
