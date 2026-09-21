import { Navigate, Outlet } from 'react-router-dom'

export default function RecruiterRoute() {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('userRole')

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (role !== 'RECRUITER') {
    return <Navigate to="/candidate/dashboard" replace />
  }

  return <Outlet />
}