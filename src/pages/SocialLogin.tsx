import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import React from "react";
import { auth } from "../firebase";
import { FirebaseError } from "firebase/app";
import { useNavigate } from "react-router-dom";

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
  const testGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider(); // provider 구글 설정
      await signInWithPopup(auth, provider);
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
