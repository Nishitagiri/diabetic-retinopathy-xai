from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.route("/")
def home():
    return jsonify({
        "message": "Diabetic Retinopathy XAI API is running"
    })


@app.route("/predict", methods=["POST"])
def predict():

    if "image" not in request.files:
        return jsonify({
            "error": "No image uploaded"
        }), 400

    image = request.files["image"]

    if image.filename == "":
        return jsonify({
            "error": "No image selected"
        }), 400

    filepath = os.path.join(UPLOAD_FOLDER, image.filename)
    image.save(filepath)

    # Temporary prediction.
    # We will replace this with your actual ML model later.
    return jsonify({
        "prediction": "Moderate DR",
        "confidence": 0.87,
        "risk": "High"
    })


if __name__ == "__main__":
    app.run(debug=True, port=5000)