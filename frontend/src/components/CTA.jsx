export default function CTA({ onStartPlan }) {
  return (
    <section className="section cta-final" aria-labelledby="cta-heading">
      <div className="container">
        <div className="cta-box">
          <h2 id="cta-heading">Ready to Transform?</h2>
          <p>
            Join others who've built stronger, healthier bodies with plans made for them. Start with a risk-free trial — we offer a money-back guarantee if you're not satisfied.
          </p>
          <div className="cta-buttons">
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={() => onStartPlan && onStartPlan('Pro')}
            >
              Start Your Plan
            </button>
            <a href="#how-it-works" className="btn btn-secondary btn-lg">Learn More</a>
          </div>
        </div>
      </div>
    </section>
  )
}
