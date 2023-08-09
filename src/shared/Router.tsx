import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Home, DetailAlbum, DetailForm, SocialLogin } from "../pages";
import Layout from "./Layout";
import GlobalStyle from "../GlobalStyle";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import GetAccessToken from "../components/GetAccessToken/GetAccessToken";

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
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/:album_id" element={<DetailAlbum />} />
          <Route path="/:album_id/comments" element={<DetailForm />} />
          <Route path="/access" element={<GetAccessToken />} />
        </Route>
      </Routes>
    </>
  );
};

export default Router;
