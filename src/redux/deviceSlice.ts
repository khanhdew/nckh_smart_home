import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import {DEVICE_LOCATIONS, DEVICE_TYPES} from '../constants/device';
import axios from 'axios';
import Device from '../interfaces/device';

export interface DeviceState {
  listDevice: Device[];
  filteredListDevice: {
    [key: string]: Device[];
  };
}

const initialState: DeviceState = {
  listDevice: [],
  filteredListDevice: {},
};

export const deviceSlice = createSlice({
  name: 'device',
  initialState,
  reducers: {
    filterDeviceByLocation: (state: DeviceState) => {
      state.filteredListDevice = state.listDevice.reduce(
        (acc: {[key: string]: Device[]}, device: Device) => {
          const key: string = device.location;
          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(device);
          return acc;
        },
        {},
      );
    },
    addDevice: (state, action: PayloadAction<{device: Device}>) => {
      const addDeviceData = {
        ...action.payload.device,
        dimValue: 0,
        quickActionStatus: false,
      };
      state.listDevice.push(addDeviceData);
    },
    deleteDevice: (state, action: PayloadAction<{uuid: string}>) => {
      state.listDevice = state.listDevice.filter(
        device => device.uuid !== action.payload.uuid,
      );
    },

    changeDeviceInfo: (
      state,
      action: PayloadAction<{changedDevice: Device}>,
    ) => {
      state.listDevice = state.listDevice.filter(
        device => device.uuid !== action.payload.changedDevice.uuid,
      );
      state.listDevice.push(action.payload.changedDevice);
    },
  },
  extraReducers: builder => {
    builder.addCase(
      changeDeviceQuickAction.fulfilled,
      (
        state: DeviceState,
        action: PayloadAction<{
          uuid: string;
          dimValue: number;
          quickActionStatus: boolean;
        }>,
      ) => {
        // code to update ui
        const deviceIndex = state.listDevice.findIndex(
          device => device.uuid === action.payload.uuid,
        );
        if (deviceIndex !== -1) {
          const device = state.listDevice[deviceIndex];
          if (device.quickActionStatus !== undefined) {
            device.quickActionStatus = action.payload.quickActionStatus;
            device.dimValue = action.payload.dimValue;
          }
        }
      },
    );
  },
});

export const changeDeviceQuickAction = createAsyncThunk(
  'device/changeDeviceQuickAction',
  async (device: Device) => {
    console.log('🚀 ~ deviceChange:', device);

    let apiBody = {};

    if (device.type === 'light') {
      apiBody = {
        led_status: device.quickActionStatus,
        dim: device.dimValue,
      };
    } else if (device.type === 'fan') {
      apiBody = {
        fan_status: !!device.dimValue,
        speed: device.dimValue,
      };
    }
    console.log('🚀 ~ apiBody:', apiBody);
    const res = await axios.post(
      `http://159.203.102.213:8085/api/control/ae_${device.id}`,
      {
        cnf: 'application/json',
        con: {
          ...apiBody,
        },
      },
    );

    return {
      deviceId: device.uuid,
      quickActionStatus: device.quickActionStatus,
      dimValue: device.dimValue,
    };
  },
);

// Action creators are generated for each case reducer function
export const {
  addDevice,
  deleteDevice,
  changeDeviceInfo,
  filterDeviceByLocation,
} = deviceSlice.actions;

export default deviceSlice.reducer;
