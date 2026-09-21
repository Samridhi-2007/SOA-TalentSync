import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCandidateApplications } from '../../services/api'

const statusOptions = [
  { value: 'ALL', label: 'All' },
  { value: 'APPLIED', label: 'Applied' },
  { value: 'SHORTLISTED', label: 'Shortlisted' },
  { value: 'INTERVIEW', label: 'Interview' },
  { value: 'HIRED', label: 'Hired' },
  { value: 'REJECTED', label: 'Rejected' },
]

function statusClass(status) {
  return `application-status application-status-${status.toLowerCase()}`
}

function formatDate(application) {
  if (!application.submittedAt) return ''
  const date = new Date(application.submittedAt)
  return Number.isNaN(date.getTime()) ? application.submittedAt : date.toLocaleDateString()
}

export default function Applications() {
  const [applications, setApplications] = useState([])
  const [selectedStatus, setSelectedStatus] = useState('ALL')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const email = localStorage.getItem('userEmail')

    if (!email) {
      setError('We could not find your candidate email. Please sign in again.')
      setLoading(false)
      return
    }

    getCandidateApplications(email)
      .then((response) => {
        const returnedApplications = Array.isArray(response) ? response : response?.applications || []
        const candidateApplications = returnedApplications.filter((application) => {
          return !application.candidate || application.candidate.toLowerCase() === email.toLowerCase()
        })
        setApplications(candidateApplications)
      })
      .catch((requestError) => setError(requestError.message || 'Unable to load your applications.'))
      .finally(() => setLoading(false))
  }, [])

  const filteredApplications = applications.filter((application) => {
    return selectedStatus === 'ALL' || (application.status || '').toUpperCase() === selectedStatus
  })

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
        <div className="section-heading">
          <div>
            <p className="eyebrow">YOUR PROGRESS</p>
            <h1>Applications</h1>
          </div>
          <span className="pill">{applications.length} total</span>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <label>
            Filter by status
            <select value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value)} style={{ display: 'block', width: '100%', maxWidth: '280px', marginTop: '7px', padding: '12px', border: '1px solid #cbd8ca', borderRadius: '8px', background: '#ffffff' }}>
              {statusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
        </div>

        {loading && <p role="status">Loading your applications...</p>}
        {error && <p role="alert" style={{ color: '#a33a32' }}>{error}</p>}
        {!loading && !error && applications.length === 0 && <p>No applications found.</p>}
        {!loading && !error && applications.length > 0 && filteredApplications.length === 0 && <p>No applications match the selected status.</p>}

        {!loading && !error && filteredApplications.length > 0 && (
          <div style={{ display: 'grid', gap: '16px' }}>
            {filteredApplications.map((application) => {
              const status = (application.status || '').toUpperCase()

              return (
                <article key={application.id || `${application.jobId}-${application.jobTitle}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '24px', flexWrap: 'wrap', background: '#ffffff', border: '1px solid #dce4d7', borderRadius: '14px', padding: '22px 24px' }}>
                  <div>
                    <p className="eyebrow" style={{ marginBottom: '8px' }}>APPLICATION</p>
                    <h2 style={{ margin: 0 }}>{application.jobTitle}</h2>
                    <p style={{ color: '#637169', marginBottom: 0 }}>
                      Job ID: {application.jobId}
                      {application.candidate && ` · ${application.candidate}`}
                    </p>
                    {formatDate(application) && <small style={{ color: '#8a968d' }}>Applied {formatDate(application)}</small>}
                    {application.id && <small style={{ color: '#8a968d' }}>Application ID: {application.id}</small>}
                  </div>
                  <span className={statusClass(status)} style={{ background: '#e9f3c4', color: '#69880d', borderRadius: '20px', padding: '8px 13px', fontSize: '12px', fontWeight: 700 }}>
                    {status}
                  </span>
                </article>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
