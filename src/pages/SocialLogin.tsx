import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import React, { useState } from 'react';
import { auth } from '../firebase';
import { FirebaseError } from 'firebase/app';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from 'react-query';
import { handleSpotifyLogin } from '../api/accesstoken';
import { styled } from 'styled-components';

const SocialLogin: React.FC = () => {
  const navigate = useNavigate();
  const googleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider(); // provider 구글 설정
      await signInWithPopup(auth, provider);

      handleSpotifyLogin();

      navigate('/');
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.log(error.message);
      }
    }
  };

  return (
    <LoginBody>
      <LoginWrap>
        <LoginInner>
          <p>
            <img src="/logo_horizontal.png" alt="Logo" />
          </p>
          <button
            onClick={() => {
              googleLogin();
            }}
          >
            Login With Google
          </button>
        </LoginInner>
      </LoginWrap>
    </LoginBody>
  );
};

export default SocialLogin;

const LoginBody = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  background: #fffbd5; /* Old browsers */
  background: -moz-linear-gradient(left, #fff593 0%, #b20a2c 100%); /* FF3.6-15 */
  background: -webkit-linear-gradient(left, #fff593 0%, #b20a2c 100%); /* Chrome10-25,Safari5.1-6 */
  background: linear-gradient(
    to right,
    #fff593 0%,
    #b20a2c 100%
  ); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
`;

const LoginWrap = styled.div`
  margin-top: -4rem;
  background-color: rgba(255, 255, 255, 0.6);
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 8px;
  transition: all 0.5s;
  &:hover {
    background-color: rgba(255, 255, 255, 0.86);
  }
`;
const LoginInner = styled.div`
  margin-top: -1rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 20px 50px;
  p {
    width: 400px;
    text-align: center;
    margin-bottom: 10px;
  }
  img {
    width: 100%;
  }
  button {
    padding: 10px 60px;
    border: solid 1px #111;
    font-size: 15px;
    border-radius: 4px;
  }
`;
