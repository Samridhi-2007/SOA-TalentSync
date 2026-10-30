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
import RecruiterApplications from './pages/recruiter/Applications'
import RecruiterJobs from './pages/recruiter/Jobs'
import RecruiterProfile from './pages/recruiter/Profile'
import AdminUsers from './pages/admin/Users'
import { getCurrentUserRole } from './services/api'
import Home from './pages/Home'

function RootRedirect() {
  const role = getCurrentUserRole()
  return (
    <Navigate
      to={localStorage.getItem('token')
        ? (role === 'ADMIN' ? '/admin/users' : role === 'RECRUITER' ? '/recruiter/applications' : '/candidate/dashboard')
        : '/home'}
      replace
    />
  )
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/home" element={<Home />} />

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

          <Route
            path="/recruiter/applications"
            element={<RecruiterApplications />}
          />

          <Route
            path="/recruiter/jobs"
            element={<RecruiterJobs />}
          />

          <Route
            path="/recruiter/profile"
            element={<RecruiterProfile />}
          />

          <Route
            path="/admin/users"
            element={<AdminUsers />}
          />
        </Route>

        <Route path="*" element={<RootRedirect />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
