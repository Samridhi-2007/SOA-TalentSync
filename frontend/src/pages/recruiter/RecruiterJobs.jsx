import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getRecruiterJobs,
  deleteJob,
  updateJob,
} from '../../services/api'

function RecruiterJobs() {
  const navigate = useNavigate()

  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const loadJobs = async () => {
    const email = localStorage.getItem('userEmail')

    if (!email) {
      setError('Recruiter email not found. Please login again.')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError('')

      const data = await getRecruiterJobs(email)

      setJobs(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || 'Failed to load jobs.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadJobs()
  }, [])

  const handleCloseJob = async (job) => {
    const confirmed = window.confirm(
      `Are you sure you want to close "${job.title}"?`
    )

    if (!confirmed) {
      return
    }

    try {
      setError('')
      setMessage('')

      await updateJob(job.id, {
        title: job.title,
        department: job.department,
        description: job.description,
        location: job.location,
        employmentType: job.employmentType,
        salary: job.salary,
        createdBy: job.createdBy,
        status: 'CLOSED',
      })

      setMessage('Job closed successfully.')
      loadJobs()
    } catch (err) {
      setError(err.message || 'Failed to close job.')
    }
  }

  const handleDeleteJob = async (job) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${job.title}"?`
    )

    if (!confirmed) {
      return
    }

    try {
      setError('')
      setMessage('')

      await deleteJob(job.id)

      setMessage('Job deleted successfully.')
      loadJobs()
    } catch (err) {
      setError(err.message || 'Failed to delete job.')
    }
  }

  if (loading) {
    return (
      <div>
        <h1>My Jobs</h1>
        <p>Loading jobs...</p>
      </div>
    )
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '25px',
        }}
      >
        <div>
          <h1>My Jobs</h1>
          <p>Manage jobs created by you.</p>
        </div>

        <button onClick={() => navigate('/recruiter/jobs/create')}>
          + Create New Job
        </button>
      </div>

      {error && (
        <div
          style={{
            color: 'red',
            marginBottom: '15px',
          }}
        >
          {error}
        </div>
      )}

      {message && (
        <div
          style={{
            color: 'green',
            marginBottom: '15px',
          }}
        >
          {message}
        </div>
      )}

      {jobs.length === 0 ? (
        <div>
          <h3>No jobs found</h3>
          <p>You have not created any jobs yet.</p>

          <button onClick={() => navigate('/recruiter/jobs/create')}>
            Create Your First Job
          </button>
        </div>
      ) : (
        <div>
          {jobs.map((job) => (
            <div
              key={job.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                marginBottom: '20px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <div>
                  <h2>{job.title}</h2>

                  <p>
                    <strong>Department:</strong>{' '}
                    {job.department || 'Not specified'}
                  </p>

                  <p>
                    <strong>Location:</strong>{' '}
                    {job.location || 'Not specified'}
                  </p>

                  <p>
                    <strong>Employment Type:</strong>{' '}
                    {job.employmentType || 'Not specified'}
                  </p>

                  <p>
                    <strong>Salary:</strong>{' '}
                    {job.salary || 'Not specified'}
                  </p>
                </div>

                <strong>
                  {job.status || 'OPEN'}
                </strong>
              </div>

              <p>
                <strong>Description:</strong>
              </p>

              <p>
                {job.description || 'No description provided.'}
              </p>

              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  flexWrap: 'wrap',
                  marginTop: '20px',
                }}
              >
                <button
                  onClick={() =>
                    navigate(`/recruiter/jobs/${job.id}/edit`)
                  }
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    navigate(`/recruiter/jobs/${job.id}/applications`)
                  }
                >
                  Applications
                </button>

                {job.status !== 'CLOSED' && (
                  <button
                    onClick={() => handleCloseJob(job)}
                  >
                    Close Job
                  </button>
                )}

                <button
                  onClick={() => handleDeleteJob(job)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default RecruiterJobs