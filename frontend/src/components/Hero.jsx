export default function Hero({ onStartPlan }) {
  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="hero-bg"></div>
      <div className="hero-content">
        <h1 id="hero-heading">Build Your Perfect Body — Your Way</h1>
        <p className="hero-subhead">
          Personalized workouts, nutrition plans, and progress tracking — all tailored to your goals and schedule. No generic programs. Just results.
        </p>
        <div className="hero-ctas">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onStartPlan && onStartPlan()}
          >
            Start Your Transformation
          </button>
          <a href="#how-it-works" className="btn btn-secondary">See How It Works</a>
        </div>
      </div>
    </section>
  )
}
