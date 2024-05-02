import {useState} from 'react';
import {
  GestureResponderEvent,
  SafeAreaView,
  SectionList,
  StyleSheet,
  View,
} from 'react-native';
import {Button, Modal, Portal, Text} from 'react-native-paper';
import {useSelector} from 'react-redux';
import AddDeviceModal from '../components/AddDeviceModal';
import DeviceItemList from '../components/DeviceItemList';
import Device from '../interfaces/device';
import {RootState} from '../redux/store';
import {DEVICE_LOCATIONS} from '../constants/device';

const DeviceManagerScreen = () => {
  const testListDevice = useSelector<RootState, {[key: string]: Device[]}>(
    state => state.device.filteredListDevice,
  );

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  // * Functions to handle press event
  function addDeviceHandle(_event: GestureResponderEvent): void {
    setModalVisible(true);
  }

  return (
    <>
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modal}>
          <AddDeviceModal setModalVisible={setModalVisible} />
        </Modal>
      </Portal>
      <SafeAreaView style={styles.screenContainer}>
        {/* Add device button */}
        <Button
          onPress={addDeviceHandle}
          mode="contained"
          style={styles.addDeviceButton}>
          Thêm thiết bị
        </Button>

        {/* Device List with SectionList */}
        <SectionList
          sections={Object.keys(testListDevice).map(location => ({
            location: location,
            data: testListDevice[location],
          }))}
          keyExtractor={item => item.id}
          renderItem={({item}) => <DeviceItemList deviceId={item.id} />}
          renderSectionHeader={({section: {location}}) => (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
                marginVertical: 7,
              }}>
              <Text variant="titleMedium">{DEVICE_LOCATIONS[location]}</Text>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: '#a6a6a6',
                  flex: 1,
                  height: 0,
                }}></View>
            </View>
          )}
          style={styles.listDevice}
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    gap: 10,
    marginTop: 10,
  },
  modal: {
    backgroundColor: 'white',
    alignSelf: 'center',
    width: '80%',
    height: 350,
    marginHorizontal: 20,
    marginVertical: '50%',
    padding: 20,
    paddingVertical: 70,
    borderRadius: 10,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 12,
  },
  addDeviceButton: {
    marginHorizontal: 10,
  },
  listDevice: {
    flex: 1,
    paddingHorizontal: 10,
  },
});

export default DeviceManagerScreen;
