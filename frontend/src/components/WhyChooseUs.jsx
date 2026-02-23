const benefits = [
  { icon: '💪', title: 'Personalized Programs', text: 'Every plan is built around your goals, experience level, and available time. No cookie-cutter routines.' },
  { icon: '🥗', title: 'Nutrition Guidance', text: 'Get simple, sustainable nutrition advice that fits your lifestyle and supports your training.' },
  { icon: '📊', title: 'Progress Tracking', text: 'Track workouts, measurements, and milestones so you always know where you stand.' },
]

export default function WhyChooseUs() {
  return (
    <section className="section why-choose-us" id="about" aria-labelledby="why-heading">
      <div className="container">
        <h2 id="why-heading" className="section-title">Why Choose Us</h2>
        <p className="section-subtitle">We focus on what works for you — not one-size-fits-all.</p>
        <div className="cards three-cards">
          {benefits.map(({ icon, title, text }) => (
            <article key={title} className="card">
              <div className="card-icon" aria-hidden="true">{icon}</div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
