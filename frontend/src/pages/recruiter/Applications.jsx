import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { downloadCandidateResume, getAllApplications, getCurrentUserRole, updateApplicationStatus, updateInterviewTime } from '../../services/api'

const statusOptions = ['APPLIED', 'SHORTLISTED', 'INTERVIEW', 'HIRED', 'REJECTED']

function formatDate(value) {
  if (!value) return 'Date unavailable'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString()
}

export default function RecruiterApplications() {
  const role = getCurrentUserRole()
  const [applications, setApplications] = useState([])
  const [selectedStatus, setSelectedStatus] = useState('ALL')
  const [pendingStatuses, setPendingStatuses] = useState({})
  const [interviewDrafts, setInterviewDrafts] = useState({})
  const [savingInterviewId, setSavingInterviewId] = useState(null)
  const [downloadingEmail, setDownloadingEmail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!['RECRUITER', 'ADMIN'].includes(role)) return
    getAllApplications()
      .then((response) => setApplications(Array.isArray(response) ? response : []))
      .catch((requestError) => setError(requestError.message || 'Unable to load applications.'))
      .finally(() => setLoading(false))
  }, [role])

  if (!['RECRUITER', 'ADMIN'].includes(role)) {
    return <Navigate to="/candidate/dashboard" replace />
  }

  const visibleApplications = applications.filter((application) => (
    selectedStatus === 'ALL' || (application.status || '').toUpperCase() === selectedStatus
  ))

  const saveStatus = async (application) => {
    const status = pendingStatuses[application.id] || application.status
    setSavingId(application.id)
    setError('')
    setMessage('')

    try {
      const updated = await updateApplicationStatus(application.id, status)
      setApplications((current) => current.map((item) => item.id === application.id ? updated : item))
      setPendingStatuses((current) => {
        const next = { ...current }
        delete next[application.id]
        return next
      })
      setMessage(`Application ${application.id} updated to ${status}.`)
    } catch (requestError) {
      setError(requestError.message || 'Unable to update the application.')
    } finally {
      setSavingId(null)
    }
  }

  const saveInterviewTime = async (application) => {
    const value = interviewDrafts[application.id]
    if (!value) {
      setError('Choose an interview date and time first.')
      return
    }
    setSavingInterviewId(application.id)
    setError('')
    setMessage('')
    try {
      const updated = await updateInterviewTime(application.id, value)
      setApplications((current) => current.map((item) => item.id === application.id ? updated : item))
      setInterviewDrafts((current) => {
        const next = { ...current }
        delete next[application.id]
        return next
      })
      setMessage(`Interview scheduled for application ${application.id}.`)
    } catch (requestError) {
      setError(requestError.message || 'Unable to schedule the interview.')
    } finally {
      setSavingInterviewId(null)
    }
  }

  const downloadResume = async (email) => {
    setDownloadingEmail(email)
    setError('')
    try {
      const { blob, fileName } = await downloadCandidateResume(email)
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      link.remove()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch (requestError) {
      setError(requestError.message || 'Unable to download this resume.')
    } finally {
      setDownloadingEmail(null)
    }
  }

  return (
    <div className="app">
      <header>
        <div><span className="logo">TS</span><span className="brand">Talent<span>Sync</span></span></div>
        <nav>
          <Link to="/recruiter/jobs">Job listings</Link>
          <Link to="/recruiter/applications">Applications</Link>
          <Link to="/recruiter/profile">Profile</Link>
        </nav>
      </header>

      <main className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">RECRUITER WORKSPACE</p>
            <h1>Candidate applications</h1>
          </div>
          <span className="pill">{applications.length} total</span>
        </div>

        <label>
          Filter by stage
          <select value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value)} style={{ display: 'block', width: '100%', maxWidth: '280px', marginTop: '7px', padding: '12px', border: '1px solid #cbd8ca', borderRadius: '8px', background: '#ffffff' }}>
            <option value="ALL">All applications</option>
            {statusOptions.map((status) => <option key={status} value={status}>{status.replaceAll('_', ' ')}</option>)}
          </select>
        </label>

        {loading && <p role="status">Loading applications...</p>}
        {error && <p role="alert" style={{ color: '#a33a32' }}>{error}</p>}
        {message && <p role="status" style={{ color: '#587915' }}>{message}</p>}
        {!loading && !error && applications.length === 0 && <p>No candidate applications yet.</p>}
        {!loading && !error && applications.length > 0 && visibleApplications.length === 0 && <p>No applications match this stage.</p>}

        {!loading && visibleApplications.length > 0 && (
          <div style={{ display: 'grid', gap: '16px', marginTop: '24px' }}>
            {visibleApplications.map((application) => {
              const currentStatus = (application.status || 'APPLIED').toUpperCase()
              const selected = pendingStatuses[application.id] || currentStatus
              return (
                <article key={application.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', flexWrap: 'wrap', background: '#ffffff', border: '1px solid #dce4d7', borderRadius: '14px', padding: '22px 24px' }}>
                  <div>
                    <p className="eyebrow" style={{ marginBottom: '8px' }}>APPLICATION #{application.id}</p>
                    <h2 style={{ margin: 0 }}>{application.jobTitle || `Job ${application.jobId}`}</h2>
                    <p style={{ color: '#637169', marginBottom: '4px' }}>{application.candidate}</p>
                    <small style={{ color: '#8a968d' }}>Submitted {formatDate(application.submittedAt)}</small>
                    {application.interviewAt && <p style={{ color: '#637169', marginBottom: 0 }}>Interview: {formatDate(application.interviewAt)}</p>}
                    {application.candidate && <button type="button" className="outline" onClick={() => downloadResume(application.candidate)} disabled={downloadingEmail === application.candidate} style={{ marginTop: '10px' }}>{downloadingEmail === application.candidate ? 'Downloading...' : 'Download resume'}</button>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <label>
                      Stage
                      <select value={selected} onChange={(event) => setPendingStatuses((current) => ({ ...current, [application.id]: event.target.value }))} style={{ display: 'block', marginTop: '5px', padding: '10px', border: '1px solid #cbd8ca', borderRadius: '8px', background: '#ffffff' }}>
                        {statusOptions.map((status) => <option key={status} value={status}>{status.replaceAll('_', ' ')}</option>)}
                      </select>
                    </label>
                    <button type="button" onClick={() => saveStatus(application)} disabled={savingId === application.id || selected === currentStatus} style={{ opacity: savingId === application.id || selected === currentStatus ? 0.6 : 1 }}>
                      {savingId === application.id ? 'Saving...' : 'Save stage'}
                    </button>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'end', gap: '10px', flexWrap: 'wrap' }}>
                    <label>
                      Interview time
                      <input type="datetime-local" value={interviewDrafts[application.id] ?? (application.interviewAt ? application.interviewAt.slice(0, 16) : '')} onChange={(event) => setInterviewDrafts((current) => ({ ...current, [application.id]: event.target.value }))} style={{ display: 'block', marginTop: '5px', padding: '10px', border: '1px solid #cbd8ca', borderRadius: '8px' }} />
                    </label>
                    <button type="button" onClick={() => saveInterviewTime(application)} disabled={savingInterviewId === application.id} style={{ opacity: savingInterviewId === application.id ? 0.6 : 1 }}>
                      {savingInterviewId === application.id ? 'Saving...' : application.interviewAt ? 'Reschedule' : 'Schedule interview'}
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
