const ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'

function decodeJwtPayload(token) {
  try {
    const payload = token.split('.')[1]
    if (!payload) return {}
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(decodeURIComponent(
      atob(base64)
        .split('')
        .map((character) => `%${character.charCodeAt(0).toString(16).padStart(2, '0')}`)
        .join('')
    ))
  } catch {
    return {}
  }
}

function readRole(source) {
  if (!source || typeof source !== 'object') return ''
  const roleKey = Object.keys(source).find((key) => {
    const normalized = key.toLowerCase()
    return normalized === 'role' || normalized === 'roles' || normalized === ROLE_CLAIM
  })
  const value = roleKey ? source[roleKey] : ''
  return Array.isArray(value) ? value[0] ?? '' : value ?? ''
}

export function getRoleFromAuthResponse(data, token) {
  const tokenClaims = decodeJwtPayload(token)
  return String(
    readRole(data) ||
    readRole(data?.user) ||
    readRole(data?.userInfo) ||
    readRole(tokenClaims) ||
    ''
  ).toLowerCase()
}

export function getUserNameFromAuthResponse(data, token, fallback = '') {
  const claims = decodeJwtPayload(token)
  const user = data?.user ?? data?.userInfo ?? {}
  const claimName = Object.entries(claims).find(([key]) => {
    const normalized = key.toLowerCase()
    return ['preferred_username', 'unique_name', 'name', 'given_name', 'email'].includes(normalized) ||
      normalized === 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'
  })?.[1]
  const candidate = data?.userName ?? data?.username ?? data?.name ??
    user.userName ?? user.username ?? user.name ?? user.email ?? claimName ?? fallback
  return String(candidate ?? '').trim()
}

export function getCurrentRole() {
  const role = localStorage.getItem('role') || getRoleFromAuthResponse({}, localStorage.getItem('token') || '')
  return ['admin', 'manager', 'viewer'].includes(role) ? role : ''
}

export function getCurrentUserName() {
  return localStorage.getItem('userName') || ''
}
