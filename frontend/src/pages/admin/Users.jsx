import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { approveUserRole, getAdminUsers, getCurrentUserRole } from '../../services/api'

export default function AdminUsers() {
  const role = getCurrentUserRole()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [approvingEmail, setApprovingEmail] = useState(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (role !== 'ADMIN') return
    getAdminUsers()
      .then((response) => setUsers(Array.isArray(response) ? response : []))
      .catch((requestError) => setError(requestError.message || 'Unable to load user accounts.'))
      .finally(() => setLoading(false))
  }, [role])

  if (role !== 'ADMIN') return <Navigate to="/candidate/dashboard" replace />

  const resolveRequest = async (user, nextRole) => {
    setApprovingEmail(user.email)
    setError('')
    setMessage('')
    try {
      await approveUserRole(user.email, nextRole)
      setUsers((current) => current.map((item) => item.email === user.email
        ? { ...item, role: nextRole, recruiterRequested: false, approved: true }
        : item))
      setMessage(nextRole === 'RECRUITER'
        ? `${user.name || user.email} is now an approved recruiter.`
        : `Recruiter request from ${user.name || user.email} was declined.`)
    } catch (requestError) {
      setError(requestError.message || 'Unable to approve this recruiter request.')
    } finally {
      setApprovingEmail(null)
    }
  }

  const requests = users.filter((user) => user.recruiterRequested)

  return (
    <div className="app">
      <header>
        <div><span className="logo">TS</span><span className="brand">Talent<span>Sync</span></span></div>
        <nav>
          <Link to="/admin/users">User approvals</Link>
          <Link to="/recruiter/jobs">Job listings</Link>
          <Link to="/recruiter/applications">Applications</Link>
        </nav>
      </header>

      <main className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">ADMIN WORKSPACE</p>
            <h1>Recruiter access requests</h1>
          </div>
          <span className="pill">{requests.length} pending</span>
        </div>

        {loading && <p role="status">Loading user accounts...</p>}
        {error && <p role="alert" style={{ color: '#a33a32' }}>{error}</p>}
        {message && <p role="status" style={{ color: '#587915' }}>{message}</p>}
        {!loading && !error && requests.length === 0 && <p>No recruiter access requests are waiting for review.</p>}

        {!loading && requests.length > 0 && (
          <div style={{ display: 'grid', gap: '14px' }}>
            {requests.map((user) => (
              <article key={user.email} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '18px', flexWrap: 'wrap', background: '#ffffff', border: '1px solid #dce4d7', borderRadius: '14px', padding: '20px 22px' }}>
                <div>
                  <h2 style={{ margin: '0 0 4px' }}>{user.name || 'Unnamed user'}</h2>
                  <p style={{ color: '#637169', margin: '0 0 4px' }}>{user.email}</p>
                  <small style={{ color: '#8a968d' }}>Current role: {user.role} · Account {user.approved ? 'approved' : 'pending'}</small>
                </div>
                <div style={{ display: 'flex', gap: '9px', flexWrap: 'wrap' }}>
                  <button type="button" onClick={() => resolveRequest(user, 'RECRUITER')} disabled={approvingEmail === user.email}>
                    {approvingEmail === user.email ? 'Saving...' : 'Approve as recruiter'}
                  </button>
                  <button type="button" className="outline" onClick={() => resolveRequest(user, 'JOB_SEEKER')} disabled={approvingEmail === user.email}>Decline</button>
                </div>
              </article>
            ))}
          </div>
        )}

        {!loading && users.length > 0 && (
          <section style={{ marginTop: '44px' }}>
            <h2>All accounts</h2>
            <div style={{ display: 'grid', gap: '10px', marginTop: '14px' }}>
              {users.map((user) => (
                <div key={user.email} style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', background: '#ffffff', border: '1px solid #e1e8df', borderRadius: '10px', padding: '14px 18px' }}>
                  <span>{user.name} · {user.email}</span>
                  <span className="pill">{user.role}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
