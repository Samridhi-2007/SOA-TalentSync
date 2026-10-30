import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { createJob, deleteJob, getCurrentUserRole, getJobs, updateJob } from '../../services/api'

const emptyForm = { title: '', department: '', description: '', status: 'OPEN' }

export default function RecruiterJobs() {
  const role = getCurrentUserRole()
  const [jobs, setJobs] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const loadJobs = () => getJobs()
    .then((response) => setJobs(Array.isArray(response) ? response : []))
    .catch((requestError) => setError(requestError.message || 'Unable to load jobs.'))
    .finally(() => setLoading(false))

  useEffect(() => {
    if (!['RECRUITER', 'ADMIN'].includes(role)) return
    loadJobs()
  }, [role])

  if (!['RECRUITER', 'ADMIN'].includes(role)) {
    return <Navigate to="/candidate/dashboard" replace />
  }

  const updateField = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))

  const beginEdit = (job) => {
    setEditingId(job.id)
    setForm({ title: job.title || '', department: job.department || '', description: job.description || '', status: job.status || 'OPEN' })
    setError('')
    setMessage('')
  }

  const resetForm = () => {
    setEditingId(null)
    setForm(emptyForm)
  }

  const saveJob = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')
    try {
      if (editingId) {
        await updateJob(editingId, form)
        setMessage('Job listing updated.')
      } else {
        await createJob(form)
        setMessage('Job listing created.')
      }
      resetForm()
      await loadJobs()
    } catch (requestError) {
      setError(requestError.message || 'Unable to save this job listing.')
    } finally {
      setSaving(false)
    }
  }

  const toggleStatus = async (job) => {
    const status = (job.status || '').toUpperCase() === 'OPEN' ? 'CLOSED' : 'OPEN'
    setError('')
    setMessage('')
    try {
      const updated = await updateJob(job.id, { status })
      setJobs((current) => current.map((item) => item.id === job.id ? updated : item))
      setMessage(`“${job.title}” is now ${status.toLowerCase()}.`)
    } catch (requestError) {
      setError(requestError.message || 'Unable to update the job status.')
    }
  }

  const removeJob = async (job) => {
    if (!window.confirm(`Delete “${job.title}”? Existing applications will remain in the hiring history.`)) return
    setError('')
    setMessage('')
    try {
      await deleteJob(job.id)
      setJobs((current) => current.filter((item) => item.id !== job.id))
      if (editingId === job.id) resetForm()
      setMessage('Job listing deleted.')
    } catch (requestError) {
      setError(requestError.message || 'Unable to delete this job listing.')
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
            <h1>Job listings</h1>
          </div>
          <span className="pill">{jobs.length} total</span>
        </div>

        {error && <p role="alert" style={{ color: '#a33a32' }}>{error}</p>}
        {message && <p role="status" style={{ color: '#587915' }}>{message}</p>}

        <section style={{ background: '#ffffff', border: '1px solid #dce4d7', borderRadius: '14px', padding: '24px', marginBottom: '28px' }}>
          <h2 style={{ marginTop: 0 }}>{editingId ? 'Edit listing' : 'Create a listing'}</h2>
          <form onSubmit={saveJob} style={{ display: 'grid', gap: '14px' }}>
            <label>
              Job title
              <input name="title" value={form.title} onChange={updateField} required maxLength="160" style={{ display: 'block', width: '100%', marginTop: '6px', padding: '11px', border: '1px solid #cbd8ca', borderRadius: '8px' }} />
            </label>
            <label>
              Department
              <input name="department" value={form.department} onChange={updateField} required maxLength="120" style={{ display: 'block', width: '100%', marginTop: '6px', padding: '11px', border: '1px solid #cbd8ca', borderRadius: '8px' }} />
            </label>
            <label>
              Description
              <textarea name="description" value={form.description} onChange={updateField} required rows="5" style={{ display: 'block', width: '100%', marginTop: '6px', padding: '11px', border: '1px solid #cbd8ca', borderRadius: '8px', resize: 'vertical' }} />
            </label>
            {editingId && (
              <label>
                Listing status
                <select name="status" value={form.status} onChange={updateField} style={{ display: 'block', marginTop: '6px', padding: '11px', border: '1px solid #cbd8ca', borderRadius: '8px', background: '#ffffff' }}>
                  <option value="OPEN">Open</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </label>
            )}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button type="submit" disabled={saving}>{saving ? 'Saving...' : editingId ? 'Save changes' : 'Create job'}</button>
              {editingId && <button type="button" className="outline" onClick={resetForm} disabled={saving}>Cancel</button>}
            </div>
          </form>
        </section>

        <h2>Current listings</h2>
        {loading && <p role="status">Loading job listings...</p>}
        {!loading && jobs.length === 0 && <p>No job listings yet. Create the first one above.</p>}
        {!loading && jobs.length > 0 && (
          <div style={{ display: 'grid', gap: '14px', marginTop: '16px' }}>
            {jobs.map((job) => {
              const isOpen = (job.status || '').toUpperCase() === 'OPEN'
              return (
                <article key={job.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '18px', flexWrap: 'wrap', background: '#ffffff', border: '1px solid #dce4d7', borderRadius: '14px', padding: '20px 22px' }}>
                  <div style={{ flex: '1 1 300px' }}>
                    <h3 style={{ margin: '0 0 5px' }}>{job.title}</h3>
                    <p style={{ color: '#637169', margin: '0 0 7px' }}>{job.department}</p>
                    <small style={{ color: '#8a968d', whiteSpace: 'pre-line' }}>{job.description}</small>
                  </div>
                  <span className="pill" style={{ background: isOpen ? '#e9f3c4' : '#edf0ec', color: isOpen ? '#69880d' : '#637169' }}>{isOpen ? 'OPEN' : 'CLOSED'}</span>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button type="button" className="outline" onClick={() => beginEdit(job)}>Edit</button>
                    <button type="button" className="outline" onClick={() => toggleStatus(job)}>{isOpen ? 'Close listing' : 'Reopen listing'}</button>
                    <button type="button" onClick={() => removeJob(job)} style={{ background: '#8b302b' }}>Delete</button>
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
