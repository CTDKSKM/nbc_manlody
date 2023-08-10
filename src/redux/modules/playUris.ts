import { createSlice } from "@reduxjs/toolkit";
const initialState:any = []
const albumTrackSlice = createSlice({
  name: "albumAllTrack",
  initialState,
  reducers: {
    playAlbum: (state, action) => {
      return [...state, action.payload]
    },
    addAlbum: (state, action)=>{
      return [...state, ...action.payload]
    }
  },
});

export const { playAlbum, addAlbum } = albumTrackSlice.actions;
export default albumTrackSlice.reducer;