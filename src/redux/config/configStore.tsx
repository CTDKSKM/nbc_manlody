import { configureStore } from "@reduxjs/toolkit";
import albumTrackSliceReducer from "../modules/playUris";
// ...

export const store = configureStore({
  reducer: {
    //@ts-ignore
    albumTrackSliceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
