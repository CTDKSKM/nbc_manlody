import { createSlice } from "@reduxjs/toolkit";
//보드슬라이스로 요청이 들어오면 아래에서 처리하는 것을 만들면 된다.
export const boardSlice = createSlice({
  name: "board",
  initialState: [
    {
      id: 1,
      title: "글 제목1",
      contents: "내용 1",
      isDeleted: false,
    },
    {
      id: 1,
      title: "글 제목2",
      contents: "내용 2",
      isDeleted: false,
    }
  ],
  reducers: {},
});

export const {} = boardSlice.actions;
export default boardSlice.reducer;
