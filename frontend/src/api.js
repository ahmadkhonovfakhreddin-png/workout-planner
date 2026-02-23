const API_BASE = '/api'

function getCsrfToken() {
  const name = 'csrftoken'
  const cookies = document.cookie.split(';')
  for (let i = 0; i < cookies.length; i++) {
    const c = cookies[i].trim()
    if (c.startsWith(name + '=')) return c.substring(name.length + 1)
  }
  return null
}

export async function apiGet(path) {
  const res = await fetch(API_BASE + path, { credentials: 'include' })
  return res
}

export async function apiPost(path, body) {
  const csrf = getCsrfToken()
  const headers = { 'Content-Type': 'application/json' }
  if (csrf) headers['X-CSRFToken'] = csrf
  const res = await fetch(API_BASE + path, {
    method: 'POST',
    credentials: 'include',
    headers,
    body: JSON.stringify(body),
  })
  return res
}

export async function ensureCsrf() {
  await fetch(API_BASE + '/csrf/', { credentials: 'include' })
}

export async function getMe() {
  const res = await apiGet('/auth/me/')
  if (!res.ok) return null
  return res.json()
}

export async function login(email, password) {
  const res = await apiPost('/auth/login/', { email, password })
  const data = await res.json().catch(() => ({}))
  return { ok: res.ok, data }
}

export async function signup(email, password) {
  const res = await apiPost('/auth/signup/', { email, password })
  const data = await res.json().catch(() => ({}))
  return { ok: res.ok, data }
}

export async function passwordReset(email) {
  const res = await apiPost('/auth/password-reset/', { email })
  const data = await res.json().catch(() => ({}))
  return { ok: res.ok, data }
}

export async function createSubscription(plan, cardNumber, expiry, cvv, phone) {
  const res = await apiPost('/subscriptions/', {
    plan: plan.toLowerCase(),
    card_number: cardNumber,
    expiry,
    cvv,
    phone,
  })
  const data = await res.json().catch(() => ({}))
  return { ok: res.ok, data }
}

/** Direct checkout: no login. Email + plan + card. Creates/finds user, subscription, logs in. */
export async function checkout(email, plan, cardNumber, expiry, cvv, phone) {
  const res = await apiPost('/checkout/', {
    email: email.trim().toLowerCase(),
    plan: plan.toLowerCase(),
    card_number: cardNumber,
    expiry,
    cvv,
    phone: phone.trim(),
  })
  const data = await res.json().catch(() => ({}))
  return { ok: res.ok, data }
}

export async function logout() {
  await apiPost('/auth/logout/', {})
}
