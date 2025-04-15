import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import openai
import traceback  # For detailed exception tracebacks

# Load environment variables from .env
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing

@app.route('/')
def index():
    return "Ready Refrigerator Backend is up and running!"

@app.route('/generate-recipes', methods=['POST'])
def generate_recipes():
    # Log incoming request data for debugging
    data = request.json
    print("Received data:", data)
    
    ingredients = data.get('ingredients', [])
    print("Parsed ingredients:", ingredients)
    
    if not ingredients:
        return jsonify({"error": "No ingredients provided"}), 400

    # Build the prompt for OpenAI including instructions to generate a recipe title first.
    prompt = (
        f"Using these ingredients: {', '.join(ingredients)}, "
        "please provide a recipe that begins with a recipe title followed by an in-depth, creative recipe in the following format:\n\n"
        "1. Recipe Title: Provide a single-line title for the dish (as a Markdown heading, e.g., '# Lemon-Thyme Garlic Roasted Chicken').\n"
        "2. Ingredients: List all ingredients along with their measurements (if applicable).\n"
        "3. Cook Time and Difficulty: Provide the total cook time and state the dish difficulty (e.g., Easy, Medium, Hard).\n"
        "4. Step-by-Step Instructions: Provide detailed, step-by-step instructions on how to cook the dish.\n\n"
        "Ensure that the response strictly follows this format."
    )
    print("Generated prompt:", prompt)

    try:
        # Make the OpenAI API call
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",  # Ensure this model is accessible; try switching if needed
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
        # Print and return the full traceback for debugging purposes
        error_message = traceback.format_exc()
        print("Exception occurred:", error_message)
        return jsonify({"error": str(e), "traceback": error_message}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
