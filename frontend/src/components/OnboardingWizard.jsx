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

const PUSHUP_OPTIONS = [
  { id: 'lt-10', label: 'Less than 10', icon: '⚡' },
  { id: '10-20', label: '10 to 20', icon: '🔥' },
  { id: '21-30', label: '21 to 30', icon: '💪' },
  { id: 'gt-30', label: 'More than 30', icon: '🏆' },
]

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function scoreBodyFat(bodyFatId) {
  const index = BODY_FAT_RANGES.findIndex((range) => range.id === bodyFatId)
  if (index === -1) return 0.4
  const maxIndex = BODY_FAT_RANGES.length - 1
  const normalized = (maxIndex - index) / maxIndex
  return normalized
}

function scorePushups(pushupsId) {
  const map = {
    'lt-10': 0.2,
    '10-20': 0.4,
    '21-30': 0.7,
    'gt-30': 1,
  }
  return map[pushupsId] ?? 0.4
}

function scoreWeightDistance(weight, targetWeight) {
  if (!weight?.value || !targetWeight?.value) return 0.5

  const toKg = (value, unit) => {
    const numeric = Number(value)
    if (Number.isNaN(numeric)) return NaN
    if ((unit || 'kg') === 'lb') {
      return numeric * 0.453592
    }
    return numeric
  }

  const currentKg = toKg(weight.value, weight.unit)
  const targetKg = toKg(targetWeight.value, targetWeight.unit)

  if (Number.isNaN(currentKg) || Number.isNaN(targetKg)) return 0.5

  const diff = Math.abs(currentKg - targetKg)

  if (diff <= 3) return 1
  if (diff <= 7) return 0.8
  if (diff <= 15) return 0.6
  if (diff <= 25) return 0.4
  return 0.2
}

function calculateProgress(answers) {
  const bodyFatScore = scoreBodyFat(answers?.bodyFat)
  const pushupsScore = scorePushups(answers?.pushups)
  const weightScore = scoreWeightDistance(answers?.weight, answers?.targetWeight)

  const components = [bodyFatScore, pushupsScore, weightScore]
  const average = components.reduce((sum, value) => sum + value, 0) / components.length

  const percentage = 5 + average * 95
  return clamp(Math.round(percentage), 5, 100)
}

function calculateBmi(answers) {
  const height = answers?.height
  const weight = answers?.weight
  if (!height?.value || !weight?.value) return 24

  const toCm = (value, unit) => {
    const numeric = Number(value)
    if (Number.isNaN(numeric)) return NaN
    if ((unit || 'cm') === 'ft') {
      return numeric * 30.48
    }
    return numeric
  }

  const toKg = (value, unit) => {
    const numeric = Number(value)
    if (Number.isNaN(numeric)) return NaN
    if ((unit || 'kg') === 'lb') {
      return numeric * 0.453592
    }
    return numeric
  }

  const hCm = toCm(height.value, height.unit)
  const wKg = toKg(weight.value, weight.unit)
  if (Number.isNaN(hCm) || Number.isNaN(wKg) || hCm <= 0) return 24

  const hM = hCm / 100
  return clamp(wKg / (hM * hM), 10, 60)
}

function getBmiCategory(bmi) {
  if (bmi < 18.5) return 'Underweight'
  if (bmi < 25) return 'Normal'
  if (bmi < 30) return 'Overweight'
  return 'Obese'
}

function getBmiPosition(bmi) {
  const min = 10
  const max = 45
  const clamped = clamp(bmi, min, max)
  return ((clamped - min) / (max - min)) * 100
}

function estimateDailyCalories(answers, bmi) {
  const weight = answers?.weight
  if (!weight?.value) return 2000
  const toKg = (value, unit) => {
    const numeric = Number(value)
    if (Number.isNaN(numeric)) return NaN
    if ((unit || 'kg') === 'lb') {
      return numeric * 0.453592
    }
    return numeric
  }
  const wKg = toKg(weight.value, weight.unit)
  if (Number.isNaN(wKg)) return 2000

  const base = wKg * 30
  let factor = 1
  if (answers.goal === 'lose-weight') factor = 0.85
  if (answers.goal === 'gain-muscle') factor = 1.05
  if (answers.goal === 'get-shredded') factor = 0.8

  const adjusted = base * factor
  return Math.round(clamp(adjusted, 1000, 5000))
}

function estimateDailyWaterLiters(answers) {
  const weight = answers?.weight
  if (!weight?.value) return 2
  const toKg = (value, unit) => {
    const numeric = Number(value)
    if (Number.isNaN(numeric)) return NaN
    if ((unit || 'kg') === 'lb') {
      return numeric * 0.453592
    }
    return numeric
  }
  const wKg = toKg(weight.value, weight.unit)
  if (Number.isNaN(wKg)) return 2
  const liters = wKg * 0.033
  return clamp(liters, 1.5, 4)
}

function getCaloriePosition(calories) {
  const min = 1000
  const max = 5000
  const clamped = clamp(calories, min, max)
  return ((clamped - min) / (max - min)) * 100
}

function getBodyFatLabel(bodyFatId) {
  const found = BODY_FAT_RANGES.find((range) => range.id === bodyFatId)
  return found?.label || '—'
}

function getTargetBodyFatLabel(currentId, goal) {
  if (goal === 'get-shredded') return '8-12%'
  if (goal === 'gain-muscle') return '12-18%'
  if (goal === 'lose-weight') return '15-20%'
  return getBodyFatLabel(currentId)
}

function estimateFitnessAge(answers) {
  const ageId = answers?.age
  if (!ageId) return 25
  if (ageId === '18-29') return 23
  if (ageId === '30-39') return 32
  if (ageId === '40-49') return 41
  return 50
}

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

function HeightStep({ onSelect }) {
  const [unit, setUnit] = useState('cm')
  const [value, setValue] = useState('')

  const handleContinue = () => {
    const trimmed = value.trim()
    if (!trimmed) return
    onSelect({ value: trimmed, unit })
  }

  return (
    <div className="onboarding-step onboarding-height">
      <h1 className="onboarding-title">What&apos;s your height?</h1>
      <div className="onboarding-height-toggle" role="radiogroup" aria-label="Height unit">
        <button
          type="button"
          className={`onboarding-height-unit ${unit === 'cm' ? 'active' : ''}`}
          onClick={() => setUnit('cm')}
          aria-pressed={unit === 'cm'}
        >
          cm
        </button>
        <button
          type="button"
          className={`onboarding-height-unit ${unit === 'ft' ? 'active' : ''}`}
          onClick={() => setUnit('ft')}
          aria-pressed={unit === 'ft'}
        >
          ft
        </button>
      </div>
      <div className="onboarding-height-input-wrap">
        <input
          type="number"
          inputMode="decimal"
          className="onboarding-height-input"
          placeholder={unit === 'cm' ? 'Height, cm' : 'Height, ft'}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <div className="onboarding-height-underline" />
      </div>
      <button
        type="button"
        className="onboarding-height-continue"
        onClick={handleContinue}
        disabled={!value.trim()}
      >
        Continue
      </button>
    </div>
  )
}

function WeightStep({ onSelect }) {
  const [unit, setUnit] = useState('kg')
  const [value, setValue] = useState('')

  const handleContinue = () => {
    const trimmed = value.trim()
    if (!trimmed) return
    onSelect({ value: trimmed, unit })
  }

  return (
    <div className="onboarding-step onboarding-height onboarding-weight">
      <h1 className="onboarding-title">What&apos;s your current weight?</h1>
      <div className="onboarding-height-toggle" role="radiogroup" aria-label="Weight unit">
        <button
          type="button"
          className={`onboarding-height-unit ${unit === 'kg' ? 'active' : ''}`}
          onClick={() => setUnit('kg')}
          aria-pressed={unit === 'kg'}
        >
          kg
        </button>
        <button
          type="button"
          className={`onboarding-height-unit ${unit === 'lb' ? 'active' : ''}`}
          onClick={() => setUnit('lb')}
          aria-pressed={unit === 'lb'}
        >
          lb
        </button>
      </div>
      <div className="onboarding-height-input-wrap">
        <input
          type="number"
          inputMode="decimal"
          className="onboarding-height-input"
          placeholder={unit === 'kg' ? 'Weight, kg' : 'Weight, lb'}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <div className="onboarding-height-underline" />
      </div>
      <button
        type="button"
        className="onboarding-height-continue"
        onClick={handleContinue}
        disabled={!value.trim()}
      >
        Continue
      </button>
    </div>
  )
}

function TargetWeightStep({ onSelect }) {
  const [unit, setUnit] = useState('kg')
  const [value, setValue] = useState('')

  const handleContinue = () => {
    const trimmed = value.trim()
    if (!trimmed) return
    onSelect({ value: trimmed, unit })
  }

  return (
    <div className="onboarding-step onboarding-height onboarding-weight">
      <h1 className="onboarding-title">What&apos;s your target weight?</h1>
      <div className="onboarding-height-toggle" role="radiogroup" aria-label="Target weight unit">
        <button
          type="button"
          className={`onboarding-height-unit ${unit === 'kg' ? 'active' : ''}`}
          onClick={() => setUnit('kg')}
          aria-pressed={unit === 'kg'}
        >
          kg
        </button>
        <button
          type="button"
          className={`onboarding-height-unit ${unit === 'lb' ? 'active' : ''}`}
          onClick={() => setUnit('lb')}
          aria-pressed={unit === 'lb'}
        >
          lb
        </button>
      </div>
      <div className="onboarding-height-input-wrap">
        <input
          type="number"
          inputMode="decimal"
          className="onboarding-height-input"
          placeholder={unit === 'kg' ? 'Target weight, kg' : 'Target weight, lb'}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <div className="onboarding-height-underline" />
      </div>
      <button
        type="button"
        className="onboarding-height-continue"
        onClick={handleContinue}
        disabled={!value.trim()}
      >
        Continue
      </button>
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

function PushupsStep({ onSelect }) {
  return (
    <div className="onboarding-step onboarding-pushups">
      <h1 className="onboarding-title">How many push-ups can you do in one round?</h1>
      <div className="onboarding-cards onboarding-cards-stack">
        {PUSHUP_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className="onboarding-card onboarding-card-row"
            onClick={() => onSelect(opt.id)}
            aria-pressed="false"
          >
            <span className="onboarding-card-label">
              <span className="onboarding-card-label-icon" aria-hidden="true">
                {opt.icon}
              </span>
              {opt.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

function ResultStep({ onDone, answers }) {
  const progressPercent = calculateProgress(answers)

  const now = new Date()
  const goal = new Date()
  goal.setMonth(goal.getMonth() + 5)

  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })

  const startDateLabel = dateFormatter.format(now)
  const goalDateLabel = dateFormatter.format(goal)

  const currentWeightLabel = answers?.weight?.value
    ? `${answers.weight.value} ${answers.weight.unit || 'kg'}`
    : 'Current'

  const targetWeightLabel = answers?.targetWeight?.value
    ? `${answers.targetWeight.value} ${answers.targetWeight.unit || 'kg'}`
    : 'Target'

  const startBadgeLabel =
    currentWeightLabel === 'Current'
      ? `${progressPercent}% ready`
      : `${currentWeightLabel} · ${progressPercent}% ready`

  const targetBadgeLabel =
    targetWeightLabel === 'Target' ? 'Goal · 100%' : `${targetWeightLabel} · 100%`

  return (
    <div className="onboarding-step onboarding-result">
      <div className="onboarding-result-card">
        <h1 className="onboarding-result-title">
          The last plan you&apos;ll ever need to{' '}
          <span className="onboarding-result-highlight">finally get in shape</span>
        </h1>
        <p className="onboarding-result-text">
          Based on your answers, you&apos;re starting about{' '}
          <span className="onboarding-result-highlight">{progressPercent}%</span> of the way
          toward your goal. We believe you can reach your goal weight of{' '}
          <span className="onboarding-result-strong">{targetWeightLabel}</span> by
        </p>
        <p className="onboarding-result-date">{goalDateLabel}</p>

        <div className="onboarding-result-chart">
          <div className="onboarding-result-curve">
            <div className="onboarding-result-point-start">
              <span className="onboarding-result-badge">{startBadgeLabel}</span>
            </div>
            <div className="onboarding-result-point-end">
              <span className="onboarding-result-badge onboarding-result-badge-target">
                {targetBadgeLabel}
              </span>
            </div>
          </div>
          <div className="onboarding-result-axis">
            <span>{startDateLabel}</span>
            <span>{goalDateLabel}</span>
          </div>
          <p className="onboarding-result-footnote">
            This chart uses your current weight, target weight, body fat and push-ups to estimate
            your starting point today.
          </p>
        </div>

        <button
          type="button"
          className="onboarding-result-button"
          onClick={onDone}
        >
          Got it
        </button>
      </div>
    </div>
  )
}

function NameStep({ onSubmit }) {
  const [value, setValue] = useState('')
  const [touched, setTouched] = useState(false)

  const trimmed = value.trim()
  const isValid = trimmed.length > 0

  const handleContinue = () => {
    if (!isValid) {
      setTouched(true)
      return
    }
    onSubmit(trimmed)
  }

  const handleBlur = () => {
    if (!touched) setTouched(true)
  }

  return (
    <div className="onboarding-step onboarding-name">
      <div className="onboarding-name-toast" role="status" aria-live="polite">
        <span className="onboarding-name-toast-icon" aria-hidden="true">
          ✓
        </span>
        <span>Your personalized workout plan is ready!</span>
      </div>

      <h1 className="onboarding-title">What&apos;s your name?</h1>

      <div className="onboarding-name-input-wrap">
        <label className="onboarding-name-label">
          <span className="onboarding-name-label-text">Name</span>
          <input
            type="text"
            className={`onboarding-name-input ${!isValid && touched ? 'onboarding-name-input-error' : ''}`}
            placeholder="Name"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={handleBlur}
          />
        </label>
        {!isValid && touched && (
          <p className="onboarding-name-error">Please enter your name</p>
        )}
      </div>

      <button
        type="button"
        className="onboarding-name-continue"
        onClick={handleContinue}
        disabled={!isValid}
      >
        Continue
      </button>
    </div>
  )
}

function DobStep({ onSubmit }) {
  const [value, setValue] = useState('')
  const [touched, setTouched] = useState(false)

  const trimmed = value.trim()
  const isValid = trimmed.length > 0

  const handleContinue = () => {
    if (!isValid) {
      setTouched(true)
      return
    }
    onSubmit(trimmed)
  }

  const handleBlur = () => {
    if (!touched) setTouched(true)
  }

  return (
    <div className="onboarding-step onboarding-dob">
      <h1 className="onboarding-title">What&apos;s your date of birth?</h1>

      <div className="onboarding-dob-input-wrap">
        <input
          type="text"
          className={`onboarding-dob-input ${!isValid && touched ? 'onboarding-dob-input-error' : ''}`}
          placeholder="DD / MM / YYYY"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
        />
        {!isValid && touched && (
          <p className="onboarding-dob-error">Please enter your date of birth</p>
        )}
      </div>

      <button
        type="button"
        className="onboarding-dob-continue"
        onClick={handleContinue}
        disabled={!isValid}
      >
        Continue
      </button>
    </div>
  )
}

function EmailStep({ onSubmit }) {
  const [value, setValue] = useState('')
  const [touched, setTouched] = useState(false)

  const trimmed = value.trim()
  const isValid = trimmed.length > 0 && trimmed.includes('@')

  const handleContinue = () => {
    if (!isValid) {
      setTouched(true)
      return
    }
    onSubmit(trimmed)
  }

  const handleBlur = () => {
    if (!touched) setTouched(true)
  }

  return (
    <div className="onboarding-step onboarding-email">
      <div className="onboarding-name-toast" role="status" aria-live="polite">
        <span className="onboarding-name-toast-icon" aria-hidden="true">
          ✓
        </span>
        <span>Your personalized workout plan is ready!</span>
      </div>

      <h1 className="onboarding-title">Enter your email</h1>

      <div className="onboarding-email-input-wrap">
        <input
          type="email"
          className={`onboarding-email-input ${!isValid && touched ? 'onboarding-email-input-error' : ''}`}
          placeholder="name@example.com"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
        />
        {!isValid && touched && (
          <p className="onboarding-email-error">Please enter a valid email address</p>
        )}
      </div>

      <p className="onboarding-email-privacy">
        <span className="onboarding-email-privacy-icon" aria-hidden="true">
          🔒
        </span>
        We respect your privacy and take protecting it very seriously — no spam
      </p>

      <button
        type="button"
        className="onboarding-email-continue"
        onClick={handleContinue}
        disabled={!isValid}
      >
        Continue
      </button>
    </div>
  )
}

function SummaryStep({ answers, onGetPlan, onSpin }) {
  const bmi = calculateBmi(answers)
  const bmiCategory = getBmiCategory(bmi)
  const bmiPosition = getBmiPosition(bmi)
  const dailyCalories = estimateDailyCalories(answers, bmi)
  const dailyWater = estimateDailyWaterLiters(answers)
  const currentBodyFatLabel = getBodyFatLabel(answers.bodyFat)
  const targetBodyFatLabel = getTargetBodyFatLabel(answers.bodyFat, answers.goal)
  const fitnessAge = estimateFitnessAge(answers)
  const goalFitnessAge = Math.max(12, fitnessAge - 6)

  return (
    <div className="onboarding-step onboarding-summary">
      <div className="onboarding-summary-hero">
        <div className="onboarding-summary-hero-now" />
        <div className="onboarding-summary-hero-goal" />
      </div>

      <div className="onboarding-summary-table">
        <div className="onboarding-summary-col">
          <div className="onboarding-summary-col-header">Now</div>
          <div className="onboarding-summary-row">
            <span>Body fat</span>
            <strong>{currentBodyFatLabel}</strong>
          </div>
          <div className="onboarding-summary-row">
            <span>Fitness age</span>
            <strong>{fitnessAge}</strong>
          </div>
          <div className="onboarding-summary-row">
            <span>Body muscles</span>
            <span className="onboarding-summary-muscles onboarding-summary-muscles-low" />
          </div>
        </div>
        <div className="onboarding-summary-col">
          <div className="onboarding-summary-col-header">Your goal</div>
          <div className="onboarding-summary-row">
            <span>Body fat</span>
            <strong>{targetBodyFatLabel}</strong>
          </div>
          <div className="onboarding-summary-row">
            <span>Fitness age</span>
            <strong>{goalFitnessAge}</strong>
          </div>
          <div className="onboarding-summary-row">
            <span>Body muscles</span>
            <span className="onboarding-summary-muscles onboarding-summary-muscles-high" />
          </div>
        </div>
      </div>

      <div className="onboarding-summary-section">
        <h2 className="onboarding-summary-title">Personal summary based on your answers</h2>

        <div className="onboarding-summary-bmi-card">
          <div className="onboarding-summary-bmi-header">
            <span>Current BMI</span>
            <span className="onboarding-summary-bmi-info">i</span>
          </div>
          <div className="onboarding-summary-bmi-value">
            {bmi.toFixed(2)} BMI
          </div>
          <div className="onboarding-summary-bmi-bar">
            <div className="onboarding-summary-bmi-gradient" />
            <div className="onboarding-summary-bmi-marker" style={{ left: `${bmiPosition}%` }} />
          </div>
          <div className="onboarding-summary-bmi-labels">
            <span>Underweight</span>
            <span>Obese</span>
          </div>
          <div className="onboarding-summary-bmi-diagnosis">
            <strong>{bmiCategory}</strong>
            <p>
              The body mass index (BMI) is a measure that uses your height and weight to work out if
              your weight is healthy.
            </p>
          </div>
        </div>
      </div>

      <div className="onboarding-summary-cards">
        <div className="onboarding-summary-metric-card">
          <div className="onboarding-summary-metric-label">Daily calorie intake</div>
          <div className="onboarding-summary-metric-value">
            {dailyCalories.toLocaleString()} kcal
          </div>
          <div className="onboarding-summary-metric-slider">
            <div className="onboarding-summary-metric-slider-track" />
            <div
              className="onboarding-summary-metric-slider-thumb"
              style={{ left: `${getCaloriePosition(dailyCalories)}%` }}
            />
          </div>
          <div className="onboarding-summary-metric-range">
            <span>1000 kcal</span>
            <span>5000 kcal</span>
          </div>
        </div>

        <div className="onboarding-summary-metric-card">
          <div className="onboarding-summary-metric-label">Daily water intake</div>
          <div className="onboarding-summary-metric-value">
            {dailyWater.toFixed(1)} l
          </div>
          <div className="onboarding-summary-water-icons">
            {Array.from({ length: 8 }).map((_, index) => (
              <span
                key={index}
                className={`onboarding-summary-water-cup ${
                  index < Math.round(dailyWater) ? 'filled' : ''
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="onboarding-summary-list-section">
        <h3 className="onboarding-summary-subtitle">What you get</h3>
        <ul className="onboarding-summary-list">
          <li>
            <span className="onboarding-summary-list-icon">✓</span>
            <div>
              <strong>A structured workout plan</strong>
              <p>Tailored to your age, body type, and wellness goals.</p>
            </div>
          </li>
          <li>
            <span className="onboarding-summary-list-icon">✓</span>
            <div>
              <strong>15–30 minutes a day plan</strong>
              <p>Designed to build muscle and shed weight.</p>
            </div>
          </li>
          <li>
            <span className="onboarding-summary-list-icon">✓</span>
            <div>
              <strong>Step-by-step guidance</strong>
              <p>Suitable for beginners to see visible changes in weeks.</p>
            </div>
          </li>
        </ul>
      </div>

      <button
        type="button"
        className="onboarding-summary-get-plan"
        onClick={onSpin}
      >
        Get My Plan
      </button>
    </div>
  )
}

function DiscountWheelModal({ open, onClose, onFinished }) {
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState(null)

  if (!open) return null

  const slices = ['-15%', '-25%', '-35%', '-50%', '-60%', '-77%']

  const handleSpin = () => {
    if (spinning) return
    setSpinning(true)
    const picked = slices[Math.floor(Math.random() * slices.length)]
    setTimeout(() => {
      setResult(picked)
      setSpinning(false)
      onFinished?.(picked)
    }, 2000)
  }

  return (
    <div className="onboarding-wheel-backdrop">
      <div className="onboarding-wheel-modal">
        <button
          type="button"
          className="onboarding-wheel-close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="onboarding-wheel-title">
          Spin and win <span className="onboarding-wheel-title-highlight">extra discount</span> of up
          to -77%
        </h2>
        <div className={`onboarding-wheel ${spinning ? 'spinning' : ''}`}>
          {/* purely visual wheel; actual result is chosen in JS above */}
          <div className="onboarding-wheel-center" />
        </div>
        {result && (
          <p className="onboarding-wheel-result">
            You&apos;ve unlocked <strong>{result}</strong> off your plan!
          </p>
        )}
        <button
          type="button"
          className="onboarding-wheel-spin"
          onClick={handleSpin}
          disabled={spinning}
        >
          {spinning ? 'Spinning...' : result ? 'Spin again' : 'Spin now'}
        </button>
        {result && (
          <button
            type="button"
            className="onboarding-wheel-get-plan"
            onClick={onClose}
          >
            Continue to subscription
          </button>
        )}
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
  const [wheelOpen, setWheelOpen] = useState(false)
  const [answers, setAnswers] = useState({
    age: null,
    height: null,
    weight: null,
    targetWeight: null,
    gender: null,
    bodyType: null,
    bodyFat: null,
    goal: null,
    pushups: null,
    name: null,
    dob: null,
    email: null,
  })

  const finalizeOnboarding = (finalAnswers) => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(ONBOARDING_STORAGE_KEY, '1')
      try {
        localStorage.setItem('muscle_onboarding_answers', JSON.stringify(finalAnswers))
      } catch (_) {}
    }
    onComplete?.()
  }

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
    setStep(6)
  }

  const handleHeightSelect = (height) => {
    setAnswers((a) => ({ ...a, height }))
    setStep(7)
  }

  const handleWeightSelect = (weight) => {
    setAnswers((a) => ({ ...a, weight }))
    setStep(8)
  }

  const handleTargetWeightSelect = (targetWeight) => {
    setAnswers((a) => ({ ...a, targetWeight }))
    setStep(9)
  }

  const handlePushupsSelect = (pushups) => {
    setAnswers((a) => ({ ...a, pushups }))
    setStep(10)
  }

  const handleResultDone = () => {
    setStep(11)
  }

  const handleNameSubmit = (name) => {
    setAnswers((prev) => {
      const updated = { ...prev, name }
      setStep(12)
      return updated
    })
  }

  const handleDobSubmit = (dob) => {
    setAnswers((prev) => {
      const updated = { ...prev, dob }
      setStep(13)
      return updated
    })
  }

  const handleEmailSubmit = (email) => {
    setAnswers((prev) => {
      const updated = { ...prev, email }
      setStep(14)
      return updated
    })
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
        {Array.from({ length: 9 }).map((_, index) => (
          <span
            // 9 dots = 9 actual questions (Age → … → Push-ups).
            key={index}
            className={`onboarding-step-dot ${step >= index + 1 ? 'active' : ''}`}
          />
        ))}
      </div>
      {step === 1 && <AgeStep onSelect={handleAgeSelect} />}
      {step === 2 && <GenderStep onSelect={handleGenderSelect} />}
      {step === 3 && <BodyTypeStep onSelect={handleBodyTypeSelect} />}
      {step === 4 && <GoalStep onSelect={handleGoalSelect} />}
      {step === 5 && <BodyFatStep onSelect={handleBodyFatSelect} />}
      {step === 6 && <HeightStep onSelect={handleHeightSelect} />}
      {step === 7 && <WeightStep onSelect={handleWeightSelect} />}
      {step === 8 && <TargetWeightStep onSelect={handleTargetWeightSelect} />}
      {step === 9 && <PushupsStep onSelect={handlePushupsSelect} />}
      {step === 10 && <ResultStep answers={answers} onDone={handleResultDone} />}
      {step === 11 && <NameStep onSubmit={handleNameSubmit} />}
      {step === 12 && <DobStep onSubmit={handleDobSubmit} />}
      {step === 13 && <EmailStep onSubmit={handleEmailSubmit} />}
      {step === 14 && (
        <SummaryStep
          answers={answers}
          onGetPlan={() => finalizeOnboarding(answers)}
          onSpin={() => setWheelOpen(true)}
        />
      )}
      <DiscountWheelModal
        open={wheelOpen}
        onClose={() => {
          setWheelOpen(false)
          finalizeOnboarding(answers)
        }}
      />
    </div>
  )
}
