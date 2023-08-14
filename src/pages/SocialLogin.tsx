import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import React, { useEffect } from 'react';
import { auth } from '../firebase';
import { FirebaseError } from 'firebase/app';
import { useNavigate } from 'react-router-dom';
import { handleSpotifyLogin } from '../api/accesstoken';
import { styled, keyframes } from 'styled-components';

const SocialLogin: React.FC = () => {
  const navigate = useNavigate();
  const googleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider(); // provider 구글 설정
      // 추후에 authProvider로 받아온 토큰을 로컬스토리지에 저장하고, (이후 refreshToken을 대조하는 로직 스터디가 필요.)
      await signInWithPopup(auth, provider);
      
      handleSpotifyLogin();

      // navigate('/');
    } catch (error) {
      // 에러가 나올 때 콘솔에 에러메시지를 보여주고 싶었음. 근데 TS에는 error의 타입도 정해줘야하기 때문에,
      // 이 에러가 FirebaseError의 instance이다를 보여줘서 TS에러를 방지.
      if (error instanceof FirebaseError) {
        console.log(error.message);
      }
    }
  };

  const user = auth.currentUser;
  useEffect(() => {
    const isToken = sessionStorage.getItem('access_token');

    if (user && isToken) navigate('/');
  }, []);

  return (
    <LoginBody>
      <LoginWrap>
        <LoginInner>
          <p>
            <LogoImage src="/assets/logo_horizontal.png" alt="Logo" />
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

const gradient = keyframes`
    0% {
        -webkit-filter: hue-rotate(0deg);
        filter: hue-rotate(0deg);
    }

    100% {
        -webkit-filter: hue-rotate(360deg);
        filter: hue-rotate(360deg);
    }
`;

const LoginBody = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  background: linear-gradient(40deg, rgb(199, 121, 208), rgb(75, 192, 200), #2b3074);
  -webkit-animation: ${gradient} 5s infinite alternate;
  animation: ${gradient} 5s infinite alternate;
  animation: ${gradient} 8s ease infinite;
`;

const LoginWrap = styled.div`
  background-color: rgba(255, 255, 255, 0.6);
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 8px;
  transition: all 0.5s;
  &:hover {
    background-color: rgba(255, 255, 255, 1);
  }
`;
const LoginInner = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 50px 60px;
  p {
    width: 400px;
    text-align: center;
    margin-bottom: 20px;
  }
  button {
    padding: 10px 60px;
    border: solid 1px #111;
    font-size: 15px;
    border-radius: 4px;
    color: #111;
    cursor: pointer;
  }
`;
const LogoImage = styled.img`
  width: 100%;
`;
