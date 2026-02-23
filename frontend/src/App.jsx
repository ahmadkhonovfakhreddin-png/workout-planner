import Header from './components/Header'
import Hero from './components/Hero'
import WhyChooseUs from './components/WhyChooseUs'
import HowItWorks from './components/HowItWorks'
import Services from './components/Services'
import CTA from './components/CTA'
import Footer from './components/Footer'

function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <WhyChooseUs />
        <HowItWorks />
        <Services />
        <CTA />
      </main>
      <Footer />
    </>
  )
}

export default App
