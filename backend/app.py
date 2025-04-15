import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import openai

# Load environment variables from .env
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing for React

@app.route('/')
def index():
    return "Ready Refrigerator Backend is up and running!"

@app.route('/generate-recipes', methods=['POST'])
def generate_recipes():
    """
    Expects a JSON body like:
    {
      "ingredients": ["chicken", "rice", "broccoli"]
    }
    """
    data = request.json
    ingredients = data.get('ingredients', [])
    
    if not ingredients:
        return jsonify({"error": "No ingredients provided"}), 400

    # Build a prompt that instructs for the output format
    prompt = (
        f"Using these ingredients: {', '.join(ingredients)}, "
        "please provide one in-depth, creative recipe in the following format:\n\n"
        "1. Ingredients: List all ingredients along with their measurements (if applicable).\n"
        "2. Cook Time and Difficulty: Provide the total cook time and state the dish difficulty (e.g., Easy, Medium, Hard).\n"
        "3. Step-by-Step Instructions: Provide detailed, step-by-step instructions on how to cook the dish.\n\n"
        "Ensure the response strictly follows this format."
    )

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",  # Cost-effective model with focused output
            messages=[
                {"role": "system", "content": "You are a helpful recipe assistant."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7
        )
        # Extract the text from the response
        recipe_suggestions = response['choices'][0]['message']['content']
        return jsonify({"recipes": recipe_suggestions}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Start the Flask development server
    app.run(debug=True, port=5000)
