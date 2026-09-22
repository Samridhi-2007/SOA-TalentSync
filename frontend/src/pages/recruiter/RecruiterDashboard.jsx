import { useEffect, useState } from 'react'
import { getRecruiterStatistics, getRecruitmentPipeline } from '../../services/api'

function RecruiterDashboard() {
  const [statistics, setStatistics] = useState({
    totalJobs: 0,
    openJobs: 0,
    totalApplications: 0,
    shortlistedCandidates: 0,
    interviews: 0,
    hiredCandidates: 0,
  })

  const [pipeline, setPipeline] = useState({
    applied: 0,
    shortlisted: 0,
    interview: 0,
    hired: 0,
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const email = localStorage.getItem('userEmail')

    if (!email) {
      setError('Recruiter email not found. Please login again.')
      setLoading(false)
      return
    }

    const loadDashboard = async () => {
      try {
        setLoading(true)
        setError('')

        const [statisticsData, pipelineData] = await Promise.all([
          getRecruiterStatistics(email),
          getRecruitmentPipeline(),
        ])

        setStatistics({
          totalJobs: statisticsData.totalJobs ?? 0,
          openJobs: statisticsData.openJobs ?? 0,
          totalApplications: statisticsData.totalApplications ?? 0,
          shortlistedCandidates:
            statisticsData.shortlistedCandidates ?? 0,
          interviews: statisticsData.interviews ?? 0,
          hiredCandidates:
            statisticsData.hiredCandidates ?? 0,
        })

        setPipeline({
          applied: pipelineData.applied ?? 0,
          shortlisted: pipelineData.shortlisted ?? 0,
          interview: pipelineData.interview ?? 0,
          hired: pipelineData.hired ?? 0,
        })
      } catch (err) {
        setError(
          err.message || 'Failed to load dashboard information.'
        )
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  if (loading) {
    return (
      <div>
        <h1>Recruiter Dashboard</h1>
        <p>Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div>
      <h1>Recruiter Dashboard</h1>

      <p>
        Welcome,{' '}
        {localStorage.getItem('userName') || 'Recruiter'}!
      </p>

      {error && (
        <p style={{ color: 'red' }}>
          {error}
        </p>
      )}

      {/* Statistics */}
      <h2 style={{ marginTop: '30px' }}>
        Hiring Statistics
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px',
          marginTop: '20px',
        }}
      >
        <div
          style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '20px',
          }}
        >
          <h3>Total Jobs</h3>
          <p>{statistics.totalJobs}</p>
        </div>

        <div
          style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '20px',
          }}
        >
          <h3>Open Jobs</h3>
          <p>{statistics.openJobs}</p>
        </div>

        <div
          style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '20px',
          }}
        >
          <h3>Total Applications</h3>
          <p>{statistics.totalApplications}</p>
        </div>

        <div
          style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '20px',
          }}
        >
          <h3>Shortlisted Candidates</h3>
          <p>{statistics.shortlistedCandidates}</p>
        </div>

        <div
          style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '20px',
          }}
        >
          <h3>Interviews</h3>
          <p>{statistics.interviews}</p>
        </div>

        <div
          style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '20px',
          }}
        >
          <h3>Hired Candidates</h3>
          <p>{statistics.hiredCandidates}</p>
        </div>
      </div>

      {/* Recruitment Pipeline */}
      <h2 style={{ marginTop: '40px' }}>
        Recruitment Pipeline
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px',
          marginTop: '20px',
        }}
      >
        <div
          style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '20px',
          }}
        >
          <h3>Applied</h3>
          <p>{pipeline.applied}</p>
        </div>

        <div
          style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '20px',
          }}
        >
          <h3>Shortlisted</h3>
          <p>{pipeline.shortlisted}</p>
        </div>

        <div
          style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '20px',
          }}
        >
          <h3>Interview</h3>
          <p>{pipeline.interview}</p>
        </div>

        <div
          style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '20px',
          }}
        >
          <h3>Hired</h3>
          <p>{pipeline.hired}</p>
        </div>
      </div>
    </div>
  )
}

export default RecruiterDashboard