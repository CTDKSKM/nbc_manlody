import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import React, { useState } from 'react';
import { auth } from '../firebase';
import { FirebaseError } from 'firebase/app';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from 'react-query';
import { handleSpotifyLogin } from '../api/accesstoken';
import { styled } from 'styled-components';

// const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";
// const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID
// const CLIENT_SECRET = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET
// const REDIRECT_URL = process.env.REACT_APP_SPOTIFY_REDIRECT_URL

// const SPACE_DELIMITER = "%20";
// const SCOPES = [
//   "streaming",
// "user-read-email",
// "user-read-private",
// "user-library-read",
// "user-library-modify",
// "user-read-playback-state",
// "user-modify-playback-state",
// "user-read-currently-playing",
// "user-read-recently-played",
// "playlist-modify-public",
// "playlist-modify-private",
// "playlist-read-private"];
// const SCOPES_URL_PARAM = SCOPES.join(SPACE_DELIMITER);

const SocialLogin: React.FC = () => {
  const navigate = useNavigate();
  // const handleLogin = () => {
  //   window.location.href = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL}&scope=${SCOPES_URL_PARAM}&response_type=token&show_dialog=true`;
  // }
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
background: -moz-linear-gradient(left,  #FFF593 0%, #b20a2c 100%); /* FF3.6-15 */
background: -webkit-linear-gradient(left,  #FFF593 0%,#b20a2c 100%); /* Chrome10-25,Safari5.1-6 */
background: linear-gradient(to right,  #FFF593 0%,#b20a2c 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */

`;

const LoginWrap = styled.div`
  background-color: rgba(255, 255, 255, 0.6);
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 8px;
  transition: all 0.5s;
  &:hover{
    background-color: rgba(255,255,255,1);
  }
`;
const LoginInner = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px 50px;
  p {
    width: 400px;
    text-align: center;
    margin-bottom: 10px;
  }
  img {
    width: 100%;
  }
  button{
    padding: 10px 60px;
    border: solid 1px #111;
    font-size: 15px;
    border-radius: 4px;
  }
`;
