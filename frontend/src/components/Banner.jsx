import React from 'react'
import './Banner.css';

import banner1 from '../assets/images/banner1.jpg';
import banner2 from '../assets/images/banner2.jpg';
import banner3 from '../assets/images/banner3.jpg';

const Banner = () => {
  return (
    <div>
        <div id='demo' className='carousel slide' data-bs-ride="carousel">

            <div className='carousel-indicators'>
                  <button type="button" data-bs-target="#demo" data-bs-slide-to="0" className="active"></button>
                  <button type="button" data-bs-target="#demo" data-bs-slide-to="1"></button>
                  <button type="button" data-bs-target="#demo" data-bs-slide-to="2"></button>
            </div>

            <div className='carousel-inner'>
                <div className='carousel-item active'> 
                    <img src={banner1} alt="" className='d-block w-100'   style={{ height: "600px", objectFit: "cover" }} />
                    <div className="carousel-caption">
                      <h2>Smart Farming Solutions</h2>
                      <p>Get the right guidance for better crops and better yields.</p>

                      <a href="tel:+919XXXXXXXXX" className="btn btn-success">Call Us</a>
                    </div>
                </div>

                 <div className='carousel-item'> 
                    <img src={banner2} alt="" className='d-block w-100'   style={{ height: "600px", objectFit: "cover" }} />

                     <div className="carousel-caption">
                     <h2>Identify Crop Problems</h2>
                     <p>Scan your crops and get useful information about diseases.</p>
                     </div>
                </div>

                 <div className='carousel-item'> 
                    <img src={banner3} alt="" className='d-block w-100'    style={{ height: "600px", objectFit: "cover" }}/>
                     <div className="carousel-caption">
                     <h2>Quality Products for Your Farm</h2>
                     <p>Find the products you need for healthy and productive crops.</p>
                    </div>
                </div>

            </div>

               <button className="carousel-control-prev" type="button" data-bs-target="#demo" data-bs-slide="prev">
               <span className="carousel-control-prev-icon"></span>
               </button>

               <button className="carousel-control-next" type="button" data-bs-target="#demo" data-bs-slide="next">
                <span className="carousel-control-next-icon"></span>
                </button>
        </div>
    </div>
  )
}

export default Banner