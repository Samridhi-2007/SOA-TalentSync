import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCandidateProfile, updateCandidateProfile, uploadCandidateResume } from '../../services/api'

const emptyForm = { name: '', phone: '', skills: '', location: '' }

export default function Profile() {
  const [profile, setProfile] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [file, setFile] = useState(null)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [fetchError, setFetchError] = useState('')
  const [saveMessage, setSaveMessage] = useState('')
  const [saveError, setSaveError] = useState('')
  const [uploadMessage, setUploadMessage] = useState('')
  const [uploadError, setUploadError] = useState('')

  useEffect(() => {
    const email = localStorage.getItem('userEmail')

    if (!email) {
      setFetchError('We could not find your candidate email. Please sign in again.')
      setLoading(false)
      return
    }

    getCandidateProfile(email)
      .then((response) => {
        if (!response) {
          setFetchError('Your profile could not be found.')
          return
        }

        setProfile(response)
        setForm({
          name: response.name || '',
          phone: response.phone || '',
          skills: response.skills || '',
          location: response.location || '',
        })
      })
      .catch((requestError) => setFetchError(requestError.message || 'Unable to load your profile.'))
      .finally(() => setLoading(false))
  }, [])

  const updateField = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const handleSave = async () => {
    const email = localStorage.getItem('userEmail')
    if (!email) {
      setSaveError('We could not find your candidate email. Please sign in again.')
      return
    }

    setSaving(true)
    setSaveMessage('')
    setSaveError('')

    try {
      const response = await updateCandidateProfile(email, form)
      setProfile(response || { ...profile, ...form })
      setEditing(false)
      setSaveMessage('Profile updated successfully.')
    } catch (requestError) {
      setSaveError(requestError.message || 'Unable to update your profile.')
    } finally {
      setSaving(false)
    }
  }

  const handleUpload = async (event) => {
    event.preventDefault()
    const email = localStorage.getItem('userEmail')

    if (!file) {
      setUploadError('Choose a resume file before uploading.')
      return
    }

    if (!email) {
      setUploadError('We could not find your candidate email. Please sign in again.')
      return
    }

    setUploading(true)
    setUploadMessage('')
    setUploadError('')

    try {
      await uploadCandidateResume(email, file)
      setUploadMessage('Resume uploaded successfully.')
      setFile(null)
      event.target.reset()
    } catch (requestError) {
      setUploadError(requestError.message || 'Unable to upload your resume.')
    } finally {
      setUploading(false)
    }
  }

  const email = profile?.email || localStorage.getItem('userEmail') || ''

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
            <p className="eyebrow">CANDIDATE PORTAL</p>
            <h1>Your Profile</h1>
          </div>
          <Link className="primary" to="/candidate/jobs">Find opportunities</Link>
        </div>

        {loading && <p role="status">Loading your profile...</p>}
        {fetchError && <p role="alert" style={{ color: '#a33a32' }}>{fetchError}</p>}

        {!loading && !fetchError && profile && (
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(260px, 1fr)', gap: '24px' }}>
            <section style={{ background: '#ffffff', border: '1px solid #dce4d7', borderRadius: '14px', padding: '28px' }}>
              <div className="section-heading">
                <div>
                  <p className="eyebrow">PERSONAL DETAILS</p>
                  <h2>Candidate information</h2>
                </div>
                <button type="button" className="outline" onClick={() => setEditing(!editing)} disabled={saving}>
                  {editing ? 'Cancel' : 'Edit'}
                </button>
              </div>

              <div style={{ display: 'grid', gap: '16px' }}>
                <label>
                  Name
                  <input name="name" value={form.name} onChange={updateField} disabled={!editing} style={{ display: 'block', width: '100%', marginTop: '7px', padding: '12px', border: '1px solid #cbd8ca', borderRadius: '8px', background: editing ? '#ffffff' : '#f2f5ed' }} />
                </label>
                <label>
                  Email
                  <input value={email} readOnly style={{ display: 'block', width: '100%', marginTop: '7px', padding: '12px', border: '1px solid #cbd8ca', borderRadius: '8px', background: '#f2f5ed' }} />
                </label>
                <label>
                  Phone
                  <input name="phone" value={form.phone} onChange={updateField} disabled={!editing} style={{ display: 'block', width: '100%', marginTop: '7px', padding: '12px', border: '1px solid #cbd8ca', borderRadius: '8px', background: editing ? '#ffffff' : '#f2f5ed' }} />
                </label>
                <label>
                  Skills
                  <textarea name="skills" value={form.skills} onChange={updateField} disabled={!editing} rows="3" style={{ display: 'block', width: '100%', marginTop: '7px', padding: '12px', border: '1px solid #cbd8ca', borderRadius: '8px', resize: 'vertical', background: editing ? '#ffffff' : '#f2f5ed' }} />
                </label>
                <label>
                  Location
                  <input name="location" value={form.location} onChange={updateField} disabled={!editing} style={{ display: 'block', width: '100%', marginTop: '7px', padding: '12px', border: '1px solid #cbd8ca', borderRadius: '8px', background: editing ? '#ffffff' : '#f2f5ed' }} />
                </label>
              </div>

              {editing && <button type="button" onClick={handleSave} disabled={saving} style={{ marginTop: '22px', opacity: saving ? 0.6 : 1 }}>{saving ? 'Saving...' : 'Save profile'}</button>}
              {saveMessage && <p role="status" style={{ color: '#587915' }}>{saveMessage}</p>}
              {saveError && <p role="alert" style={{ color: '#a33a32' }}>{saveError}</p>}
            </section>

            <section style={{ alignSelf: 'start', background: '#ffffff', border: '1px solid #dce4d7', borderRadius: '14px', padding: '28px' }}>
              <p className="eyebrow">RESUME</p>
              <h2>Upload your resume</h2>
              <p style={{ color: '#637169', lineHeight: 1.6 }}>Keep your application materials ready for recruiters.</p>
              <form onSubmit={handleUpload}>
                <input type="file" onChange={(event) => setFile(event.target.files[0] || null)} disabled={uploading} style={{ maxWidth: '100%' }} />
                {file && <p style={{ color: '#637169' }}>{file.name}</p>}
                <button type="submit" disabled={uploading || !file} style={{ marginTop: '12px', opacity: uploading || !file ? 0.6 : 1 }}>{uploading ? 'Uploading...' : 'Upload resume'}</button>
              </form>
              {uploadMessage && <p role="status" style={{ color: '#587915' }}>{uploadMessage}</p>}
              {uploadError && <p role="alert" style={{ color: '#a33a32' }}>{uploadError}</p>}
            </section>
          </div>
        )}
      </main>
    </div>
  )
}
