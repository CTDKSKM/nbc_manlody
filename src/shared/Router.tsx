import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Home, DetailAlbum, SocialLogin } from '../pages';
import Layout from './Layout';
import GlobalStyle from '../GlobalStyle';
import PlayList from '../pages/PlayList';
import FavoriteSongs from '../pages/FavoriteSongs';
import { styled } from 'styled-components';
import LoginLoading from '../components/LoginLoading';

const images: string[] = [
  '/assets/No1_wallpaper.jpg',
  '/assets/No2_wallpaper.jpg',
  '/assets/No3_wallpaper.jpg',
  '/assets/No4_wallpaper.jpg'
];
interface BackgroundImageProps {
  image: string;
  darkened: boolean;
}

const BackgroundImageContainer = styled.div<BackgroundImageProps>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  z-index: -1;
  transition: opacity 1s ease;
  background-image: url(${(props) => props.image});
  opacity: ${(props) => (props.darkened ? 0.3 : 1)};
`;

const Router = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [darkened, setDarkened] = useState<boolean>(false);

  const [showLoading, setShowLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => {
      setShowLoading(false);
    }, 4000);
    //배경 darkened 시간 지정
    const interval = setInterval(() => {
      setDarkened(true);
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        setDarkened(false);
      }, 700);
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <GlobalStyle />
      <BackgroundImageContainer image={images[currentImageIndex]} darkened={darkened} />
      {/* showLoading 상태에 따라서 로딩컴포넌트 vs login 이후 화면*/}
      {showLoading ? (
        <LoginLoading />
      ) : (
        <Routes>
          <Route path="/login" element={<SocialLogin />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/playlist" element={<PlayList />} />
            <Route path="/favorites" element={<FavoriteSongs />} />
            <Route path="/detail/:album_id" element={<DetailAlbum />} />
          </Route>
        </Routes>
      )}
    </>
  );
};

export default Router;
