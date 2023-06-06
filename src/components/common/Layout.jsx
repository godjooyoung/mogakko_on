import React from 'react'
import { Outlet } from "react-router-dom";
import { styled } from "styled-components";

function Layout() {
  return (
    <>
    <MaxWidth>
      <Outlet />
    </MaxWidth>
    </>
  )
}

const MaxWidth = styled.div`
  max-width: 1280px;
  min-height: 937px;
  margin: 0 auto;
`
export default Layout