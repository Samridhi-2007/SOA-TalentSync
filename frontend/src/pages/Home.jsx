import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCurrentUserRole, getJobs } from '../services/api'
import './Home.css'

export default function Home() {
  const role = getCurrentUserRole()
  const [jobs, setJobs] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getJobs()
      .then((result) => setJobs(Array.isArray(result) ? result : []))
      .catch((requestError) => setError(requestError.message || 'Could not load jobs.'))
      .finally(() => setLoading(false))
  }, [])

  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase()
    return jobs.filter((job) => {
      const isOpen = (job.status || '').toUpperCase() === 'OPEN'
      const matches = `${job.title || ''} ${job.department || ''} ${job.description || ''}`.toLowerCase().includes(query)
      return isOpen && matches
    })
  }, [jobs, search])

  const workspacePath = role === 'ADMIN'
    ? '/admin/users'
    : role === 'RECRUITER'
      ? '/recruiter/jobs'
      : role === 'JOB_SEEKER' || role === 'CANDIDATE'
        ? '/candidate/jobs'
        : '/login'

  return (
    <div className="home-page">
      <header className="home-header">
        <Link className="home-brand" to="/home" aria-label="TalentSync home">Talent<span>Sync</span></Link>
        <nav className="home-nav">
          {role
            ? <Link className="home-button home-button-primary" to={workspacePath}>Open workspace</Link>
            : <>
                <Link className="home-button home-button-quiet" to="/login">Sign in</Link>
                <Link className="home-button home-button-primary" to="/register">Create account</Link>
              </>}
        </nav>
      </header>

      <main>
        <section className="home-hero">
          <p className="home-eyebrow">TALENTSYNC · HIRING, CONNECTED</p>
          <h1>Find your next opportunity.</h1>
          <p className="home-intro">Explore open roles, apply in a few steps, and follow your progress through the hiring process.</p>
          <div className="home-hero-actions">
            <a className="home-button home-button-primary" href="#open-roles">Browse open roles</a>
            {!role && <Link className="home-button home-button-outline" to="/register">Join as a candidate</Link>}
          </div>
        </section>

        <section className="home-jobs" id="open-roles">
          <div className="home-section-heading">
            <div>
              <p className="home-eyebrow">OPEN POSITIONS</p>
              <h2>Latest opportunities</h2>
            </div>
            <span className="home-count">{loading ? '…' : filteredJobs.length} roles</span>
          </div>

          <label className="home-search-label">
            Search jobs
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Title, department, or keyword" />
          </label>

          {loading && <p className="home-state" role="status">Loading open roles…</p>}
          {error && <p className="home-state home-error" role="alert">{error}</p>}
          {!loading && !error && filteredJobs.length === 0 && <p className="home-state">No open roles match that search yet.</p>}

          {!loading && !error && filteredJobs.length > 0 && (
            <div className="home-job-list">
              {filteredJobs.slice(0, 8).map((job) => (
                <article className="home-job-card" key={job.id}>
                  <div>
                    <p className="home-job-department">{job.department || 'General'}</p>
                    <h3>{job.title || 'Untitled position'}</h3>
                    <p className="home-job-description">{job.description || 'View the role details and application information.'}</p>
                  </div>
                  <Link className="home-job-link" to={role === 'JOB_SEEKER' || role === 'CANDIDATE' ? `/candidate/jobs/${job.id}` : role ? workspacePath : '/login'}>
                    {role === 'JOB_SEEKER' || role === 'CANDIDATE' ? 'View role' : role ? 'Workspace' : 'Sign in to apply'}
                  </Link>
                </article>
              ))}
            </div>
          )}

          {!loading && filteredJobs.length > 8 && (
            <Link className="home-more-link" to={role === 'JOB_SEEKER' || role === 'CANDIDATE' ? '/candidate/jobs' : '/login'}>View all open roles</Link>
          )}
        </section>
      </main>

      <footer className="home-footer">TalentSync · Candidate applications and hiring progress in one place.</footer>
    </div>
  )
}
