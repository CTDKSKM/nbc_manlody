import { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Home, DetailAlbum, SocialLogin } from '../pages';
import Layout from './Layout';
import GlobalStyle from '../GlobalStyle';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import GetAccessToken from '../components/GetAccessToken/GetAccessToken';
import TestPage from '../pages/TestPage';
import PlayList from '../pages/PlayList';
import { accessToken } from '../components/Header';
import FavoriteSongs from '../pages/FavoriteSongs';

const Router = () => {
  // const navigate = useNavigate();
  // const [render, setRender] = useState(false);
  // useEffect(() => {
  //   onAuthStateChanged(auth, (user) => {
  //     if (!user || !accessToken) navigate('/login');
  //     setRender(true);
  //   });
  // }, []);
  return (
    <>
      <GlobalStyle />
      <Routes>
        <Route path="/login" element={<SocialLogin />} />
        {/* <Route path="/auth" element={<GetAccessToken />} /> */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/playlist" element={<PlayList />} />
          <Route path="/favorites" element={<FavoriteSongs />} />
          <Route path="/detail/:album_id" element={<DetailAlbum />} />
        </Route>
      </Routes>
    </>
  );
};

export default Router;
