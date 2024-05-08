import {StyleSheet, View, ScrollView, AppState, Alert} from 'react-native';
import {Text} from 'react-native-paper';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import Device from '../interfaces/device';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../interfaces/reactNavigation';
import {
  Button,
  Dialog,
  Icon,
  Portal,
  TextInput,
  useTheme,
} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {
  changeDeviceInfo,
  changeDeviceQuickAction,
  deleteDevice,
  filterDeviceByLocation,
} from '../redux/deviceSlice';
import {RootState} from '../redux/store';
import {SelectList} from 'react-native-dropdown-select-list';
import {DeviceManagerState} from '../redux/deviceManagerSlice';
import WebView from 'react-native-webview';
import {deleteDeviceFromUser} from '../services/firebase';
import {TriangleColorPicker, toHsv, fromHsv} from 'react-native-color-picker';
import Slider from '@react-native-community/slider';
import ColorPicker from 'react-native-wheel-color-picker';
import axios from 'axios';

type Props = NativeStackScreenProps<RootStackParamList, 'deviceDetail'>;

function hexToRgb(hex) {
  // Remove the hash at the beginning of the hex string if it's there
  hex = hex.replace(/^#/, '');

  // Parse the hex string into RGB components
  let r, g, b;
  if (hex.length === 3) {
    // In case of shorthand hex color code
    r = parseInt(hex.charAt(0) + hex.charAt(0), 16);
    g = parseInt(hex.charAt(1) + hex.charAt(1), 16);
    b = parseInt(hex.charAt(2) + hex.charAt(2), 16);
  } else if (hex.length === 6) {
    // In case of full hex color code
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  } else {
    throw new Error('Invalid hex color format');
  }

  return {r, g, b};
}

const DeviceInfoDetailScreen = ({route}: Props) => {
  const device: Device = route.params?.device;
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const email = useSelector<RootState>(state => state.user.email);
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [isShowConfirmDeleteDialog, setIsShowConfirmDeleteDialog] =
    useState<boolean>(false);
  const [deviceInput, setDeviceInput] = useState<Device>(device);
  const locationList = useSelector<
    RootState,
    {
      [key: string]: string;
    }
  >(state => state.deviceManager.locationList);
  const locationListForSelect = Object.entries(locationList).map(
    ([key, label]) => ({
      key: key,
      value: label,
    }),
  );
  const deviceTypeList = useSelector<
    RootState,
    {
      [key: string]: string;
    }
  >(state => state.deviceManager.deviceTypeList);
  const deviceTypeListForSelect = Object.entries(deviceTypeList).map(
    ([key, label]) => ({
      key: key,
      value: label,
    }),
  );
  const [ngrokUrlInput, setNgrokUrlInput] = useState('');
  const [ngrokUrl, setNgrokUrl] = useState('');
  const [lightColor, setLightColor] = useState('#ffffff');

  const handleClickChangeDeviceInfoBtn = () => {
    setIsEditable(!isEditable);
    if (isEditable) {
      // click on "Lưu thông tin" button
      dispatch(changeDeviceInfo({changedDevice: deviceInput}));
      dispatch(filterDeviceByLocation());
    }
  };
  const handleClieckDeleteDeviceBtn = () => {
    setIsShowConfirmDeleteDialog(true);
  };
  const handleChangeDeviceInfo = (field: string, value: string) => {
    setDeviceInput(prev => {
      return {
        ...prev,
        [field]: value,
      };
    });
  };
  const handleConfirmDeleteDevice = () => {
    console.log(email);

    setIsShowConfirmDeleteDialog(false);
    dispatch(deleteDevice({uuid: deviceInput.uuid}));
    deleteDeviceFromUser(email, deviceInput.uuid);
    dispatch(filterDeviceByLocation());

    navigation.navigate('Device');
  };
  const handlePushNgrokUrl = async () => {
    await axios.post('http://159.203.102.213/fcm/initImgURL', {
      ngrokUrl,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Portal>
        <Dialog
          visible={isShowConfirmDeleteDialog}
          onDismiss={() => setIsShowConfirmDeleteDialog(false)}>
          <Dialog.Title>Xác nhận xóa thiết bị</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Bạn thực sự muốn xóa thiết bị, thao tác này sẽ không thể hoàn tác.
            </Text>
            <Text> </Text>
            <Text>Tên thiết bị: {device.name}</Text>
            <Text>Vị trí: {locationList[device.location]}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => setIsShowConfirmDeleteDialog(false)}
              textColor={theme.colors.backdrop}>
              Hủy
            </Button>
            <Button
              onPress={handleConfirmDeleteDevice}
              textColor={theme.colors.error}
              // buttonColor={theme.colors.errorContainer}
            >
              Xóa thiết bị
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      {/*  */}
      {device.type === 'bell' && (
        <View>
          <View
            style={{
              flex: 1,
              height: 200,
              backgroundColor: '#ccc',
              borderRadius: 10,
            }}>
            <WebView
              style={{
                flex: 1,
                borderBlockColor: '#000',
                backgroundColor: '#ccc',
              }}
              source={{
                uri: ngrokUrl,
                headers: {'ngrok-skip-browser-warning': '12'},
              }}
            />
          </View>
          <View>
            <View style={{flexDirection: 'row', gap: 5, marginVertical: 10}}>
              <TextInput
                dense={true}
                placeholder="Nhập url ngrok để xem hình ảnh"
                value={ngrokUrlInput}
                onChangeText={text => setNgrokUrlInput(text)}
                style={{flex: 1}}
              />
              <Button onPress={handlePushNgrokUrl} mode="text">
                Xác nhận
              </Button>
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'center', gap: 20}}>
              <Button
                onPress={() => setNgrokUrl(`${ngrokUrlInput}/_stream`)}
                mode="contained">
                Xem trực tiếp
              </Button>
              <Button
                onPress={() => setNgrokUrl(`${ngrokUrlInput}/_capture`)}
                mode="contained">
                Lấy ảnh
              </Button>
            </View>
          </View>
        </View>
      )}
      {device.type === 'rgbled' && (
        <View style={{flex: 1}}>
          <ColorPicker
            color={lightColor}
            onColorChangeComplete={color => {
              setLightColor(color);
              console.log(`Color selected: ${hexToRgb(color)}`);
              dispatch(
                changeDeviceQuickAction({
                  device: device,
                  rgbValue: hexToRgb(color),
                }),
              );
            }}
            thumbSize={30}
            sliderSize={30}
            noSnap={true}
            row={false}
          />
        </View>
      )}
      {/*  */}
      <View style={styles.deviceInfo}>
        <View>
          <Text>
            <Icon source="devices" size={25} />
            <Text> </Text>
            <Text variant="titleMedium">Tên thiết bị</Text>
          </Text>
          <TextInput
            disabled={!isEditable}
            textColor={theme.colors.onSurfaceVariant}
            activeOutlineColor={theme.colors.primary}
            style={styles.inputDeviceInfo}
            value={deviceInput.name}
            onChangeText={text => handleChangeDeviceInfo('name', text)}
            dense={true}
          />
        </View>
        <View>
          <Text>
            <Icon source="map-marker" size={25} />
            <Text> </Text>
            <Text variant="titleMedium">Vị trí</Text>
          </Text>
          <SelectList
            data={locationListForSelect}
            setSelected={(val: string) => {
              handleChangeDeviceInfo('location', val);
            }}
            defaultOption={locationListForSelect.find(
              item => item.key === device.location,
            )}
            placeholder="Chon loại thiết bị"
            search={false}
            dropdownStyles={
              isEditable ? styles.selectInputDropdown : {display: 'none'}
            }
            save="key"
          />
        </View>
        <View>
          <Text>
            <Icon source="devices" size={25} />
            <Text> </Text>
            <Text variant="titleMedium">Loại thiết bị</Text>
          </Text>
          <SelectList
            data={deviceTypeListForSelect}
            setSelected={(val: string) => {
              handleChangeDeviceInfo('type', val);
            }}
            placeholder="Chon loại thiết bị"
            search={false}
            defaultOption={deviceTypeListForSelect.find(
              item => item.key === device.type,
            )}
            dropdownStyles={
              isEditable ? styles.selectInputDropdown : {display: 'none'}
            }
            save="key"
          />
        </View>
      </View>

      {/* Devive Action */}
      <View style={styles.actionButton}>
        <Button mode="contained" onPress={handleClickChangeDeviceInfoBtn}>
          {isEditable ? 'Lưu thông tin' : 'Sửa thông tin'}
        </Button>
        <Button
          mode="contained"
          onPress={handleClieckDeleteDeviceBtn}
          buttonColor={theme.colors.error}>
          Xóa thiết bị
        </Button>
      </View>
    </ScrollView>
  );
};

export default DeviceInfoDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  deviceInfo: {
    paddingVertical: 15,
    rowGap: 10,
  },
  actionButton: {
    rowGap: 10,
  },
  inputDeviceInfo: {
    fontWeight: '600',
    fontSize: 18,
    marginTop: 5,
  },
  selectInputDropdown: {
    backgroundColor: '#fff',
    opacity: 1,
    position: 'absolute',
    top: 40,
    right: 0,
    left: 0,
    zIndex: 1,
  },
});
