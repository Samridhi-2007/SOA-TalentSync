import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createJob } from '../../services/api'

function CreateJob() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    title: '',
    department: '',
    description: '',
    location: '',
    employmentType: 'FULL_TIME',
    salary: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

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
      setLoading(true)
      setError('')
      setMessage('')

      await createJob({
        title: form.title,
        department: form.department,
        description: form.description,
        location: form.location,
        employmentType: form.employmentType,
        salary: form.salary,
        createdBy: email,
      })

      setMessage('Job created successfully.')

      setTimeout(() => {
        navigate('/recruiter/jobs')
      }, 800)
    } catch (err) {
      setError(err.message || 'Failed to create job.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1>Create Job</h1>
      <p>Create a new job posting.</p>

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
            placeholder="Software Engineer"
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
            placeholder="Engineering"
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
            placeholder="Describe the job responsibilities..."
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
            placeholder="Bangalore"
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
            placeholder="8-12 LPA"
          />
        </div>

        <br />

        <button
          type="submit"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Job'}
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

export default CreateJob