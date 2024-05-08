import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import {getIPv4, getWeatherCondition} from '../services/greetingApi';
import {IWeatherCondition} from '../interfaces/greeting';

interface ITimeState {
  day: number;
  month: number;
  year: number;
  weekday: string;
  fullTimeStr: string;
}
export interface GreetingState {
  session: string;
  greetingMessage: string;
  time: ITimeState;
  weatherCondition: IWeatherCondition | undefined;
  ipv4: string;
}

const getSession = (): string => {
  const hours = new Date().getHours();
  return hours < 12
    ? 'morning'
    : hours <= 18 && hours >= 12
    ? 'afternoon'
    : 'night';
};
const getGreetingMessage = (session: string): string => {
  switch (session) {
    case 'morning':
      return 'Chào buổi sáng';
    case 'afternoon':
      return 'Chào buổi chiều';
    case 'night':
      return 'Chào buổi tối';
    default:
      return 'Xin chào';
  }
};
const getTime = (): ITimeState => {
  const date = new Date();

  const output: ITimeState = {
    day: date.getDate(),
    month: date.getMonth() + 1,
    year: date.getFullYear(),
    weekday: date.toLocaleDateString('vn', {weekday: 'long'}),
    fullTimeStr: '',
  };
  output.fullTimeStr = `${output.weekday}, ${output.day}/${output.month}/${output.year}`;

  return output;
};

const initialState: GreetingState = {
  session: '',
  greetingMessage: '',
  time: {
    day: 0,
    month: 0,
    year: 0,
    weekday: '',
    fullTimeStr: '',
  },
  weatherCondition: {
    location: {
      name: '',
    },
    current: {
      feelslike_c: 0,
      humidity: 0,
      condition: {
        text: '',
        icon: '',
      },
    },
  },
  ipv4: '',
};

export const greetingSlice = createSlice({
  name: 'greeting',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(
      initGreetingInformation.fulfilled,
      (state: GreetingState, action: PayloadAction<GreetingState>) => {
        state.greetingMessage = action.payload.greetingMessage;
        state.session = action.payload.session;
        state.time = action.payload.time;
        state.weatherCondition = action.payload.weatherCondition;
        state.ipv4 = action.payload.ipv4;
      },
    );
  },
});

export const initGreetingInformation = createAsyncThunk(
  'greeting/initGreetingInformation',
  async () => {
    const session = getSession();
    const greetingMessage = getGreetingMessage(session);
    const time = getTime();
    const weatherCondition = await getWeatherCondition();
    const ipv4 = await getIPv4();

    return {session, greetingMessage, time, weatherCondition, ipv4};
  },
);

// Action creators are generated for each case reducer function
export const {} = greetingSlice.actions;

export default greetingSlice.reducer;
