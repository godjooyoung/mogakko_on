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
  /* background-color: #172435;
  background-color: #010D25;
  background-color: #5A30D2; //1E143D
  background-color: #1E143D;
  background-color: #4425A7; //#311294
  background-color: #311294; //#4425A7 */
  background-color: var(--bg-de); //rgb(19, 31, 55)
`

export default BgContainer