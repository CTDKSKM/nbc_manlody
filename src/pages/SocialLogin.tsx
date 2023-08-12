import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import React from "react";
import { auth } from "../firebase";
import { FirebaseError } from "firebase/app";
import { useNavigate } from "react-router-dom";

import { handleSpotifyLogin } from "../api/accesstoken";

const SocialLogin:React.FC = () => {

  const navigate = useNavigate();
  const googleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider(); // provider 구글 설정
      await signInWithPopup(auth, provider);

      handleSpotifyLogin()

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
          googleLogin();
        }}
      >
        구글로그인
      </button>
    </div>
  );
};

export default SocialLogin;
