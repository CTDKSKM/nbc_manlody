import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import Header from "../components/Header";
import { styled } from "styled-components";

const Layout = () => {
  return (
    <StLayout>
      <div className="navbar-container">
        <NavBar />
      </div>
      <div className="header-main-wrap">
        <div className="header-container">
          <Header />
        </div>
        <div className="outlet-container">
          <Outlet />
        </div>
      </div>
    </StLayout>
  );
};

export default Layout;
const StLayout = styled.div`
  display: flex;
  margin: 5% auto;
  width: 90%;

  .navbar-container {
    width: 15%;
    height: 90%;
  }

  .header-main-wrap {
    width: 85%;
  }

  .header-container {
    border: 1px solid gray;
  }

  .outlet-container {
    border: 1px solid gray;
    height: 90%;
  }
`;
