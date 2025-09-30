import React from 'react'
import Navbar from '../components/Navbar'
import HeroCarousel from '../components/HeroCarousel'
import LayananKami from '../components/LayananKami'
import KegiatanKami from '../components/KegiatanKami'
import Footer from '../components/Footer'

function Homepage() {
  return (
    <>
        <Navbar />
        <HeroCarousel />
        <LayananKami />
        <KegiatanKami />
        <Footer />
    </>
  )
}

export default Homepage
