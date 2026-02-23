import { useState, useEffect } from 'react'
import { checkout } from '../api'

const PLAN_LABELS = { basic: 'Basic', pro: 'Pro', elite: 'Elite' }
const PLAN_PRICES = { basic: 9, pro: 19, elite: 39 }

export default function CheckoutModal({ open, onClose, onSuccess, plan }) {
  const [email, setEmail] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const planKey = (plan || 'pro').toLowerCase()
  const planLabel = PLAN_LABELS[planKey] || 'Pro'
  const price = PLAN_PRICES[planKey] ?? 19

  useEffect(() => {
    if (!open) {
      setEmail('')
      setCardNumber('')
      setExpiry('')
      setCvv('')
      setPhone('')
      setMessage('')
    }
  }, [open])

  if (!open) return null

  const formatCardNumber = (v) => {
    const digits = v.replace(/\D/g, '').slice(0, 16)
    const parts = []
    for (let i = 0; i < digits.length; i += 4) parts.push(digits.slice(i, i + 4))
    return parts.join(' ')
  }

  const formatExpiry = (v) => {
    const digits = v.replace(/\D/g, '').slice(0, 4)
    if (digits.length >= 2) return digits.slice(0, 2) + '/' + digits.slice(2)
    return digits
  }

  const handleCardChange = (e) => {
    const val = e.target.value
    if (val && !val.startsWith('4')) return
    setCardNumber(formatCardNumber(val))
  }

  const handleExpiryChange = (e) => setExpiry(formatExpiry(e.target.value))
  const handleCvvChange = (e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    try {
      setLoading(true)
      const result = await checkout(
        email.trim(),
        planKey,
        cardNumber.replace(/\s/g, ''),
        expiry,
        cvv,
        phone.trim()
      )
      if (!result.ok) {
        setMessage(result.data.detail || 'Payment failed. Please try again.')
        return
      }
      if (onSuccess) onSuccess()
      onClose()
    } catch (err) {
      setMessage('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="checkout-heading">
      <div className="auth-modal checkout-modal">
        <button type="button" className="auth-modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <h2 id="checkout-heading">Complete your subscription</h2>
        <p className="checkout-plan">
          <strong>{planLabel} Plan</strong> — ${price}/month
        </p>
        <p className="checkout-visa">We accept Visa. Your card is stored securely (we only save the last 4 digits).</p>

        <form onSubmit={handleSubmit} className="auth-form checkout-form">
          <label>
            Email
            <input
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Card number (Visa)
            <input
              type="text"
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="4242 4242 4242 4242"
              value={cardNumber}
              onChange={handleCardChange}
              maxLength={19}
              required
            />
          </label>
          <div className="checkout-row">
            <label>
              Expiry (MM/YY)
              <input
                type="text"
                inputMode="numeric"
                autoComplete="cc-exp"
                placeholder="12/28"
                value={expiry}
                onChange={handleExpiryChange}
                maxLength={5}
                required
              />
            </label>
            <label>
              CVV
              <input
                type="text"
                inputMode="numeric"
                autoComplete="cc-csc"
                placeholder="123"
                value={cvv}
                onChange={handleCvvChange}
                maxLength={4}
                required
              />
            </label>
          </div>
          <label>
            Phone number
            <input
              type="tel"
              autoComplete="tel"
              placeholder="+1 234 567 8900"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </label>

          {message && <p className="auth-message">{message}</p>}

          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? 'Processing...' : `Subscribe — $${price}/mo`}
          </button>
        </form>
        <p className="checkout-note">Cancel anytime. No hidden fees.</p>
      </div>
    </div>
  )
}
