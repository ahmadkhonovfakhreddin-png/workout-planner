import { useState, useEffect } from 'react'
import { ensureCsrf, getMe } from './api'
import Header from './components/Header'
import Hero from './components/Hero'
import WhyChooseUs from './components/WhyChooseUs'
import HowItWorks from './components/HowItWorks'
import Services from './components/Services'
import SuccessStories from './components/SuccessStories'
import Pricing from './components/Pricing'
import CTA from './components/CTA'
import Footer from './components/Footer'
import AuthModal from './components/AuthModal'
import CheckoutModal from './components/CheckoutModal'
import Portal from './components/Portal'

function App() {
  const [user, setUser] = useState(null)
  const [subscription, setSubscription] = useState(null)
  const [authOpen, setAuthOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('site') // 'site' | 'portal' — when logged in, can browse site without logging out

  const refreshMe = async () => {
    const data = await getMe()
    if (data?.user) {
      setUser(data.user)
      setSubscription(data.subscription || null)
    } else {
      setUser(null)
      setSubscription(null)
    }
  }

  useEffect(() => {
    let cancelled = false
    async function init() {
      await ensureCsrf()
      const data = await getMe()
      if (!cancelled && data?.user) {
        setUser(data.user)
        setSubscription(data.subscription || null)
      }
      if (!cancelled) setLoading(false)
    }
    init()
    return () => { cancelled = true }
  }, [])

  const handleStartPlan = (planName) => {
    const plan = planName || 'Pro'
    setSelectedPlan(plan)
    if (planName) {
      // Chose a plan (Start Basic/Pro/Elite) → open checkout directly, no login
      setCheckoutOpen(true)
      return
    }
    if (user) return
    setAuthOpen(true)
  }

  const handleAuthSuccess = async () => {
    const data = await getMe()
    if (data?.user) {
      setUser(data.user)
      setSubscription(data.subscription || null)
      setAuthOpen(false)
      // Go straight to Portal (no checkout step)
    }
  }

  const handleCheckoutSuccess = async () => {
    await refreshMe()
    setCheckoutOpen(false)
  }

  const handleLogout = () => {
    setUser(null)
    setSubscription(null)
    setCheckoutOpen(false)
    setAuthOpen(false)
    setView('site')
  }

  if (loading) {
    return (
      <div className="app-loading">
        <p>Loading...</p>
      </div>
    )
  }

  if (user && view === 'portal') {
    return (
      <>
        <Portal
          user={user}
          subscription={subscription}
          onLogout={handleLogout}
          onGoToSite={() => setView('site')}
          onSubscribe={(plan) => {
            setSelectedPlan(plan || 'Pro')
            setCheckoutOpen(true)
          }}
        />
        <CheckoutModal
          open={checkoutOpen}
          onClose={() => setCheckoutOpen(false)}
          onSuccess={handleCheckoutSuccess}
          plan={selectedPlan || 'Pro'}
        />
      </>
    )
  }

  return (
    <>
      <Header
        user={user}
        onGetStarted={() => handleStartPlan()}
        onGoToPortal={user ? () => setView('portal') : undefined}
      />
      <main>
        <Hero onStartPlan={handleStartPlan} />
        <WhyChooseUs />
        <HowItWorks />
        <Services />
        <SuccessStories onStartPlan={handleStartPlan} />
        <Pricing onStartPlan={handleStartPlan} />
        <CTA onStartPlan={handleStartPlan} />
      </main>
      <Footer />
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={handleAuthSuccess}
        initialPlan={selectedPlan}
      />
      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onSuccess={handleCheckoutSuccess}
        plan={selectedPlan || 'Pro'}
      />
    </>
  )
}

export default App
