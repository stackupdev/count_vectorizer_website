import os
from flask import Flask, render_template, request, jsonify
import joblib

app = Flask(__name__)

# Load the vectorizer and model
VECTORIZER_PATH = os.path.join(os.path.dirname(__file__), 'spam_vectorizer.joblib')
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'spam_classifier_model.joblib')

vectorizer = joblib.load(VECTORIZER_PATH)
model = joblib.load(MODEL_PATH)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    message = data.get('message', '')
    vect = vectorizer.transform([message])
    prediction = model.predict(vect)[0]
    proba = model.predict_proba(vect)[0]
    return jsonify({
        'prediction': 'Spam' if prediction == 1 else 'Not Spam',
        'probability': float(max(proba))
    })

if __name__ == '__main__':
    app.run(debug=True)
