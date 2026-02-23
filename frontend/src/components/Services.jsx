import { useState, useEffect } from 'react'

const API_BASE = '/api'

export default function Services() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(API_BASE + '/services/')
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => { setServices(data); setLoading(false) })
      .catch(() => {
        setServices([
          { id: 1, title: 'Personalized Workouts', description: 'Custom routines for strength, conditioning, or both.', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80' },
          { id: 2, title: 'Digital Tools', description: 'Access your plan and log workouts from any device.', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80' },
          { id: 3, title: 'Nutrition Plans', description: 'Practical meal guidance that supports recovery.', image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80' },
          { id: 4, title: 'Progress Tracking', description: 'Log sets, reps, and measurements.', image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&q=80' },
        ])
        setLoading(false)
      })
  }, [])

  if (loading) return <section className='section' id='services'><div className='container'><p>Loading...</p></div></section>

  return (
    <section className='section services-overview' id='services' aria-labelledby='services-heading'>
      <div className='container'>
        <h2 id='services-heading' className='section-title'>What You Get</h2>
        <p className='section-subtitle'>Everything you need to reach your fitness goals.</p>
        <div className='cards four-cards'>
          {services.map(({ id, title, description, image }) => (
            <article key={id} className='card card-image'>
              <div className='card-img' style={{ backgroundImage: image ? `url(${image})` : undefined }}></div>
              <div className='card-body'>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
