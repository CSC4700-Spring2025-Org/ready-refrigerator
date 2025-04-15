import os
from flask import Flask, request, jsonify
from dotenv import load_dotenv
import openai

# Load environment variables from .env
load_dotenv()

# Set up OpenAI API key from the environment variable
openai.api_key = os.getenv("OPENAI_API_KEY")

app = Flask(__name__)

@app.route('/recipe', methods=['POST'])
def get_recipe():
    data = request.get_json()
    if not data or 'ingredients' not in data:
        return jsonify({'error': 'Please provide a list of ingredients.'}), 400

    ingredients = data['ingredients']
    # Construct the prompt for ChatGPT
    prompt = (
        f"I have the following ingredients: {ingredients}. "
        "Can you suggest a delicious recipe using these ingredients and provide detailed instructions?"
    )
    
    try:
        # Call the ChatGPT API with a system prompt for context
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful cooking assistant."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=300,
            temperature=0.7,
        )
        
        # Extract the recipe from the response
        recipe = response.choices[0].message['content'].strip()
        return jsonify({'recipe': recipe}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
