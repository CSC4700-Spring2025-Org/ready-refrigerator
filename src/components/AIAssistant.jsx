import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import './AIAssistant.css';
import LogoRR from './LogoRR.svg';

function AIAssistant() {
  const [inputValue, setInputValue] = useState("");
  const [recipeResponse, setRecipeResponse] = useState("");
  const [useDietaryRestrictions, setUseDietaryRestrictions] = useState(false);
  const [useMacroEfficient, setUseMacroEfficient] = useState(false);

  const handleSend = async () => {
    const ingredientsArray = inputValue
      .split(",")
      .map(item => item.trim())
      .filter(item => item.length > 0);

    try {
      const response = await fetch("http://127.0.0.1:5000/generate-recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ingredients: ingredientsArray,
          dietary: useDietaryRestrictions,
          macroEfficient: useMacroEfficient
        })
      });
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      const data = await response.json();
      let cleanedRecipe = data.recipes.trim().replace(/\n\s*\n+/g, "\n\n");
      setRecipeResponse(cleanedRecipe);
    } catch (error) {
      console.error("Error calling backend:", error);
    }
  };

  return (
    <div className="main-content">
      <div className="circle">
        <img src={LogoRR} alt="Ready Refrigerator Logo" className="logo" />
      </div>
      <h2>Hi there!</h2>
      <h3>Can I help you with anything?</h3>
      <p>
        Ready to help you create delicious meals with what you have in your fridge.
        Let's get cooking!
      </p>
      <div className="chat-box">
        <input
          type="text"
          placeholder="E.g. chicken, rice, broccoli..."
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
        />
        <button onClick={handleSend}>Send</button>
      </div>

      {/* Toggle Switches */}
      <div className="toggle-options">
        <div>
          <input
            type="checkbox"
            id="dietary"
            checked={useDietaryRestrictions}
            onChange={() => setUseDietaryRestrictions(!useDietaryRestrictions)}
          />
          <label htmlFor="dietary">Dietary Restrictions</label>
        </div>
        <div>
          <input
            type="checkbox"
            id="macroEfficient"
            checked={useMacroEfficient}
            onChange={() => setUseMacroEfficient(!useMacroEfficient)}
          />
          <label htmlFor="macroEfficient">Macro Efficient</label>
        </div>
      </div>


      {recipeResponse && (
        <div className="chat-bubble">
          <div className="recipe-text">
            <ReactMarkdown>{recipeResponse}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}

export default AIAssistant;
