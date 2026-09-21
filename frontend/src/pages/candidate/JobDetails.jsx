import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { applyForJob, getCandidateApplications, getJobById } from '../../services/api'

export default function JobDetails() {
  const { id } = useParams()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [checkingApplication, setCheckingApplication] = useState(true)
  const [alreadyApplied, setAlreadyApplied] = useState(false)
  const [fetchError, setFetchError] = useState('')
  const [applicationStatusError, setApplicationStatusError] = useState('')
  const [applying, setApplying] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [applicationError, setApplicationError] = useState('')

  useEffect(() => {
    if (!id) {
      setFetchError('The job could not be found.')
      setLoading(false)
      return
    }

    const email = localStorage.getItem('userEmail')

    if (!email) {
      setFetchError('We could not find your candidate email. Please sign in again.')
      setLoading(false)
      setCheckingApplication(false)
      return
    }

    Promise.all([getJobById(id), getCandidateApplications(email)])
      .then(([jobResponse, applicationsResponse]) => {
        if (!jobResponse) {
          setFetchError('The job could not be found.')
          return
        }

        setJob(jobResponse)
        const applications = Array.isArray(applicationsResponse)
          ? applicationsResponse
          : applicationsResponse?.applications || []
        const hasApplication = applications.some((application) => String(application.jobId) === String(jobResponse.id))
        setAlreadyApplied(hasApplication)
      })
      .catch((requestError) => {
        setFetchError(requestError.message || 'Unable to load this job.')
        setApplicationStatusError('Unable to check your application status.')
      })
      .finally(() => {
        setLoading(false)
        setCheckingApplication(false)
      })
  }, [id])

  const isOpen = (job?.status || '').toUpperCase() === 'OPEN'

  const handleApply = async () => {
    if (!job || !isOpen || applying || checkingApplication || alreadyApplied) return

    const candidateEmail = localStorage.getItem('userEmail')
    if (!candidateEmail) {
      setApplicationError('We could not find your candidate email. Please sign in again.')
      return
    }

    setApplying(true)
    setSuccessMessage('')
    setApplicationError('')

    try {
      await applyForJob({
        jobId: job.id,
        jobTitle: job.title,
        candidate: candidateEmail,
      })
      setAlreadyApplied(true)
      setSuccessMessage('Application submitted successfully.')
    } catch (requestError) {
      if (requestError.message?.toLowerCase().includes('already applied')) {
        setAlreadyApplied(true)
        setApplicationError('You have already applied for this position.')
      } else {
        setApplicationError(requestError.message || 'Unable to submit your application.')
      }
    } finally {
      setApplying(false)
    }
  }

  return (
    <div className="app">
      <header>
        <div><span className="logo">TS</span><span className="brand">Talent<span>Sync</span></span></div>
        <nav>
          <Link to="/candidate/dashboard">Dashboard</Link>
          <Link to="/candidate/jobs">Jobs</Link>
          <Link to="/candidate/applications">Applications</Link>
          <Link to="/candidate/profile">Profile</Link>
        </nav>
      </header>

      <main className="section">
        <Link to="/candidate/jobs" style={{ color: '#6d8e16', fontWeight: 700, textDecoration: 'none' }}>← Back to Jobs</Link>

        {loading && (
          <>
            <p role="status" style={{ marginTop: '40px' }}>Loading job details...</p>
            {checkingApplication && <p role="status">Checking application status...</p>}
          </>
        )}
        {fetchError && <p role="alert" style={{ color: '#a33a32', marginTop: '40px' }}>{fetchError}</p>}
        {!loading && !fetchError && checkingApplication && <p role="status" style={{ marginTop: '24px' }}>Checking application status...</p>}

        {!loading && !fetchError && job && (
          <article style={{ marginTop: '32px', background: '#ffffff', border: '1px solid #dce4d7', borderRadius: '18px', padding: 'clamp(24px, 5vw, 48px)', boxShadow: '0 16px 45px #bac8b544' }}>
            <p className="eyebrow">JOB OPPORTUNITY</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '24px', flexWrap: 'wrap' }}>
              <div>
                <h1 style={{ margin: 0 }}>{job.title}</h1>
                <p style={{ color: '#637169', fontSize: '18px', marginBottom: 0 }}>{job.department || 'Department not specified'}</p>
              </div>
              <span style={{ background: isOpen ? '#e9f3c4' : '#edf0ec', color: isOpen ? '#69880d' : '#637169', borderRadius: '20px', padding: '8px 14px', fontWeight: 700 }}>{job.status || 'Status not specified'}</span>
            </div>

            <div style={{ marginTop: '40px' }}>
              <h2>About the role</h2>
              <p style={{ color: '#637169', lineHeight: 1.8, whiteSpace: 'pre-line' }}>{job.description || 'No description available.'}</p>
            </div>

            {!isOpen && <p role="status" style={{ color: '#637169' }}>This job is not currently open for applications.</p>}
            {applicationStatusError && <p role="alert" style={{ color: '#a33a32' }}>{applicationStatusError}</p>}
            {alreadyApplied && <p role="status" style={{ color: '#587915' }}>You have already applied for this position.</p>}
            {successMessage && <p role="status" style={{ color: '#587915' }}>{successMessage}</p>}
            {applicationError && <p role="alert" style={{ color: '#a33a32' }}>{applicationError}</p>}

            <button type="button" onClick={handleApply} disabled={!isOpen || applying || checkingApplication || alreadyApplied || Boolean(applicationStatusError)} style={{ marginTop: '16px', opacity: !isOpen || applying || checkingApplication || alreadyApplied || applicationStatusError ? 0.6 : 1 }}>
              {checkingApplication ? 'Checking application status...' : applying ? 'Submitting...' : alreadyApplied ? 'Already Applied' : 'Apply Now'}
            </button>
          </article>
        )}
      </main>
    </div>
  )
}
