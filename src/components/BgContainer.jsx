import React from 'react'
import { Outlet } from "react-router-dom";
import { styled } from "styled-components";

function BgContainer() {
  return (
    <>
      <FullScreen>
        <Outlet />
      </FullScreen>
    </>
  )
}

const FullScreen = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #172435;
`
export default BgContainer