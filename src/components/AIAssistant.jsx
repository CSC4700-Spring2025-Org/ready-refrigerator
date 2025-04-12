import React from 'react';
import './AIAssistant.css'; // Import the CSS file
import LogoRR from './LogoRR.svg'; // Adjust the path to your logo image

function AIAssistant() {
  return (
    <div>
      <div className="main-content">
        <div className="circle">
          <img src={LogoRR} alt="Ready Refrigerator Logo" className="logo" />
        </div>
        <h2>Hi there!</h2>
        <h3>Can I help you with anything?</h3>
        <p>Ready to help you create delicious meals with what you have in your fridge. Let's get cooking!</p>
        <div className="chat-box">
          <input type="text" placeholder="Ask Ready Refrigerator anything..." />
          <button>Send</button>
        </div>
      </div>
    </div>
  );
}

export default AIAssistant;
