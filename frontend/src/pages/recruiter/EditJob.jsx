import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getRecruiterJobById, updateJob } from '../../services/api'

function EditJob() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    title: '',
    department: '',
    description: '',
    location: '',
    employmentType: 'FULL_TIME',
    salary: '',
    status: 'OPEN',
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const loadJob = async () => {
      try {
        setLoading(true)
        setError('')

        const job = await getRecruiterJobById(id)

        setForm({
          title: job.title || '',
          department: job.department || '',
          description: job.description || '',
          location: job.location || '',
          employmentType: job.employmentType || 'FULL_TIME',
          salary: job.salary || '',
          status: job.status || 'OPEN',
        })
      } catch (err) {
        setError(err.message || 'Failed to load job.')
      } finally {
        setLoading(false)
      }
    }

    loadJob()
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const email = localStorage.getItem('userEmail')

    if (!email) {
      setError('Recruiter email not found. Please login again.')
      return
    }

    if (!form.title.trim()) {
      setError('Job title is required.')
      return
    }

    if (!form.department.trim()) {
      setError('Department is required.')
      return
    }

    if (!form.description.trim()) {
      setError('Description is required.')
      return
    }

    try {
      setSaving(true)
      setError('')
      setMessage('')

      await updateJob(id, {
        title: form.title,
        department: form.department,
        description: form.description,
        location: form.location,
        employmentType: form.employmentType,
        salary: form.salary,
        createdBy: email,
        status: form.status,
      })

      setMessage('Job updated successfully.')

      setTimeout(() => {
        navigate('/recruiter/jobs')
      }, 800)
    } catch (err) {
      setError(err.message || 'Failed to update job.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div>
        <h1>Edit Job</h1>
        <p>Loading job...</p>
      </div>
    )
  }

  return (
    <div>
      <h1>Edit Job</h1>
      <p>Update the job posting details.</p>

      {error && (
        <p style={{ color: 'red' }}>
          {error}
        </p>
      )}

      {message && (
        <p style={{ color: 'green' }}>
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Job Title</label>
          <br />
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
          />
        </div>

        <br />

        <div>
          <label>Department</label>
          <br />
          <input
            type="text"
            name="department"
            value={form.department}
            onChange={handleChange}
          />
        </div>

        <br />

        <div>
          <label>Description</label>
          <br />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="5"
          />
        </div>

        <br />

        <div>
          <label>Location</label>
          <br />
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
          />
        </div>

        <br />

        <div>
          <label>Employment Type</label>
          <br />

          <select
            name="employmentType"
            value={form.employmentType}
            onChange={handleChange}
          >
            <option value="FULL_TIME">Full Time</option>
            <option value="PART_TIME">Part Time</option>
            <option value="CONTRACT">Contract</option>
            <option value="INTERNSHIP">Internship</option>
          </select>
        </div>

        <br />

        <div>
          <label>Salary</label>
          <br />
          <input
            type="text"
            name="salary"
            value={form.salary}
            onChange={handleChange}
          />
        </div>

        <br />

        <div>
          <label>Status</label>
          <br />

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="OPEN">OPEN</option>
            <option value="CLOSED">CLOSED</option>
          </select>
        </div>

        <br />

        <button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>

        {' '}

        <button
          type="button"
          onClick={() => navigate('/recruiter/jobs')}
        >
          Cancel
        </button>
      </form>
    </div>
  )
}

export default EditJob