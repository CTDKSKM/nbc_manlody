import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Header from '../components/Header';
import { styled } from 'styled-components';
import Player from '../components/Dashboard/Player';

const Layout = () => {
  return (
    <>
      <Wrapper>
        <NavBarWrapper>
          <NavBar />
        </NavBarWrapper>
        <ContentWrapper>
          <Header />
          <Outlet />
          <Player />
        </ContentWrapper>
      </Wrapper>
    </>
  );
};

export default Layout;

const Wrapper = styled.div`
  width: 80vw;
  margin: 0 auto;
  padding: 2rem;

  display: flex;
  justify-content: center;

  margin-top: 4.5rem;
  border-radius: 10px;
  position: relative;

  //   background: linear-gradient(145deg, gray, lightgray, gray);

  &::before {
    z-index: -0.5;
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url('/123.jpg'); /* Adjust the path to your noise image */
    opacity: 0.7; /* Adjust the opacity of the noise effect */
    filter: blur(0.111px); /* Add the blur filter for the bokeh effect */
    pointer-events: none;
  }
`;
const BackgroundImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(5px); /* Apply blur effect to the image */
`;
const NavBarWrapper = styled.div`
  flex: 0.65;
  padding: 1rem;
  // height: 100vh;
  overflow: hidden;

  // border: 1px dotted gray;
  // background-color: lightgray; // 네비게이션 바 배경색
`;

const ContentWrapper = styled.div`
  flex: 3;
  margin: 0 auto;
  // background-color: white; // 컨텐츠 배경색
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;
