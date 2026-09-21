import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { candidateLogin } from '../services/api'
import '../../src/App.css'

function storeUser(response, email) {
  if (response?.token) {
    localStorage.setItem('token', response.token)
  }

  localStorage.setItem('userEmail', response?.email || email)

  if (response?.name) {
    localStorage.setItem('userName', response.name)
  }
}

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const updateField = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await candidateLogin(form)
      storeUser(response, form.email)
      navigate('/candidate/dashboard')
    } catch (requestError) {
      setError(requestError.message || 'Unable to log in. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth" style={{ minHeight: 'calc(100vh - 76px)', display: 'grid', placeItems: 'center', padding: '60px 9%' }}>
      <section style={{ width: '100%', maxWidth: '460px', background: '#ffffff', border: '1px solid #dce4d7', borderRadius: '18px', padding: '36px', boxShadow: '0 16px 45px #bac8b544' }}>
        <p className="eyebrow">CANDIDATE PORTAL</p>
        <h1 style={{ marginTop: 0 }}>Welcome back</h1>
        <p style={{ color: '#637169', lineHeight: 1.6 }}>Sign in to view your applications and discover your next opportunity.</p>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px', marginTop: '28px' }}>
          <label>
            Email
            <input name="email" type="email" value={form.email} onChange={updateField} required autoComplete="email" style={{ display: 'block', width: '100%', marginTop: '7px', padding: '12px', border: '1px solid #cbd8ca', borderRadius: '8px' }} />
          </label>
          <label>
            Password
            <input name="password" type="password" value={form.password} onChange={updateField} required autoComplete="current-password" style={{ display: 'block', width: '100%', marginTop: '7px', padding: '12px', border: '1px solid #cbd8ca', borderRadius: '8px' }} />
          </label>

          {error && <p role="alert" style={{ color: '#a33a32', margin: 0 }}>{error}</p>}

          <button type="submit" disabled={loading} style={{ marginTop: '8px', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p style={{ color: '#637169', marginBottom: 0, marginTop: '24px' }}>
          New to TalentSync? <Link to="/register" style={{ color: '#6d8e16', fontWeight: 700 }}>Create an account</Link>
        </p>
      </section>
    </main>
  )
}
