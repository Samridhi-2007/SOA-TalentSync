import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCandidateApplications } from '../../services/api'

const statusLabels = ['APPLIED', 'SHORTLISTED', 'INTERVIEW', 'HIRED', 'REJECTED']

function formatDate(application) {
  const dateValue = application.submittedAt || application.applicationDate || application.appliedAt || application.createdAt || application.date

  if (!dateValue) {
    return ''
  }

  const date = new Date(dateValue)
  return Number.isNaN(date.getTime()) ? String(dateValue) : date.toLocaleDateString()
}

function statusClass(status) {
  return `dashboard-status dashboard-status-${status.toLowerCase()}`
}

export default function Dashboard() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    const email = localStorage.getItem('userEmail')

    if (!email) {
      setError('We could not find your candidate email. Please sign in again.')
      setLoading(false)
      return () => {
        active = false
      }
    }

    getCandidateApplications(email)
      .then((response) => {
        if (!active) return
        const candidateApplications = Array.isArray(response) ? response : response?.applications || []
        setApplications(candidateApplications)
      })
      .catch((requestError) => {
        if (active) {
          setError(requestError.message || 'Unable to load your applications.')
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const counts = statusLabels.reduce((result, status) => {
    result[status] = applications.filter((application) => (application.status || '').toUpperCase() === status).length
    return result
  }, {})

  const cards = [
    { label: 'Total Applications', value: applications.length },
    { label: 'Applied', value: counts.APPLIED },
    { label: 'Shortlisted', value: counts.SHORTLISTED },
    { label: 'Interview', value: counts.INTERVIEW },
    { label: 'Hired', value: counts.HIRED },
    { label: 'Rejected', value: counts.REJECTED },
  ]

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

      <main className="section dashboard-page">
        <div className="section-heading">
          <div>
            <p className="eyebrow">CANDIDATE PORTAL</p>
            <h1>Candidate Dashboard</h1>
          </div>
          <Link className="primary" to="/candidate/jobs">Find opportunities</Link>
        </div>

        {loading && <p role="status">Loading your applications...</p>}
        {error && <p role="alert" style={{ color: '#a33a32' }}>{error}</p>}

        {!loading && !error && (
          <>
            <section className="dashboard-cards" aria-label="Application summary" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginTop: '36px' }}>
              {cards.map((card) => (
                <article className="dashboard-card" key={card.label} style={{ background: '#ffffff', border: '1px solid #dce4d7', borderRadius: '12px', padding: '20px' }}>
                  <strong style={{ display: 'block', color: '#6f9118', fontSize: '30px' }}>{card.value}</strong>
                  <span style={{ color: '#637169', fontSize: '13px' }}>{card.label}</span>
                </article>
              ))}
            </section>

            <section className="dashboard-recent" style={{ marginTop: '64px' }}>
              <div className="section-heading">
                <div>
                  <p className="eyebrow">YOUR PROGRESS</p>
                  <h2>Recent applications</h2>
                </div>
                <span className="pill">{applications.length} total</span>
              </div>

              {applications.length === 0 ? (
                <p>No applications yet. Explore open roles to get started.</p>
              ) : (
                <div className="dashboard-application-list" style={{ display: 'grid', gap: '12px' }}>
                  {applications.map((application) => {
                    const status = (application.status || 'APPLIED').toUpperCase()
                    const date = formatDate(application)

                    return (
                      <article className="dashboard-application" key={application.id || `${application.jobId}-${application.jobTitle}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', background: '#ffffff', border: '1px solid #dce4d7', borderRadius: '12px', padding: '18px 20px' }}>
                        <div>
                          <h3 style={{ margin: 0 }}>{application.jobTitle || 'Untitled position'}</h3>
                          {date && <p style={{ color: '#637169', marginBottom: 0 }}>Applied {date}</p>}
                        </div>
                        <span className={statusClass(status)} style={{ background: '#e9f3c4', color: '#69880d', borderRadius: '20px', padding: '7px 12px', fontSize: '12px', fontWeight: 700 }}>{status}</span>
                      </article>
                    )
                  })}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  )
}
