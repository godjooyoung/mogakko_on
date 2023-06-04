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
  width: 100%;
  height: 100%;
  background-color: #172435;
`

export default BgContainer