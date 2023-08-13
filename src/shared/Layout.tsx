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

  &::before {
    z-index: -0.5;
    content: '';
    position: absolute;
    border-radius: 10px;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 1;
    filter: blur(0.5px);
    pointer-events: none;
    backdrop-filter: blur(8px);
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.46);
  }
`;
const NavBarWrapper = styled.div`
  flex: 0.65;
  padding: 1rem;
  overflow: hidden;
`;

const ContentWrapper = styled.div`
  flex: 3;
  margin: 0 auto;
  padding: 1rem 1rem 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;
