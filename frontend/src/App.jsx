import { useEffect, useState } from 'react'
import './App.css'

const API = 'http://localhost:8085'
const demoJobs = [{ id: 1, title: 'Java Backend Developer', department: 'Engineering', description: 'Build simple Spring Boot APIs' }, { id: 2, title: 'Frontend Developer', department: 'Product', description: 'Create clean React screens' }]

function App() {
  const [jobs, setJobs] = useState(demoJobs)
  const [user, setUser] = useState(null)
  const [login, setLogin] = useState(false)
  const [message, setMessage] = useState('')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [applications, setApplications] = useState([])

  useEffect(() => { fetch(`${API}/api/jobs`).then(r => r.ok ? r.json() : []).then(data => data.length && setJobs(data)).catch(() => {}) }, [])
  const change = e => setForm({ ...form, [e.target.name]: e.target.value })
  const auth = async e => {
    e.preventDefault()
    const path = login ? '/api/auth/login' : '/api/auth/register'
    const body = login ? { email: form.email, password: form.password } : form
    try {
      const r = await fetch(API + path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const data = await r.json()
      if (!r.ok) throw new Error(data)
      setUser(data); localStorage.setItem('token', data.token); localStorage.setItem('role', data.role)
      setMessage(`Logged in as ${data.role}`)
    } catch (error) { setMessage(error.message || 'Request failed') }
  }
  const requestRecruiter = async () => {
    try { const r = await fetch(`${API}/api/auth/recruiter-request`, { method: 'PUT', headers: { Authorization: `Bearer ${user.token}` } }); const data = await r.json(); if (!r.ok) throw new Error(data); setMessage(data.message) } catch (error) { setMessage(error.message) }
  }
  const apply = async job => {
    try { const r = await fetch(`${API}/api/applications`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token || ''}` }, body: JSON.stringify({ jobId: job.id, jobTitle: job.title, candidate: user?.email || 'guest@example.com' }) }); if (!r.ok) throw new Error('Please login as an approved job seeker'); setApplications([...applications, job]); setMessage('Application submitted') } catch (error) { setMessage(error.message) }
  }
  const logout = () => { setUser(null); localStorage.clear() }
  return <div className="app"><header><div><span className="logo">TS</span><span className="brand">Talent<span>Sync</span></span></div><nav><a href="#jobs">Jobs</a>{user ? <><span className="role">{user.role}</span>{user.role === 'JOB_SEEKER' && <button className="outline" onClick={requestRecruiter}>Settings: Request Recruiter Access</button>}<button className="outline" onClick={logout}>Logout</button></> : <button onClick={() => document.getElementById('auth').scrollIntoView()}>Sign in</button>}</nav></header><main><section className="hero"><div><p className="eyebrow">SMART HIRING, MADE SIMPLE</p><h1>Find the right talent.<br /><span>Build the right team.</span></h1><p className="sub">TalentSync brings job posting, applications and recruitment tracking together in one clear workspace.</p><a className="primary" href="#jobs">Explore open roles ↓</a></div><div className="hero-card"><h3>TalentSync access</h3><p>New accounts start as Job Seekers. Recruiter access is available from Settings after admin approval.</p></div></section><section id="jobs" className="section"><p className="eyebrow">OPPORTUNITIES</p><h2>Open positions</h2><div className="jobs">{jobs.map(job => <article className="job" key={job.id}><div className="job-icon">{job.title[0]}</div><div className="job-info"><h3>{job.title}</h3><p>{job.department}</p><small>{job.description}</small></div><button onClick={() => apply(job)}>Apply now →</button></article>)}</div></section>{!user && <section id="auth" className="auth"><div><p className="eyebrow">GET STARTED</p><h2>{login ? 'Welcome back' : 'Create your account'}</h2><p>{login ? 'Sign in to continue.' : 'Every new account starts as a Job Seeker.'}</p></div><form onSubmit={auth}>{!login && <input name="name" placeholder="Full name" value={form.name} onChange={change} required />}<input name="email" type="email" placeholder="Email address" value={form.email} onChange={change} required /><input name="password" type="password" placeholder="Password" value={form.password} onChange={change} required /><button className="primary" type="submit">{login ? 'Sign in' : 'Create account'}</button><button type="button" className="link" onClick={() => setLogin(!login)}>{login ? 'Create a new account' : 'Already have an account? Sign in'}</button></form></section>}</main><footer><span className="logo">TS</span> TalentSync</footer>{message && <div className="toast" onClick={() => setMessage('')}>{message} ×</div>}</div>
}
export default App
