import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import Header from "../components/Header";
import { styled } from "styled-components";
import Player from "../components/Dashboard/Player";

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
                    <Player/>
                </ContentWrapper>
                
            </Wrapper>
        </>
    );
};

export default Layout;

const Wrapper = styled.div`
    width: 80vw;
    height: 75vh;
    margin: 0 auto;
    padding: 2rem;

    display: flex;
    justify-content: center;

    margin-top: 4rem;
    background: linear-gradient(145deg, gray, lightgray, gray);
    border-radius: 10px;
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
