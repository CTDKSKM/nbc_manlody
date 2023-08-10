import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import React from "react";
import { auth } from "../firebase";
import { FirebaseError } from "firebase/app";
import { useNavigate } from "react-router-dom";

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

const SocialLogin = () => {
  // const testSignUp = async () => {
  //   try {
  //     const userCredential = await createUserWithEmailAndPassword(
  //       auth,
  //       "test@test.com",
  //       "111111"
  //     );
  //     const user = userCredential.user;
  //     console.log(user);
  //   } catch (error) {
  //     if (error instanceof FirebaseError) {
  //       const errorMessage = error.message;
  //       const errorCode = error.code;
  //       console.log(errorMessage);
  //     }
  //   }
  // };
  // const testLogin = async () => {
  //   try {
  //     const userCredential = await signInWithEmailAndPassword(
  //       auth,
  //       "test@test.com",
  //       "111111"
  //     );
  //   } catch (error) {
  //     if (error instanceof FirebaseError) {
  //       const errorMessage = error.message;
  //       const errorCode = error.code;
  //     }
  //   }
  // };
  // const testLogout = async () => {
  //   await signOut(auth);
  // };
  const navigate = useNavigate();
  const handleLogin = () => {
    window.location.href = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL}&scope=${SCOPES_URL_PARAM}&response_type=token&show_dialog=true`;
  }
  const testGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider(); // provider 구글 설정
      await signInWithPopup(auth, provider);
      await handleLogin()
      navigate("/");
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.log(error.message);
      }
    }
  };

  return (
    <div>
      <button
        onClick={() => {
          testGoogleLogin();
        }}
      >
        구글로그인
      </button>
    </div>
  );
};

export default SocialLogin;
