import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Home, DetailAlbum, SocialLogin } from '../pages';
import Layout from './Layout';
import GlobalStyle from '../GlobalStyle';
import PlayList from '../pages/PlayList';
import FavoriteSongs from '../pages/FavoriteSongs';
import { styled } from 'styled-components';

const images: string[] = [
  '/test_wallpaper_1.jpg',
  '/test_wallpaper_2.jpg',
  '/test_wallpaper_3.jpg',
  '/test_wallpaper_4.jpg'
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
  const [opacity, setOpacity] = useState<number>(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setDarkened(true);
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        setDarkened(false);
        setOpacity(0.5); // 이미지 어두워짐
        setTimeout(() => {
          setOpacity(1); // 이미지 밝아짐
        }, 5000); // 1.5초로 조정하여 더 천천히 전환됨
      }, 700);
    }, 10000); // 7초로 interval 간격을 늘림

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <GlobalStyle />
      <BackgroundImageContainer image={images[currentImageIndex]} darkened={darkened} />
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
