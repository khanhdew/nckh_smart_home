import {configureStore} from '@reduxjs/toolkit';
import deviceReducer from './deviceSlice';
import greetingReducer from './greetingSlice';
import deviceManagerReducer from './deviceManagerSlice';
import appReducer from './appSlice';

export const store = configureStore({
  reducer: {
    device: deviceReducer,
    greeting: greetingReducer,
    deviceManager: deviceManagerReducer,
    app: appReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
