import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {DEVICE_LOCATIONS, DEVICE_TYPES} from '../constants/device';

export interface DeviceManagerState {
  locationList: {
    [key: string]: string;
  };
  deviceTypeList: {
    [key: string]: string;
  };
}

const initialState: DeviceManagerState = {
  locationList: DEVICE_LOCATIONS,
  deviceTypeList: DEVICE_TYPES,
};

export const deviceManagerSlice = createSlice({
  name: 'deviceManager',
  initialState,
  reducers: {
    addLocation: (state, action: PayloadAction<string>) => {
      // state.locationList.push(action.payload)
      // DEVICE_LOCATIONS.push(action.payload)
    },
    removeLocation: (state, action: PayloadAction<string>) => {
      // state.locationList.splice(
      // 	state.locationList.indexOf(action.payload),
      // 	1,
      // )
    },
    addDeviceType: (state, action: PayloadAction<string>) => {
      // state.deviceTypeList.push(action.payload)
    },
    removeDeviceType: (state, action: PayloadAction<string>) => {
      // state.deviceTypeList.splice(
      // 	state.deviceTypeList.indexOf(action.payload),
      // 	1,
      // )
    },
  },
});

export const {addLocation, removeLocation, addDeviceType, removeDeviceType} =
  deviceManagerSlice.actions;

export default deviceManagerSlice.reducer;
