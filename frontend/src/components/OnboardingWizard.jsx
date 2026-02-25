import { useState } from 'react'

const AGE_OPTIONS = [
  { id: '18-29', label: 'Age: 18-29', img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80' },
  { id: '30-39', label: 'Age: 30-39', img: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&q=80' },
  { id: '40-49', label: 'Age: 40-49', img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80' },
  { id: '50+', label: 'Age: 50+', img: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&q=80' },
]

const GENDER_OPTIONS = [
  { id: 'male', label: 'Male', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80' },
  { id: 'female', label: 'Female', img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80' },
]

const BODY_TYPE_OPTIONS = [
  {
    id: 'ectomorph',
    label: 'Ectomorph',
    description: 'Lean, slender build — fast metabolism',
    img: '/assets/ectomorph.png',
    position: null, // full photo
  },
  {
    id: 'mesomorph',
    label: 'Mesomorph',
    description: 'Athletic, muscular — gains muscle easily',
    img: '/assets/body-types.png',
    position: '50%', // center third
  },
  {
    id: 'endomorph',
    label: 'Endomorph',
    description: 'Rounder build — gains weight more easily',
    img: '/assets/body-types.png',
    position: '100%', // right third
  },
]

const BODY_FAT_RANGES = [
  { id: '5-9', label: '5-9%' },
  { id: '10-14', label: '10-14%' },
  { id: '15-19', label: '15-19%' },
  { id: '20-24', label: '20-24%' },
  { id: '25-29', label: '25-29%' },
  { id: '30-40', label: '30-40%' },
  { id: '40+', label: '>40%' },
]

const GOAL_OPTIONS = [
  {
    id: 'lose-weight',
    label: 'Lose Weight',
    img: 'https://images.unsplash.com/photo-1554344058-8d1d1dbc5960?w=400&q=80',
  },
  {
    id: 'gain-muscle',
    label: 'Gain Muscle Mass',
    img: 'https://images.unsplash.com/photo-1598971639058-8cdbd776edfc?w=400&q=80',
  },
  {
    id: 'get-shredded',
    label: 'Get Shredded',
    img: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&q=80',
  },
]

function AgeStep({ onSelect }) {
  return (
    <div className="onboarding-step onboarding-age">
      <h1 className="onboarding-title">Build your perfect body</h1>
      <p className="onboarding-subtitle">According to your age and BMI</p>
      <div className="onboarding-cards onboarding-cards-grid">
        {AGE_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className="onboarding-card"
            onClick={() => onSelect(opt.id)}
            aria-pressed="false"
          >
            <div className="onboarding-card-media">
              <img src={opt.img} alt="" />
            </div>
            <div className="onboarding-card-bar">
              <span>{opt.label}</span>
              <span className="onboarding-arrow" aria-hidden>→</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

function GenderStep({ onSelect }) {
  return (
    <div className="onboarding-step onboarding-gender">
      <h1 className="onboarding-title">Choose your gender</h1>
      <div className="onboarding-cards onboarding-cards-stack">
        {GENDER_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className="onboarding-card onboarding-card-row"
            onClick={() => onSelect(opt.id)}
            aria-pressed="false"
          >
            <span className="onboarding-card-label">{opt.label}</span>
            <div className="onboarding-card-media onboarding-card-media-inline">
              <img src={opt.img} alt="" />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

function BodyTypeStep({ onSelect }) {
  return (
    <div className="onboarding-step onboarding-body-type">
      <h1 className="onboarding-title">Choose your body type</h1>
      <p className="onboarding-subtitle">Ectomorph, mesomorph, or endomorph — we’ll tailor your plan.</p>
      <div className="onboarding-cards onboarding-cards-three">
        {BODY_TYPE_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className="onboarding-card onboarding-card-body-type"
            onClick={() => onSelect(opt.id)}
            aria-pressed="false"
          >
            <div
              className={`onboarding-card-media ${opt.position != null ? 'onboarding-card-media-body-type' : ''}`}
              style={opt.position != null ? { '--body-type-position': opt.position } : undefined}
            >
              <img src={opt.img} alt={opt.label} />
            </div>
            <div className="onboarding-card-bar">
              <span className="onboarding-card-body-type-label">{opt.label}</span>
              <span className="onboarding-arrow" aria-hidden>→</span>
            </div>
            {opt.description && (
              <p className="onboarding-card-body-type-desc">{opt.description}</p>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

function BodyFatStep({ onSelect }) {
  const [index, setIndex] = useState(3) // default to 20-24%
  const current = BODY_FAT_RANGES[index]

  const handleChange = (event) => {
    setIndex(Number(event.target.value))
  }

  const handleContinue = () => {
    onSelect(current.id)
  }

  return (
    <div className="onboarding-step onboarding-bodyfat">
      <h1 className="onboarding-title">Choose your level of body fat</h1>
      <div className="onboarding-bodyfat-card">
        <div className="onboarding-bodyfat-current">
          <span>{current.label}</span>
        </div>
        <div className="onboarding-bodyfat-slider">
          <input
            type="range"
            min="0"
            max={BODY_FAT_RANGES.length - 1}
            step="1"
            value={index}
            onChange={handleChange}
          />
          <div className="onboarding-bodyfat-labels">
            <span>{BODY_FAT_RANGES[0].label}</span>
            <span>{BODY_FAT_RANGES[BODY_FAT_RANGES.length - 1].label}</span>
          </div>
        </div>
      </div>
      <button
        type="button"
        className="onboarding-bodyfat-continue"
        onClick={handleContinue}
      >
        Continue
      </button>
    </div>
  )
}

function GoalStep({ onSelect }) {
  return (
    <div className="onboarding-step onboarding-goal">
      <h1 className="onboarding-title">Choose your goal</h1>
      <div className="onboarding-cards onboarding-cards-stack">
        {GOAL_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className="onboarding-card onboarding-card-row"
            onClick={() => onSelect(opt.id)}
            aria-pressed="false"
          >
            <span className="onboarding-card-label">{opt.label}</span>
            <div className="onboarding-card-media onboarding-card-media-inline">
              <img src={opt.img} alt={opt.label} />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

const ONBOARDING_STORAGE_KEY = 'muscle_onboarding_done'

export function isOnboardingComplete() {
  if (typeof window === 'undefined') return true
  return !!localStorage.getItem(ONBOARDING_STORAGE_KEY)
}

export default function OnboardingWizard({ onComplete }) {
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState({ age: null, gender: null, bodyType: null, bodyFat: null, goal: null })

  const handleBack = () => {
    setStep((prev) => (prev > 1 ? prev - 1 : prev))
  }

  const handleAgeSelect = (age) => {
    setAnswers((a) => ({ ...a, age }))
    setStep(2)
  }

  const handleGenderSelect = (gender) => {
    setAnswers((a) => ({ ...a, gender }))
    setStep(3)
  }

  const handleBodyTypeSelect = (bodyType) => {
    setAnswers((a) => ({ ...a, bodyType }))
    setStep(4)
  }

  const handleGoalSelect = (goal) => {
    setAnswers((a) => ({ ...a, goal }))
    setStep(5)
  }

  const handleBodyFatSelect = (bodyFat) => {
    const updatedAnswers = { ...answers, bodyFat }
    setAnswers(updatedAnswers)
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(ONBOARDING_STORAGE_KEY, '1')
      try {
        localStorage.setItem('muscle_onboarding_answers', JSON.stringify(updatedAnswers))
      } catch (_) {}
    }
    onComplete?.()
  }

  return (
    <div className="onboarding" role="region" aria-label="Onboarding">
      <div className="onboarding-header">
        {step > 1 && (
          <button
            type="button"
            className="onboarding-back"
            onClick={handleBack}
          >
            ← Back
          </button>
        )}
      </div>
      <div className="onboarding-progress">
        <span className="onboarding-step-dot active" />
        <span className={`onboarding-step-dot ${step >= 2 ? 'active' : ''}`} />
        <span className={`onboarding-step-dot ${step >= 3 ? 'active' : ''}`} />
        <span className={`onboarding-step-dot ${step >= 4 ? 'active' : ''}`} />
        <span className={`onboarding-step-dot ${step >= 5 ? 'active' : ''}`} />
      </div>
      {step === 1 && <AgeStep onSelect={handleAgeSelect} />}
      {step === 2 && <GenderStep onSelect={handleGenderSelect} />}
      {step === 3 && <BodyTypeStep onSelect={handleBodyTypeSelect} />}
      {step === 4 && <GoalStep onSelect={handleGoalSelect} />}
      {step === 5 && <BodyFatStep onSelect={handleBodyFatSelect} />}
    </div>
  )
}
