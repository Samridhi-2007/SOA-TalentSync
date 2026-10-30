import { Link, Navigate, useNavigate } from 'react-router-dom'
import { getCurrentUserRole } from '../../services/api'

export default function RecruiterProfile() {
  const role = getCurrentUserRole()
  const navigate = useNavigate()

  if (!['RECRUITER', 'ADMIN'].includes(role)) {
    return <Navigate to="/candidate/dashboard" replace />
  }

  const name = localStorage.getItem('userName') || 'Recruiter'
  const email = localStorage.getItem('userEmail') || 'Email unavailable'

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userName')
    localStorage.removeItem('userRole')
    navigate('/home', { replace: true })
  }

  return (
    <div className="app">
      <header>
        <div><span className="logo">TS</span><span className="brand">Talent<span>Sync</span></span></div>
        <nav>
          <Link to="/recruiter/jobs">Job listings</Link>
          <Link to="/recruiter/applications">Applications</Link>
          <Link to="/recruiter/profile">Profile</Link>
          <button type="button" className="outline" onClick={handleLogout} style={{ padding: '8px 14px' }}>Log out</button>
        </nav>
      </header>

      <main className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">RECRUITER WORKSPACE</p>
            <h1>Profile</h1>
          </div>
        </div>

        <section style={{ maxWidth: '620px', background: '#ffffff', border: '1px solid #dce4d7', borderRadius: '14px', padding: '28px' }}>
          <p className="eyebrow">ACCOUNT DETAILS</p>
          <h2 style={{ margin: '0 0 20px' }}>{name}</h2>
          <dl style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '12px 18px', margin: 0 }}>
            <dt style={{ color: '#637169' }}>Email</dt>
            <dd style={{ margin: 0 }}>{email}</dd>
            <dt style={{ color: '#637169' }}>Role</dt>
            <dd style={{ margin: 0 }}>{role}</dd>
          </dl>
          <p style={{ color: '#637169', lineHeight: 1.6, marginTop: '24px' }}>
            Manage your job listings and candidate applications from the recruiter workspace.
          </p>
        </section>
      </main>
    </div>
  )
}
