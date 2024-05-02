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
    // !WARN: This action for test, remove it
    initDeviceForTest: state => {
      function generateFakeDevice(): Device {
        const LocationKeys = [...Object.keys(DEVICE_LOCATIONS)];
        const LocationRandomKey =
          LocationKeys[Math.floor(Math.random() * LocationKeys.length)];
        const DeviceTypeKeys = [...Object.keys(DEVICE_TYPES)];
        const DeviceTypeRandomKey =
          DeviceTypeKeys[Math.floor(Math.random() * DeviceTypeKeys.length)];

        return {
          id: Math.random().toString(36).substring(2, 15), // Generates a random string
          name: `Device-${Math.random().toString(36).substring(2, 5)}`, // Generates a random device name
          location: LocationRandomKey, // Generates a random location name
          type: DeviceTypeRandomKey,
          quickActionStatus: false,
          dimValue: 0,
        };
      }

      // Example usage
      for (let i = 0; i < 2; i++) {
        state.listDevice.push(generateFakeDevice());
      }
    },
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
      state.listDevice.push(action.payload.device);
    },
    deleteDevice: (state, action: PayloadAction<{id: string}>) => {
      state.listDevice = state.listDevice.filter(
        device => device.id !== action.payload.id,
      );
    },

    changeDeviceInfo: (
      state,
      action: PayloadAction<{changedDevice: Device}>,
    ) => {
      state.listDevice = state.listDevice.filter(
        device => device.id !== action.payload.changedDevice.id,
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
          deviceId: string;
          dimValue: number;
          quickActionStatus: boolean;
        }>,
      ) => {
        // code to update ui
        const deviceIndex = state.listDevice.findIndex(
          device => device.id === action.payload.deviceId,
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
      deviceId: device.id,
      quickActionStatus: device.quickActionStatus,
      dimValue: device.dimValue,
    };
  },
);

// Action creators are generated for each case reducer function
export const {
  initDeviceForTest,
  addDevice,
  deleteDevice,
  changeDeviceInfo,
  filterDeviceByLocation,
} = deviceSlice.actions;

export default deviceSlice.reducer;
