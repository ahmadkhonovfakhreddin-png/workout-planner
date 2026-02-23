export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="hero-bg"></div>
      <div className="hero-content">
        <h1 id="hero-heading">Build Your Perfect Body — Your Way</h1>
        <p className="hero-subhead">
          Personalized workouts, nutrition plans, and progress tracking — all tailored to your goals and schedule. No generic programs. Just results.
        </p>
        <div className="hero-ctas">
          <a href="#pricing" className="btn btn-primary">Start Your Transformation</a>
          <a href="#how-it-works" className="btn btn-secondary">See How It Works</a>
        </div>
      </div>
    </section>
  )
}
