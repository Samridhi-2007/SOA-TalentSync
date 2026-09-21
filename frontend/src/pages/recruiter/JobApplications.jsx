import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  getJobApplications,
  updateApplicationStatus,
} from '../../services/api'

function JobApplications() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [applications, setApplications] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [updatingId, setUpdatingId] = useState(null)

  const loadApplications = async () => {
    try {
      setLoading(true)
      setError('')

      const data = await getJobApplications(id)

      setApplications(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || 'Failed to load applications.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadApplications()
  }, [id])

  const handleStatusChange = async (applicationId, status) => {
    try {
      setUpdatingId(applicationId)
      setError('')
      setMessage('')

      await updateApplicationStatus(applicationId, status)

      setMessage('Application status updated successfully.')

      await loadApplications()
    } catch (err) {
      setError(err.message || 'Failed to update application status.')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleViewCandidate = (applicationId) => {
    sessionStorage.setItem('selectedJobId', id)

    navigate(`/recruiter/candidates/${applicationId}`)
  }

  const filteredApplications = applications.filter((application) => {
    const search = searchTerm.toLowerCase().trim()

    if (!search) {
      return true
    }

    return (
      (application.candidate || '')
        .toLowerCase()
        .includes(search) ||
      (application.jobTitle || '')
        .toLowerCase()
        .includes(search) ||
      (application.status || '')
        .toLowerCase()
        .includes(search)
    )
  })

  if (loading) {
    return (
      <div>
        <h1>Job Applications</h1>
        <p>Loading applications...</p>
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
          <h1>Job Applications</h1>
          <p>View candidates who applied for this job.</p>
        </div>

        <button onClick={() => navigate('/recruiter/jobs')}>
          Back to Jobs
        </button>
      </div>

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

      {applications.length === 0 ? (
        <div>
          <h3>No applications yet</h3>
          <p>No candidates have applied for this job.</p>
        </div>
      ) : (
        <div>
          {/* Candidate Search */}
          <div style={{ marginBottom: '20px' }}>
            <label>
              <strong>Search Candidates</strong>
            </label>

            <br />

            <input
              type="text"
              placeholder="Search by candidate, job or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                maxWidth: '450px',
                padding: '10px',
                marginTop: '8px',
                border: '1px solid #ccc',
                borderRadius: '5px',
              }}
            />
          </div>

          <p>
            <strong>
              Showing {filteredApplications.length} of{' '}
              {applications.length} applications
            </strong>
          </p>

          {filteredApplications.length === 0 ? (
            <div>
              <h3>No matching candidates</h3>
              <p>
                No applications match your search.
              </p>
            </div>
          ) : (
            filteredApplications.map((application) => (
              <div
                key={application.id}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '20px',
                  marginBottom: '20px',
                }}
              >
                <h2>
                  {application.candidate || 'Unknown Candidate'}
                </h2>

                <p>
                  <strong>Job:</strong>{' '}
                  {application.jobTitle || 'Not available'}
                </p>

                <p>
                  <strong>Application ID:</strong>{' '}
                  {application.id}
                </p>

                <p>
                  <strong>Current Status:</strong>{' '}
                  {application.status || 'APPLIED'}
                </p>

                {application.submittedAt && (
                  <p>
                    <strong>Applied:</strong>{' '}
                    {new Date(
                      application.submittedAt
                    ).toLocaleString()}
                  </p>
                )}

                <div style={{ marginTop: '15px' }}>
                  <label>
                    <strong>Change Status:</strong>
                  </label>

                  <br />

                  <select
                    value={application.status || 'APPLIED'}
                    disabled={
                      updatingId === application.id
                    }
                    onChange={(e) =>
                      handleStatusChange(
                        application.id,
                        e.target.value
                      )
                    }
                  >
                    <option value="APPLIED">
                      Applied
                    </option>

                    <option value="SHORTLISTED">
                      Shortlisted
                    </option>

                    <option value="INTERVIEW">
                      Interview
                    </option>

                    <option value="HIRED">
                      Hired
                    </option>

                    <option value="REJECTED">
                      Rejected
                    </option>
                  </select>

                  {updatingId === application.id && (
                    <span> Updating...</span>
                  )}
                </div>

                <div style={{ marginTop: '15px' }}>
                  <button
                    onClick={() =>
                      handleViewCandidate(
                        application.id
                      )
                    }
                  >
                    View Candidate
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default JobApplications