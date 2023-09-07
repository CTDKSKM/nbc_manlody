import { createSlice } from "@reduxjs/toolkit";
const initialState:any = []
const albumTrackSlice = createSlice({
  name: "albumAllTrack",
  initialState,
  reducers: {
    changePlaylist: (state, action)=>{
      return [...action.payload]
    },
    addAlbum: (state, action)=>{
      return [...state, ...action.payload]
    }
  },
});

export const { changePlaylist, addAlbum } = albumTrackSlice.actions;
export default albumTrackSlice.reducer;