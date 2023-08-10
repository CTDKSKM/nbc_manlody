import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../firebase";
import { FirebaseError } from "firebase/app";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "react-query";


const SocialLogin:React.FC= () => {
  const navigate = useNavigate();

  const queryClient = useQueryClient()
  
  const testGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider(); // provider 구글 설정
      await signInWithPopup(auth, provider);


      // const userName = user.displayName
      // const userEmail = user.email
      // const userProfilePicture = user.photoURL;

      // queryClient.setQueryData("userInfo",{userName,userEmail,userProfilePicture})
      // console.log(queryClient.getQueryData("userInfo"),"데이터저장")


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
