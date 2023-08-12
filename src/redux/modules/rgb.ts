import { createSlice } from '@reduxjs/toolkit';

const initialState: any = [180, 180, 180, 0];

const rgbSlice = createSlice({
  name: 'RGB',
  initialState,
  reducers: {
    setRGB: (state, action) => {
      return [...action.payload];
    }
  }
});

export const { setRGB } = rgbSlice.actions;
export default rgbSlice.reducer;
