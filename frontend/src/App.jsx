import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'

import ProtectedRoute from './components/ProtectedRoute'
import RecruiterRoute from './components/RecruiterRoute'

// Candidate pages
import Dashboard from './pages/candidate/Dashboard'
import Applications from './pages/candidate/Applications'
import JobDetails from './pages/candidate/JobDetails'
import Jobs from './pages/candidate/Jobs'
import Profile from './pages/candidate/Profile'

// Authentication
import Login from './pages/Login'
import Register from './pages/Register'

// Recruiter pages
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard'
import RecruiterJobs from './pages/recruiter/RecruiterJobs'
import CreateJob from './pages/recruiter/CreateJob'
import EditJob from './pages/recruiter/EditJob'
import JobApplications from './pages/recruiter/JobApplications'
import CandidateDetails from './pages/recruiter/CandidateDetails'
import RecruiterProfile from './pages/recruiter/RecruiterProfile'

function RootRedirect() {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('userRole')

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (role === 'RECRUITER') {
    return <Navigate to="/recruiter/dashboard" replace />
  }

  return <Navigate to="/candidate/dashboard" replace />
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ==================== Root ==================== */}

        <Route path="/" element={<RootRedirect />} />

        {/* ==================== Authentication ==================== */}

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ==================== Logged-in Routes ==================== */}

        <Route element={<ProtectedRoute />}>

          {/* ==================== Candidate Routes ==================== */}

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

          {/* ==================== Recruiter Routes ==================== */}

          <Route element={<RecruiterRoute />}>

            <Route
              path="/recruiter/dashboard"
              element={<RecruiterDashboard />}
            />

            <Route
              path="/recruiter/jobs"
              element={<RecruiterJobs />}
            />

            <Route
              path="/recruiter/jobs/create"
              element={<CreateJob />}
            />

            <Route
              path="/recruiter/jobs/:id/edit"
              element={<EditJob />}
            />

            <Route
              path="/recruiter/jobs/:id/applications"
              element={<JobApplications />}
            />

            <Route
              path="/recruiter/candidates/:id"
              element={<CandidateDetails />}
            />

            <Route
              path="/recruiter/profile"
              element={<RecruiterProfile />}
            />

          </Route>

        </Route>

        {/* ==================== Unknown Routes ==================== */}

        <Route path="*" element={<RootRedirect />} />

      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes