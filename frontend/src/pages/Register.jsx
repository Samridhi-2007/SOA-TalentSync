import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { candidateRegister } from '../services/api'
import '../../src/App.css'

function storeUser(response, form) {
  if (response?.token) {
    localStorage.setItem('token', response.token)
  }

  localStorage.setItem('userEmail', response?.email || form.email)

  if (response?.name || form.name) {
    localStorage.setItem('userName', response?.name || form.name)
  }

  if (response?.role) {
    localStorage.setItem('userRole', response.role)
  }

  localStorage.setItem(
    'approved',
    String(response?.approved ?? false)
  )
}

export default function Register() {
  const navigate = useNavigate()
 const [form, setForm] = useState({
  name: '',
  email: '',
  password: ''
})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const updateField = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await candidateRegister(form)
      storeUser(response, form)
      setSuccess('Account created successfully. Redirecting...')
      navigate('/candidate/dashboard')
    } catch (requestError) {
      setError(requestError.message || 'Unable to create your account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth" style={{ minHeight: 'calc(100vh - 76px)', display: 'grid', placeItems: 'center', padding: '60px 9%' }}>
      <section style={{ width: '100%', maxWidth: '460px', background: '#ffffff', border: '1px solid #dce4d7', borderRadius: '18px', padding: '36px', boxShadow: '0 16px 45px #bac8b544' }}>
        <p className="eyebrow">JOIN TALENTSYNC</p>
        <h1 style={{ marginTop: 0 }}>Create your account</h1>
        <p style={{ color: '#637169', lineHeight: 1.6 }}>Build your candidate profile and find opportunities that fit your goals.</p>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px', marginTop: '28px' }}>
          <label>
            Name
            <input name="name" type="text" value={form.name} onChange={updateField} required autoComplete="name" style={{ display: 'block', width: '100%', marginTop: '7px', padding: '12px', border: '1px solid #cbd8ca', borderRadius: '8px' }} />
          </label>
          <label>
            Email
            <input name="email" type="email" value={form.email} onChange={updateField} required autoComplete="email" style={{ display: 'block', width: '100%', marginTop: '7px', padding: '12px', border: '1px solid #cbd8ca', borderRadius: '8px' }} />
          </label>
          <label>
            Password
            <input name="password" type="password" value={form.password} onChange={updateField} required autoComplete="new-password" style={{ display: 'block', width: '100%', marginTop: '7px', padding: '12px', border: '1px solid #cbd8ca', borderRadius: '8px' }} />
          </label>

          {error && <p role="alert" style={{ color: '#a33a32', margin: 0 }}>{error}</p>}
          {success && <p role="status" style={{ color: '#587915', margin: 0 }}>{success}</p>}

          <button type="submit" disabled={loading} style={{ marginTop: '8px', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p style={{ color: '#637169', marginBottom: 0, marginTop: '24px' }}>
          Already have an account? <Link to="/login" style={{ color: '#6d8e16', fontWeight: 700 }}>Sign in</Link>
        </p>
      </section>
    </main>
  )
}
