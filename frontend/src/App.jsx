import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'

import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/candidate/Dashboard'
import Applications from './pages/candidate/Applications'
import JobDetails from './pages/candidate/JobDetails'
import Jobs from './pages/candidate/Jobs'
import Profile from './pages/candidate/Profile'
import Login from './pages/Login'
import Register from './pages/Register'

function RootRedirect() {
  return (
    <Navigate
      to={localStorage.getItem('token') ? '/candidate/dashboard' : '/login'}
      replace
    />
  )
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route
            path="/candidate/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/candidate/jobs"
            element={<Jobs />}
          />

          <Route
            path="/candidate/jobs/:id"
            element={<JobDetails />}
          />

          <Route
            path="/candidate/applications"
            element={<Applications />}
          />

          <Route
            path="/candidate/profile"
            element={<Profile />}
          />
        </Route>

        <Route path="*" element={<RootRedirect />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes