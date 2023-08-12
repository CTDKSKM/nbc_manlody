import { Route, Routes } from 'react-router-dom';
import { Home, DetailAlbum, SocialLogin } from '../pages';
import Layout from './Layout';
import GlobalStyle from '../GlobalStyle';
import PlayList from '../pages/PlayList';
import FavoriteSongs from '../pages/FavoriteSongs';
import { styled } from 'styled-components';

const Router = () => {
  return (
    <>
      <GlobalStyle />
      <BackgroundImageContainer />
      <Routes>
        <Route path="/login" element={<SocialLogin />} />
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
