import { useState, useEffect } from 'react'

const STORIES = [
  {
    id: 'sam',
    img: '/assets/sam-transformation.png',
    placeholder: 'https://picsum.photos/seed/sam-transform/400/300',
    alt: 'Before and after transformation of client Sam',
    rating: '⭐⭐⭐⭐⭐',
    title: "Sam's Transformation",
    meta: <> <strong>Goal:</strong> Fat loss &amp; body recomposition<br /><strong>Time:</strong> 14 weeks </>,
    quote: '"I wanted to lose fat but keep my curves and strength. The personalized workouts and simple nutrition plan made it sustainable. No extreme diets — just structure and consistency."',
    results: [
      <>✔ Decreased body fat by <strong>10%</strong></>,
      <>✔ Lost <strong>6 inches</strong> from her waist</>,
      <>✔ Improved strength &amp; endurance</>,
      <>✔ Increased overall confidence</>,
    ],
  },
  {
    id: 'peter',
    img: '/assets/peter-transformation.png',
    placeholder: 'https://picsum.photos/seed/peter-transform/400/300',
    alt: 'Before and after transformation of client Peter',
    rating: '⭐⭐⭐⭐⭐',
    title: "Peter's Transformation",
    meta: <> <strong>Goal:</strong> Build lean muscle &amp; improve physique<br /><strong>Time:</strong> 16 weeks </>,
    quote: '"I struggled to gain quality muscle without adding fat. Muscle gave me a structured training split and proper calorie targets. Tracking made everything clear and measurable."',
    results: [
      <>✔ Decreased body fat by <strong>9%</strong></>,
      <>✔ Increased muscle mass by <strong>4kg</strong></>,
      <>✔ Visible chest &amp; shoulder growth</>,
      <>✔ Strength levels significantly improved</>,
    ],
  },
]

export default function SuccessStories({ onStartPlan }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % STORIES.length)
    }, 2000)
    return () => clearInterval(t)
  }, [])

  return (
    <section className="section success-stories" id="success-stories" aria-labelledby="success-heading">
      <div className="container">
        <h2 id="success-heading" className="section-title">Success Stories</h2>
        <p className="section-subtitle">Real results. Real transformation. Real discipline.</p>

        <div className="story-carousel" aria-roledescription="carousel" aria-label="Success story slides">
          <div
            className="story-carousel-track"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {STORIES.map((story) => (
              <article key={story.id} className="story-card" aria-hidden={STORIES[index].id !== story.id}>
                <div className="story-media">
                  <img
                    src={story.img}
                    alt={story.alt}
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = story.placeholder
                    }}
                  />
                </div>
                <div className="story-content">
                  <div className="story-rating">{story.rating}</div>
                  <h3>{story.title}</h3>
                  <p className="story-meta">{story.meta}</p>
                  <p className="story-quote">{story.quote}</p>
                  <ul className="story-results">
                    {story.results.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
          <div className="story-carousel-dots" aria-hidden="true">
            {STORIES.map((_, i) => (
              <button
                key={i}
                type="button"
                className={'story-dot' + (i === index ? ' active' : '')}
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        <section className="story-why-it-works" aria-labelledby="why-it-works-heading">
          <h3 id="why-it-works-heading">Why It Works</h3>
          <p>Because every plan is:</p>
          <ul>
            <li>Built around your body</li>
            <li>Adjusted to your schedule</li>
            <li>Designed for sustainable progress</li>
            <li>Backed by real tracking</li>
          </ul>
          <p className="story-cta">
            You could be next. Your transformation starts today.{' '}
            <button type="button" className="btn btn-primary" onClick={() => onStartPlan && onStartPlan('Pro')}>
              Start Your Plan Now
            </button>{' '}
            <span className="story-discount">Use code <strong>FAKH</strong> for 30% OFF.</span>
          </p>
        </section>
      </div>
    </section>
  )
}
