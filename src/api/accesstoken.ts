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

export const getReturnedParamsFromSpotifyAuth = (hash : string) => {
  //주소에서 access_token 이후를 잘라서 stringAfterHashtag로 할당
  const stringAfterHashtag = hash.substring(1);
  //stringAfterHashtag중에서 &으로 파라미터들을 구분.
  const paramsInUrl = stringAfterHashtag.split("&");
  const access_token = paramsInUrl[0].split("=")[1];
  const token_type = paramsInUrl[1].split("=")[1];
  const expires_in = paramsInUrl[2].split("=")[1];
  return {access_token, token_type, expires_in}
}


export const handleSpotifyLogin = () => {
    window.location.href = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL}&scope=${SCOPES_URL_PARAM}&response_type=token&show_dialog=true`;
  }

