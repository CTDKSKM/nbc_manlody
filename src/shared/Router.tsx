import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home, DetailAlbum, DetailForm, SocialLogin } from "../pages/index.js";
import Layout from "./Layout";
import GlobalStyle from "../GlobalStyle";

const Router = () => {
  return (
    <BrowserRouter>
      <GlobalStyle />
      <Routes>
        <Route path="/login" element={<SocialLogin />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/:album_id" element={<DetailAlbum />} />
          <Route path="/:album_id/comments" element={<DetailForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
