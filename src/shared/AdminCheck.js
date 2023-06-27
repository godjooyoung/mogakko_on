import React from 'react'
import { getCookie } from '../cookie/Cookie';
import { Navigate, Outlet } from 'react-router-dom'

function AdminCheck() {
  const adminCheck = getCookie('admin')
  if (adminCheck) {
    return <Navigate to={"/admin"}/>
  } else if (!adminCheck) {
    return <Outlet />;
  }
}

export default AdminCheck