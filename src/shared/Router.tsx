import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Home, DetailAlbum, SocialLogin } from '../pages';
import Layout from './Layout';
import GlobalStyle from '../GlobalStyle';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import GetAccessToken from '../components/GetAccessToken/GetAccessToken';
import TestPage from '../pages/TestPage';
import { accessToken } from '../components/Header';
import { styled } from 'styled-components';

const Router = () => {
  const navigate = useNavigate();
  const [render, setRender] = useState(false);
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user || !accessToken) navigate('/login');
      setRender(true);
    });
  }, []);
  return (
    <>
      <GlobalStyle />
      <BackgroundImageContainer />
      <Routes>
        <Route path="/login" element={<SocialLogin />} />
        {/* <Route path="/auth" element={<GetAccessToken />} /> */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/detail/:album_id" element={<DetailAlbum />} />
        </Route>
      </Routes>
    </>
  );
};

export default Router;

const BackgroundImageContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('/test_wallpaper.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  z-index: -1;
`;
