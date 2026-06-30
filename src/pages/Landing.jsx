import React from 'react'
import Hero from '../components/Hero'
import HowItWorks from '../components/landing/HowItWorks'
import CategoriesSection from '../components/landing/CategoriesSection'
import TrendingTemplates from '../components/landing/TrendingTemplates'
import ChallengeOfDay from '../components/landing/ChallengeOfDay'
import BeforeAfter from '../components/landing/BeforeAfter'
import Showcase from '../components/landing/Showcase'
import Testimonials from '../components/landing/Testimonials'
import Pricing from '../components/landing/Pricing'
import FAQ from '../components/landing/FAQ'

export default function Landing(){
  return (
    <div className="pt-24">
      <Hero />
      <HowItWorks />
      <CategoriesSection />
      <TrendingTemplates />
      <ChallengeOfDay />
      <BeforeAfter />
      <Showcase />
      <Pricing />
      <FAQ />
    </div>
  )
}
