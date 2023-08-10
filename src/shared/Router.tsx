import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Home, DetailAlbum, SocialLogin } from "../pages";
import Layout from "./Layout";
import GlobalStyle from "../GlobalStyle";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import GetAccessToken from "../components/GetAccessToken/GetAccessToken";
import TestPage from "../pages/TestPage";


const Router = () => {
  const navigate = useNavigate();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) navigate("/login");
    });
  }, []);
  return (
    <>
      <GlobalStyle />
      <Routes>
        <Route path="/login" element={<SocialLogin />} />
        {/* <Route path="/auth" element={<GetAccessToken />} /> */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/detail/:album_id" element={<DetailAlbum />} />
          <Route path="/access" element={<TestPage />} />
        </Route>
      </Routes>
    </>
  );
};

export default Router;
