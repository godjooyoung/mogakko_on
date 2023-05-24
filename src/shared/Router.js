import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import Test from "../pages/sample/Test";
import Test2 from "../pages/sample/Test2";
import Example0 from "../pages/sample/Example0"
import Example1 from "../pages/sample/Example1"
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<><Header/><SignIn/><Footer/></>}/>
        <Route path="/signup" element={<><Header/><SignUp/><Footer/></>} />
        <Route path="/sample/example0" element={<Example0/>} />
        <Route path="/sample/example1" element={<Example1/>} />
        <Route path="/test" element={<Test/>} />
        <Route path="/test2" element={<Test2/>} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
