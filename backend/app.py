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

import os
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from dotenv import load_dotenv
import openai
import traceback

# Load environment variables from .env
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

app = Flask(__name__)
# Apply CORS globally: This should add the header to all responses.
CORS(app, supports_credentials=True)

@app.route('/')
def index():
    return "Ready Refrigerator Backend is up and running!"

# Include 'OPTIONS' in methods to explicitly support preflight requests
@app.route('/generate-recipes', methods=['POST', 'OPTIONS'])
@cross_origin()  # Ensure CORS headers are included in this endpoint's responses
def generate_recipes():
    data = request.json
    print("Received data:", data)
    
    ingredients = data.get('ingredients', [])
    print("Parsed ingredients:", ingredients)
    
    if not ingredients:
        return jsonify({"error": "No ingredients provided"}), 400

    prompt = (
        f"Using these ingredients: {', '.join(ingredients)}, "
        "please provide a recipe that begins with a recipe title (as a Markdown heading) followed by an in-depth, creative recipe in the following format:\n\n"
        "1. Recipe Title: A single-line title (e.g., '# Lemon-Thyme Garlic Roasted Chicken').\n"
        "2. Ingredients: List all ingredients with measurements (if applicable).\n"
        "3. Cook Time and Difficulty: Provide total cook time and difficulty (e.g., Easy, Medium, Hard).\n"
        "4. Step-by-Step Instructions: Detailed steps for how to cook the dish.\n\n"
        "Ensure the response strictly follows this format."
    )
    print("Generated prompt:", prompt)

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful recipe assistant."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.7
        )
        print("OpenAI API response:", response)
        
        recipe_suggestions = response['choices'][0]['message']['content']
        return jsonify({"recipes": recipe_suggestions}), 200

    except Exception as e:
        error_message = traceback.format_exc()
        print("Exception occurred:", error_message)
        return jsonify({"error": str(e), "traceback": error_message}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
