import { useState, useEffect } from 'react'
import { ensureCsrf, login as apiLogin, signup as apiSignup, passwordReset as apiPasswordReset } from '../api'

export default function AuthModal({ open, onClose, onSuccess, initialPlan }) {
  const [mode, setMode] = useState('login') // 'login' | 'signup' | 'forgot'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (open) ensureCsrf()
  }, [open])

  if (!open) return null

  const resetState = () => {
    setMessage('')
    setPassword('')
    setConfirmPassword('')
  }

  const handleClose = () => {
    resetState()
    if (onClose) onClose()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')

    try {
      setLoading(true)
      let result

      if (mode === 'signup') {
        if (password !== confirmPassword) {
          setMessage('Passwords do not match.')
          setLoading(false)
          return
        }
        result = await apiSignup(email, password)
      } else if (mode === 'login') {
        result = await apiLogin(email, password)
      } else {
        result = await apiPasswordReset(email)
      }

      if (!result.ok) {
        setMessage(result.data.detail || 'Something went wrong. Please try again.')
        return
      }

      if (mode === 'forgot') {
        setMessage('If this email exists, a reset link has been sent.')
        return
      }

      setMessage(mode === 'login' ? 'Welcome back!' : 'Account created!')
      setTimeout(() => {
        if (onSuccess) onSuccess()
        handleClose()
      }, 400)
    } catch (err) {
      setMessage('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const title =
    mode === 'login'
      ? 'Log in'
      : mode === 'signup'
      ? 'Sign up'
      : 'Reset your password'

  return (
    <div className="auth-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="auth-modal-heading">
      <div className="auth-modal">
        <button type="button" className="auth-modal-close" onClick={handleClose} aria-label="Close">
          ×
        </button>
        <h2 id="auth-modal-heading">{title}</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          {mode !== 'forgot' && (
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
          )}

          {mode === 'signup' && (
            <label>
              Confirm Password
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </label>
          )}

          {message && <p className="auth-message">{message}</p>}

          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Log in' : mode === 'signup' ? 'Create account' : 'Send reset link'}
          </button>
        </form>

        <div className="auth-switch">
          {mode === 'login' && (
            <>
              <button type="button" onClick={() => { setMode('forgot'); resetState() }}>
                Forgot password?
              </button>
              <button type="button" onClick={() => { setMode('signup'); resetState() }}>
                New here? Create an account
              </button>
            </>
          )}
          {mode === 'signup' && (
            <button type="button" onClick={() => { setMode('login'); resetState() }}>
              Already have an account? Log in
            </button>
          )}
          {mode === 'forgot' && (
            <button type="button" onClick={() => { setMode('login'); resetState() }}>
              Back to login
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
