import { createSlice } from "@reduxjs/toolkit";
//보드슬라이스로 요청이 들어오면 아래에서 처리하는 것을 만들면 된다.

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

/*
reducers: {
  login: (state, action) => {
    return state.map((user) => {
      if (user.email === action.payload.email && user.pw === action.payload.pw) {
        return { ...user, isLogin: !user.isLogin };
      } else {
        return user;
      }
    });
    //immer라는 기능 덕분에 push로도 가능
    //(1) 검증
    // const user = state.find((user) => {
    //   if (user.id === action.payload.id && user.pw === action.payload.pw && user.isLogin === false) {
    //     return user;
    //   }
    // });
    //(2) 상태 갱신
    // id: 2,
    // email: action.payload.email,
    // password: action.payload.pw,
    // isLogin: true,
  },
},
});

dispatch(addPost({
title,
contents,
writerId: (users에)
}))
export const {} = userSlice.actions;
export default userSlice.reducer; */