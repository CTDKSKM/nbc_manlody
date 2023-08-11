import { Route, Routes } from 'react-router-dom';
import { Home, DetailAlbum, SocialLogin } from '../pages';
import Layout from './Layout';
import GlobalStyle from '../GlobalStyle';
import PlayList from '../pages/PlayList';
import ColorTest from '../pages/ColorTest';

const Router = () => {
  return (
    <>
      <GlobalStyle />
      <Routes>
        <Route path="/login" element={<SocialLogin />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/playlist" element={<PlayList />} />
          <Route path="/detail/:album_id" element={<DetailAlbum />} />
          <Route path="/access" element={<ColorTest />} />

        </Route>
      </Routes>
    </>
  );
};

export default Router;
