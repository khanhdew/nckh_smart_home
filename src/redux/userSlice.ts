import {PayloadAction, createSlice} from '@reduxjs/toolkit';

export interface UserState {
  email: string;
}

const initialState: UserState = {
  email: '',
};

export const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    addEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    removeEmail: state => {
      state.email = '';
    },
  },
});

export const {addEmail, removeEmail} = userSlice.actions;

export default userSlice.reducer;
