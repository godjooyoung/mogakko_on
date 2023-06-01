import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";

import Main from "../pages/Main"
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import Room from "../pages/Room";
// import Terms from "../pages/Terms";
const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<><Header/><Main/></>} />
        <Route path="/signin" element={<><Header/><SignIn/><Footer/></>}/>
        <Route path="/signup" element={<><Header/><SignUp/><Footer/></>} />
        <Route path="/room" element={<Room/>} />
<<<<<<< HEAD
        {/* <Route path="/terms" element={<Terms/>}/> */}

=======
        <Route path="/terms" element={<Terms/>}/>
>>>>>>> f21d15a1c307924073ff25e36b251ba30cc8133c
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
