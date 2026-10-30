export const API_BASE_URL = 'http://localhost:8085'

export function getCurrentUserRole() {
  const storedRole = localStorage.getItem('userRole')
  if (storedRole) return storedRole.toUpperCase()

  const token = localStorage.getItem('token')
  try {
    const payload = token?.split('.')[1]?.replace(/-/g, '+').replace(/_/g, '/')
    const role = payload ? JSON.parse(atob(payload)).role : null
    if (role) {
      localStorage.setItem('userRole', role)
      return role.toUpperCase()
    }
  } catch {
    return ''
  }
  return ''
}

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

export function createJob(data) {
  return jsonRequest('/api/jobs', 'POST', data, true)
}

export function updateJob(id, data) {
  return jsonRequest(`/api/jobs/${encodeURIComponent(id)}`, 'PUT', data, true)
}

export function deleteJob(id) {
  return request(`/api/jobs/${encodeURIComponent(id)}`, { method: 'DELETE' }, true)
}

export function requestRecruiterAccess() {
  return request('/api/auth/recruiter-request', { method: 'PUT' }, true)
}

export function getAdminUsers() {
  return request('/api/admin/users', {}, true)
}

export function approveUserRole(email, role) {
  return request(`/api/admin/users/${encodeURIComponent(email)}/approve?role=${encodeURIComponent(role)}`, { method: 'PUT' }, true)
}

export function applyForJob(data) {
  return jsonRequest('/api/applications', 'POST', data, true)
}

export function getCandidateApplications(email) {
  return request(`/api/applications/candidate/${encodeURIComponent(email)}`, {}, true)
}

export function getAllApplications() {
  return request('/api/applications', {}, true)
}

export function updateApplicationStatus(id, status) {
  return request(`/api/applications/${encodeURIComponent(id)}/status?value=${encodeURIComponent(status)}`, {
    method: 'PUT',
  }, true)
}

export function updateInterviewTime(id, value) {
  return request(`/api/applications/${encodeURIComponent(id)}/interview?value=${encodeURIComponent(value)}`, {
    method: 'PUT',
  }, true)
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

export async function downloadCandidateResume(email) {
  const token = localStorage.getItem('token')
  const response = await fetch(`${API_BASE_URL}/api/candidates/${encodeURIComponent(email)}/resume`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })

  if (!response.ok) {
    const contentType = response.headers.get('content-type') || ''
    const errorBody = contentType.includes('application/json') ? await response.json() : await response.text()
    throw new Error(typeof errorBody === 'string' ? errorBody : errorBody?.message || 'Unable to download the resume.')
  }

  const disposition = response.headers.get('content-disposition') || ''
  const fileName = disposition.match(/filename="?([^";]+)"?/i)?.[1] || 'resume'
  return { blob: await response.blob(), fileName }
}
