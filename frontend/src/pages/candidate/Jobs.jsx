import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getJobs } from '../../services/api'

function uniqueValues(jobs, field) {
  return [...new Set(jobs.map((job) => job[field]).filter(Boolean))].sort()
}

export default function Jobs() {
  const [jobs, setJobs] = useState([])
  const [search, setSearch] = useState('')
  const [department, setDepartment] = useState('ALL')
  const [status, setStatus] = useState('OPEN')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getJobs()
      .then((response) => {
        const returnedJobs = Array.isArray(response) ? response : []
        setJobs(returnedJobs)

        const openJob = returnedJobs.find((job) => (job.status || '').toUpperCase() === 'OPEN')
        setStatus(openJob?.status || 'ALL')
      })
      .catch((requestError) => setError(requestError.message || 'Unable to load jobs.'))
      .finally(() => setLoading(false))
  }, [])

  const departments = uniqueValues(jobs, 'department')
  const statuses = uniqueValues(jobs, 'status')
  const normalizedSearch = search.trim().toLowerCase()

  const filteredJobs = jobs.filter((job) => {
    const jobStatus = (job.status || '').toUpperCase()
    const matchesSearch = (job.title || '').toLowerCase().includes(normalizedSearch)
    const matchesDepartment = department === 'ALL' || job.department === department
    const matchesStatus = status === 'ALL' || jobStatus === status.toUpperCase()

    return matchesSearch && matchesDepartment && matchesStatus
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
            <p className="eyebrow">OPPORTUNITIES</p>
            <h1>Find your next role</h1>
          </div>
          <span className="pill">{filteredJobs.length} jobs</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(220px, 2fr) repeat(2, minmax(160px, 1fr))', gap: '12px', marginBottom: '32px' }}>
          <label>
            Search by title
            <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search jobs" style={{ display: 'block', width: '100%', marginTop: '7px', padding: '12px', border: '1px solid #cbd8ca', borderRadius: '8px' }} />
          </label>
          <label>
            Department
            <select value={department} onChange={(event) => setDepartment(event.target.value)} style={{ display: 'block', width: '100%', marginTop: '7px', padding: '12px', border: '1px solid #cbd8ca', borderRadius: '8px', background: '#ffffff' }}>
              <option value="ALL">All Departments</option>
              {departments.map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>
          <label>
            Status
            <select value={status} onChange={(event) => setStatus(event.target.value)} style={{ display: 'block', width: '100%', marginTop: '7px', padding: '12px', border: '1px solid #cbd8ca', borderRadius: '8px', background: '#ffffff' }}>
              <option value="ALL">All Statuses</option>
              {statuses.map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>
        </div>

        {loading && <p role="status">Loading jobs...</p>}
        {error && <p role="alert" style={{ color: '#a33a32' }}>{error}</p>}
        {!loading && !error && filteredJobs.length === 0 && <p>No matching jobs found.</p>}

        {!loading && !error && filteredJobs.length > 0 && (
          <div style={{ display: 'grid', gap: '16px' }}>
            {filteredJobs.map((job) => (
              <article className="job" key={job.id} style={{ alignItems: 'flex-start' }}>
                <div className="job-icon">{(job.title || 'J')[0]}</div>
                <div className="job-info">
                  <h2>{job.title}</h2>
                  <p>{job.department || 'Department not specified'}</p>
                  <small>{job.description || 'No description available.'}</small>
                  <span style={{ display: 'inline-block', marginTop: '12px', background: '#e9f3c4', color: '#69880d', borderRadius: '20px', padding: '6px 10px', fontSize: '12px', fontWeight: 700 }}>{job.status || 'Status not specified'}</span>
                </div>
                <Link className="primary" to={`/candidate/jobs/${job.id}`}>View Details</Link>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
