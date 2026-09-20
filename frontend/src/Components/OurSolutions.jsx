import React from 'react'
import "../CSS/OurSolutions.css"

const OurSolutions = () => {
  return (
   
    <div>
        <div className='container my-5'>

            <h2 className="text-center mb-4">Our Solutions</h2>

            <div className='row'>

                  <div className="col-md-3">
                     <div className="card solution-card h-100">
                        <div className="card-body text-center">
                           <h4>Expert Advice</h4>
                          <p>Get guidance from agriculture experts for better farming.</p>
                        </div>
                     </div>
                  </div>


                  <div className="col-md-3">
                     <div className="card solution-card h-100">
                        <div className="card-body text-center">
                           <h4>Weather Update</h4>
                          <p>Stay updated with weather conditions for your crops.</p>
                        </div>
                     </div>
                  </div>


               <div className="col-md-3">
                     <div className="card solution-card h-100">
                        <div className="card-body text-center">
                           <h4>Crop Information</h4>
                          <p> Get useful information about crops, diseases and care.</p>
                        </div>
                     </div>
                  </div>

           
                  <div className="col-md-3">
                     <div className="card solution-card h-100">
                        <div className="card-body text-center">
                           <h4>Farming Products</h4>
                          <p>Find quality products and agricultural essentials.</p>
                        </div>
                     </div>
                  </div>


            </div>
        </div>
    </div>
    
  )
}

export default OurSolutions