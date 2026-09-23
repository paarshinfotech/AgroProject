import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import "../CSS/Feedback.css"

function Feedback() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [mobile, setMobile] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // validation
    if (!mobile || !message || rating === 0) {
      alert('Please fill all fields and provide a rating!');
      return;
    }

    

    setSubmitted(true); // Success Screen दाखवण्यासाठी
  };

  return (
    <section className="feedback-section">
      <div className="feedback-card">
        {submitted ? (
          <div className="success-message">
            <h3 className="feedback-title" style={{ color: '#00A59E' }}>Thank You! 🎉</h3>
            <p className="feedback-subtitle">Your feedback has been submitted successfully.</p>
            <button className="feedback-btn" onClick={() => setSubmitted(false)}>
              Send Another Response
            </button>
          </div>
        ) : (
          <>
            <h3 className="feedback-title">Share Your Feedback</h3>
            <p className="feedback-subtitle">
              Help us improve AgroProject to serve you better.
            </p>

            <form onSubmit={handleSubmit} className="feedback-form">
              {/* Star Rating */}
              <div className="star-rating">
                {[...Array(5)].map((_, index) => {
                  const ratingValue = index + 1;
                  return (
                    <button
                      type="button"
                      key={ratingValue}
                      className={ratingValue <= (hover || rating) ? 'star active' : 'star'}
                      onClick={() => setRating(ratingValue)}
                      onMouseEnter={() => setHover(ratingValue)}
                      onMouseLeave={() => setHover(rating)}
                    >
                      <FaStar />
                    </button>
                  );
                })}
              </div>

              {/* Contact Input */}
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Your Mobile Number"
                  className="feedback-input"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
              </div>

              {/* Feedback Text Area */}
              <div className="input-group">
                <textarea
                  rows="4"
                  placeholder="Write your suggestions or feedback here..."
                  className="feedback-textarea"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
              </div>

              {/* Submit Button */}
              <button type="submit" className="feedback-btn">
                Submit Feedback
              </button>
            </form>
          </>
        )}
      </div>
    </section>
  );
}

export default Feedback;