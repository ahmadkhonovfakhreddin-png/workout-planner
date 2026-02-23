const steps = [
  { num: 1, title: 'Tell Us About You', text: 'Share your goals, experience, schedule, and any limitations. Quick and easy.' },
  { num: 2, title: 'Get Your Custom Plan', text: 'Receive a tailored workout and nutrition plan designed just for you.' },
  { num: 3, title: 'Start Transforming', text: 'Follow your plan, track progress, and get support when you need it.' },
]

export default function HowItWorks() {
  return (
    <section className="section how-it-works" id="how-it-works" aria-labelledby="how-heading">
      <div className="container">
        <h2 id="how-heading" className="section-title">How It Works</h2>
        <p className="section-subtitle">Three simple steps to your custom plan.</p>
        <ol className="steps">
          {steps.map(({ num, title, text }) => (
            <li key={num} className="step">
              <span className="step-num" aria-hidden="true">{num}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
