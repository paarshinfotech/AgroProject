import React from 'react'
import Banner from '../components/Banner'
import OurSolutions from '../components/OurSolutions'
import Navbar from '../components/Navbar'
import HowWeWork from '../components/HowWeWork'
import Footer from '../components/Footer'
import WhatWeProvide from '../components/WhatWeProvide'
import Feedback from '../components/Feedback'

const Home = () => {
  return (
    <div>
      <Navbar/>
        <Banner/>
        <OurSolutions/>
        <HowWeWork/>
        <WhatWeProvide/>
        <Feedback/>
        <Footer/>
    </div>
  )
}

export default Home