export const API_BASE_URL = 'http://localhost:8085'

async function request(path, options = {}, requiresAuth = false) {
  const headers = new Headers(options.headers)
  const token = localStorage.getItem('token')

  if (requiresAuth && token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  const contentType = response.headers.get('content-type') || ''
  const result = contentType.includes('application/json')
    ? await response.json()
    : await response.text()

  if (!response.ok) {
    const message = typeof result === 'string'
      ? result
      : result?.message || result?.error || 'Request failed'
    throw new Error(message)
  }

  return result
}

function jsonRequest(path, method, data, requiresAuth = false) {
  return request(path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }, requiresAuth)
}

export function candidateRegister(data) {
  return jsonRequest('/api/auth/register', 'POST', data)
}

export function candidateLogin(data) {
  return jsonRequest('/api/auth/login', 'POST', data)
}

export function getJobs() {
  return request('/api/jobs')
}

export function getJobById(id) {
  return request(`/api/jobs/${encodeURIComponent(id)}`)
}

export function applyForJob(data) {
  return jsonRequest('/api/applications', 'POST', data, true)
}

export function getCandidateApplications(email) {
  return request(`/api/applications/candidate/${encodeURIComponent(email)}`, {}, true)
}

export function getCandidateProfile(email) {
  return request(`/api/candidates/${encodeURIComponent(email)}`, {}, true)
}

export function updateCandidateProfile(email, data) {
  return jsonRequest(`/api/candidates/${encodeURIComponent(email)}`, 'PUT', data, true)
}

export function uploadCandidateResume(email, file) {
  const formData = new FormData()
  formData.append('file', file)

  return request(`/api/candidates/${encodeURIComponent(email)}/resume`, {
    method: 'POST',
    body: formData,
  }, true)
}
