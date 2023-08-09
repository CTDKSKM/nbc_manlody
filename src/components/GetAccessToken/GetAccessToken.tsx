import React, { useEffect, useState } from "react";
import Dashboard from "../Dashboard/Dashboard";

const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";
const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID
const CLIENT_SECRET = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET
const REDIRECT_URL = process.env.REACT_APP_SPOTIFY_REDIRECT_URL

const SPACE_DELIMITER = "%20";
const SCOPES = [
  "streaming", 
"user-read-email", 
"user-read-private", 
"user-library-read", 
"user-library-modify", 
"user-read-playback-state", 
"user-modify-playback-state", 
"user-read-currently-playing", 
"user-read-recently-played",
"playlist-modify-public", 
"playlist-modify-private", 
"playlist-read-private"];
const SCOPES_URL_PARAM = SCOPES.join(SPACE_DELIMITER);

const getReturnedParamsFromSpotifyAuth = (hash : string) => {
  //주소에서 access_token 이후를 잘라서 stringAfterHashtag로 할당
  const stringAfterHashtag = hash.substring(1);
  //stringAfterHashtag중에서 &으로 파라미터들을 구분.
  const paramsInUrl = stringAfterHashtag.split("&");
  const access_token = paramsInUrl[0].split("=")[1];
  const token_type = paramsInUrl[1].split("=")[1];
  const expires_in = paramsInUrl[2].split("=")[1];
  return {access_token, token_type, expires_in}
}

const GetAccessToken = () => {
  const [accessToken, setAccessToken] = useState("");
  useEffect(() => {
    //윈도우 브라우저 현재 주소에 해쉬가 존재하면
    if(window.location.hash) {
      //잘라버리는 작업을 수행합니다.
      const { access_token, token_type, expires_in} = getReturnedParamsFromSpotifyAuth(window.location.hash)
      setAccessToken(access_token)
      
      const newUrl = window.location.pathname; //현재 페이지의 경로부분을 newUrl에 할당
      // 페이지 url 변경. pushState() 인자로 받는 것은 1. state: null 또는 {}로 지정 2.document.title: 현재 문서의 타이틀 3.url: 변경하고자 하는 경로
      window.history.pushState({}, document.title, newUrl);
    }
  })
  const handleLogin = () => {
    window.location.href = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL}&scope=${SCOPES_URL_PARAM}&response_type=token&show_dialog=true`;
  }
  return (
  <div>
    {accessToken ? (<Dashboard access_token={accessToken}/>) : (<button onClick={handleLogin}>Login to Spotify</button>)}
  </div>
  )
};

export default GetAccessToken;
