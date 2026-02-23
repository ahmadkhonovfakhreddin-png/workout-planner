import { useState } from 'react'
import { logout as apiLogout } from '../api'

const PLAN_LABELS = { basic: 'Basic', pro: 'Pro', elite: 'Elite' }

const WORKOUTS_BY_PLAN = {
  basic: [
    { day: 'Day 1', focus: 'Upper body', duration: '45 min', calories: '~280' },
    { day: 'Day 2', focus: 'Lower body', duration: '40 min', calories: '~250' },
    { day: 'Day 3', focus: 'Full body', duration: '50 min', calories: '~320' },
  ],
  pro: [
    { day: 'Day 1', focus: 'Push (chest, shoulders, triceps)', duration: '55 min', calories: '~340' },
    { day: 'Day 2', focus: 'Pull (back, biceps)', duration: '50 min', calories: '~310' },
    { day: 'Day 3', focus: 'Legs', duration: '50 min', calories: '~330' },
    { day: 'Day 4', focus: 'Core & conditioning', duration: '35 min', calories: '~220' },
  ],
  elite: [
    { day: 'Day 1', focus: 'Push + core', duration: '60 min', calories: '~380' },
    { day: 'Day 2', focus: 'Pull', duration: '55 min', calories: '~350' },
    { day: 'Day 3', focus: 'Legs', duration: '55 min', calories: '~360' },
    { day: 'Day 4', focus: 'Upper + cardio', duration: '50 min', calories: '~340' },
    { day: 'Day 5', focus: 'Full body / flexibility', duration: '45 min', calories: '~280' },
  ],
}

function displayName(email) {
  if (!email) return 'there'
  const part = email.split('@')[0] || 'there'
  return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
}

export default function Portal({ user, subscription, onLogout, onGoToSite, onSubscribe }) {
  const [tab, setTab] = useState('portal') // 'portal' | 'workouts'
  const plan = (subscription?.plan || 'basic').toLowerCase()
  const planLabel = PLAN_LABELS[plan] || 'Basic'
  const workouts = WORKOUTS_BY_PLAN[plan] || WORKOUTS_BY_PLAN.basic
  const hasPlan = !!subscription
  const name = displayName(user?.email)

  const handleLogout = async () => {
    await apiLogout()
    if (onLogout) onLogout()
  }

  return (
    <div className="portal">
      <header className="portal-header">
        <div className="portal-header-inner container">
          {onGoToSite ? (
            <button type="button" className="logo logo-as-button" onClick={onGoToSite} aria-label="Back to site">
              <span className="logo-text">Muscle</span>
            </button>
          ) : (
            <a href="/" className="logo">
              <span className="logo-text">Muscle</span>
            </a>
          )}
          <nav className="portal-nav">
            <button
              type="button"
              className={tab === 'portal' ? 'active' : ''}
              onClick={() => setTab('portal')}
            >
              My Portal
            </button>
            <button
              type="button"
              className={tab === 'workouts' ? 'active' : ''}
              onClick={() => setTab('workouts')}
              disabled={!hasPlan}
            >
              My Workout Plans
            </button>
          </nav>
          <div className="portal-user">
            <span className="portal-email">{user?.email}</span>
            <span className="portal-plan">{hasPlan ? `${planLabel} Plan` : 'No plan'}</span>
            <button type="button" className="btn btn-secondary btn-sm" onClick={handleLogout}>
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="portal-main">
        <div className="container">
          {tab === 'portal' && (
            <section className="portal-dashboard" aria-labelledby="portal-heading">
              <h1 id="portal-heading">Welcome, {name}!</h1>
              <p className="portal-welcome">
                {hasPlan ? "Here's your overview and your plan." : "You're logged in. Choose a plan to get your workouts and nutrition."}
              </p>

              {!hasPlan && onSubscribe && (
                <div className="portal-no-plan">
                  <p>Subscribe to unlock personalized workouts, nutrition, and progress tracking.</p>
                  <button type="button" className="btn btn-primary" onClick={() => onSubscribe('Pro')}>
                    Choose your plan
                  </button>
                </div>
              )}

              {hasPlan && (
                <>
                  <div className="portal-cards">
                    <div className="portal-card">
                      <h3>Your plan</h3>
                      <p><strong>{planLabel}</strong></p>
                      {subscription?.card_last4 && (
                        <p className="portal-card-info">Card ending •••• {subscription.card_last4}</p>
                      )}
                    </div>
                    <div className="portal-card">
                      <h3>This week</h3>
                      <p>{workouts.length} workouts planned</p>
                      <p className="portal-card-muted">Based on your {planLabel} plan</p>
                    </div>
                    <div className="portal-card">
                      <h3>Calories & nutrition</h3>
                      <p>Your daily targets are in your plan.</p>
                      <p className="portal-card-muted">
                        {plan === 'basic' && 'Basic nutrition guidance included.'}
                        {plan === 'pro' && 'Full nutrition plan + monthly review.'}
                        {plan === 'elite' && 'Custom meal adjustments + weekly check-ins.'}
                      </p>
                    </div>
                  </div>

                  <div className="portal-cta">
                    <button type="button" className="btn btn-primary" onClick={() => setTab('workouts')}>
                      View My Workout Plans
                    </button>
                  </div>
                </>
              )}
            </section>
          )}

          {tab === 'workouts' && hasPlan && (
            <section className="portal-workouts" aria-labelledby="workouts-heading">
              <h1 id="workouts-heading">My Workout Plans</h1>
              <p className="portal-welcome">Your personalized workouts for the {planLabel} plan.</p>

              <ul className="workout-list">
                {workouts.map((w, i) => (
                  <li key={i} className="workout-item">
                    <div className="workout-day">{w.day}</div>
                    <div className="workout-details">
                      <strong>{w.focus}</strong>
                      <span>{w.duration}</span>
                      <span>~{w.calories} cal</span>
                    </div>
                  </li>
                ))}
              </ul>

              <p className="portal-note">
                Track your sets and reps in the app. Your plan is adjusted to your schedule and goals.
              </p>
            </section>
          )}
        </div>
      </main>
    </div>
  )
}
