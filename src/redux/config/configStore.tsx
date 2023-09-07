import { configureStore } from '@reduxjs/toolkit';
import albumTrackSliceReducer from '../modules/playUris';
import rgbSliceReducer from '../modules/rgb';
// ...

export const store = configureStore({
  reducer: {
    albumTrackSliceReducer,
    rgbSliceReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
