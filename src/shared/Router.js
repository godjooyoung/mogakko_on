import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import Main from "../pages/Main"
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import BgContainer from "../components/common/BgContainer";
import Layout from "../components/common/Layout";
import Room from "../pages/Room";
import Mypage from "../pages/Mypage";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<BgContainer />}>
          <Route element={<Layout />}>
            <Route path="/" element={<><Header /><Main /></>} />
            <Route path="/signin" element={<><Header /><SignIn /></>} />
            <Route path="/signup" element={<><Header /><SignUp /></>} />
            <Route path="/room" element={<Room />} />
            <Route path="/mypage" element={<Mypage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
