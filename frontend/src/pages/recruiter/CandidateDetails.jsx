
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getJobApplications } from '../../services/api'

function CandidateDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [application, setApplication] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadCandidate = async () => {
      try {
        setLoading(true)
        setError('')

        /*
         * The current backend does not have a dedicated
         * GET /api/applications/{id} endpoint.
         *
         * Therefore we load the applications for the job
         * and find the requested application.
         */
        const jobId = sessionStorage.getItem('selectedJobId')

        if (!jobId) {
          setError('Job information not found.')
          setLoading(false)
          return
        }

        const applications = await getJobApplications(jobId)

        const candidateApplication = applications.find(
          (item) => String(item.id) === String(id)
        )

        if (!candidateApplication) {
          setError('Candidate application not found.')
          return
        }

        setApplication(candidateApplication)
      } catch (err) {
        setError(err.message || 'Failed to load candidate details.')
      } finally {
        setLoading(false)
      }
    }

    loadCandidate()
  }, [id])

  if (loading) {
    return (
      <div>
        <h1>Candidate Details</h1>
        <p>Loading candidate details...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <h1>Candidate Details</h1>

        <p style={{ color: 'red' }}>
          {error}
        </p>

        <button onClick={() => navigate(-1)}>
          Go Back
        </button>
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
          <h1>Candidate Details</h1>
          <p>View candidate application information.</p>
        </div>

        <button onClick={() => navigate(-1)}>
          Back
        </button>
      </div>

      <div
        style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '25px',
        }}
      >
        <h2>
          {application.candidate || 'Unknown Candidate'}
        </h2>

        <p>
          <strong>Application ID:</strong>{' '}
          {application.id}
        </p>

        <p>
          <strong>Candidate Email:</strong>{' '}
          {application.candidate || 'Not available'}
        </p>

        <p>
          <strong>Job:</strong>{' '}
          {application.jobTitle || 'Not available'}
        </p>

        <p>
          <strong>Job ID:</strong>{' '}
          {application.jobId}
        </p>

        <p>
          <strong>Application Status:</strong>{' '}
          {application.status || 'APPLIED'}
        </p>

        {application.submittedAt && (
          <p>
            <strong>Applied On:</strong>{' '}
            {new Date(
              application.submittedAt
            ).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  )
}

export default CandidateDetails

