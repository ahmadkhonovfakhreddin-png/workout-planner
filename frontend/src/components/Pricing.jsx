export default function Pricing({ onStartPlan }) {
  const handleStart = (planName) => {
    if (onStartPlan) {
      onStartPlan(planName)
    }
  }

  return (
    <section className="section pricing" id="pricing" aria-labelledby="pricing-heading">
      <div className="container">
        <header className="pricing-header">
          <h2 id="pricing-heading" className="section-title">Pricing</h2>
          <p className="section-subtitle">Choose the plan that fits your goals.</p>
        </header>

        <div className="pricing-grid">
          <article className="plan-card plan-basic">
            <div className="plan-header">
              <h3>Basic Plan</h3>
              <p className="plan-price">
                <span className="price-amount">$9</span> <span className="price-period">/ month</span>
              </p>
            </div>
            <p className="plan-tagline">Perfect for beginners starting their fitness journey.</p>
            <ul className="plan-features">
              <li>Personalized workout plan</li>
              <li>Basic nutrition guidance</li>
              <li>Progress tracking</li>
              <li>Email support</li>
              <li>Access on 1 device</li>
            </ul>
            <button
              type="button"
              className="btn btn-primary plan-cta"
              onClick={() => handleStart('Basic')}
            >
              👉 Start Basic
            </button>
          </article>

          <article className="plan-card plan-pro">
            <div className="plan-badge">Best Value</div>
            <div className="plan-header">
              <h3>Pro Plan <span className="plan-popular-star">⭐</span></h3>
              <p className="plan-price">
                <span className="price-amount">$19</span> <span className="price-period">/ month</span>
              </p>
            </div>
            <p className="plan-highlight">⭐ Most Popular</p>
            <p className="plan-tagline">For serious results and faster progress.</p>
            <ul className="plan-features">
              <li>Everything in Basic</li>
              <li>Advanced workout customization</li>
              <li>Full nutrition plan</li>
              <li>Priority support</li>
              <li>Access on 3 devices</li>
              <li>Monthly progress review</li>
            </ul>
            <button
              type="button"
              className="btn btn-primary plan-cta"
              onClick={() => handleStart('Pro')}
            >
              👉 Start Pro
            </button>
          </article>

          <article className="plan-card plan-elite">
            <div className="plan-header">
              <h3>Elite Plan</h3>
              <p className="plan-price">
                <span className="price-amount">$39</span> <span className="price-period">/ month</span>
              </p>
            </div>
            <p className="plan-tagline">Maximum support. Maximum results.</p>
            <ul className="plan-features">
              <li>Everything in Pro</li>
              <li>1-on-1 coaching support</li>
              <li>Weekly check-ins</li>
              <li>Custom meal adjustments</li>
              <li>Early access to new features</li>
              <li>Unlimited device access</li>
              <li>VIP support</li>
            </ul>
            <button
              type="button"
              className="btn btn-primary plan-cta"
              onClick={() => handleStart('Elite')}
            >
              👉 Start Elite
            </button>
          </article>
        </div>

        <section className="pricing-offer" aria-labelledby="special-offer-heading">
          <h3 id="special-offer-heading">Special Offer</h3>
          <p className="pricing-offer-code">
            Use promo code <span className="code">FAKH</span> and get <strong>30% OFF</strong> any plan.
          </p>
          <div className="pricing-offer-grid">
            <div>
              <p className="pricing-offer-line">
                Basic → <span className="old-price">$9</span> → <span className="new-price">$6.30</span>
              </p>
            </div>
            <div>
              <p className="pricing-offer-line">
                Pro → <span className="old-price">$19</span> → <span className="new-price">$13.30</span>
              </p>
            </div>
            <div>
              <p className="pricing-offer-line">
                Elite → <span className="old-price">$39</span> → <span className="new-price">$27.30</span>
              </p>
            </div>
          </div>
          <p className="pricing-offer-note">Limited time only. Cancel anytime. No hidden fees.</p>
        </section>
      </div>
    </section>
  )
}

