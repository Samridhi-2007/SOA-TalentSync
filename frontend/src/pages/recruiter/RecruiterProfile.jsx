import { useNavigate } from 'react-router-dom'

function RecruiterProfile() {
  const navigate = useNavigate()

  const name = localStorage.getItem('userName') || 'Not available'
  const email = localStorage.getItem('userEmail') || 'Not available'
  const role = localStorage.getItem('userRole') || 'RECRUITER'

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userName')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userRole')

    sessionStorage.removeItem('selectedJobId')

    navigate('/login')
  }

  return (
    <div>
      <h1>Recruiter Profile</h1>

      <p>
        View your recruiter account information.
      </p>

      <div
        style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '25px',
          maxWidth: '600px',
          marginTop: '25px',
        }}
      >
        <h2>Profile Information</h2>

        <div style={{ marginTop: '20px' }}>
          <p>
            <strong>Name:</strong>{' '}
            {name}
          </p>

          <p>
            <strong>Email:</strong>{' '}
            {email}
          </p>

          <p>
            <strong>Role:</strong>{' '}
            {role}
          </p>

          <p>
            <strong>Account Type:</strong>{' '}
            Recruiter
          </p>
        </div>
      </div>

      <div style={{ marginTop: '25px' }}>
        <button
          onClick={() => navigate('/recruiter/dashboard')}
        >
          Back to Dashboard
        </button>

        {' '}

        <button onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  )
}

export default RecruiterProfile