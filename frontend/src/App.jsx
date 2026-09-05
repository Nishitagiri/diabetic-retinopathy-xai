
import { useState } from "react";
import "./App.css";

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
      setError("");
    }
  };

  const analyzeImage = async () => {
    if (!image) {
      setError("Please select a retinal image first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/predict",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Prediction failed.");
      }

      console.log("Flask response:", data);
      setResult(data);
    } catch (err) {
      console.error("Error:", err);
      setError(
        "Unable to connect to the Flask server. Make sure Flask is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <h1>RETINEX</h1>
        <p>Explainable AI for Diabetic Retinopathy Screening</p>
      </header>

      <main className="container">

        {/* Upload Section */}
        <section className="upload-card">
          <h2>Upload Retinal Image</h2>

          <p>
            Upload a retinal fundus photograph for automated
            diabetic retinopathy screening.
          </p>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />

          {/* Image Preview */}
          {preview && (
            <div className="preview">
              <img
                src={preview}
                alt="Retinal fundus preview"
              />
            </div>
          )}

          {/* Selected File */}
          {image && (
            <p className="filename">
              Selected: <strong>{image.name}</strong>
            </p>
          )}

          {/* Analyze Button */}
          <button
            onClick={analyzeImage}
            disabled={!image || loading}
          >
            {loading ? "Analyzing..." : "Analyze Image"}
          </button>

          {/* Error */}
          {error && (
            <p className="error">
              {error}
            </p>
          )}
        </section>

        {/* Results */}
        <section className="results-grid">

          {/* Image Quality */}
          <div className="card">
            <h2>Image Quality</h2>

            {result ? (
              <>
                <p>
                  Status: <strong>Good</strong>
                </p>
                <p>Brightness: --</p>
                <p>Contrast: --</p>
                <p>Blur: --</p>
              </>
            ) : (
              <>
                <p>
                  Status: <strong>Waiting</strong>
                </p>
                <p>Brightness: --</p>
                <p>Contrast: --</p>
                <p>Blur: --</p>
              </>
            )}
          </div>

          {/* Processing */}
          <div className="card">
            <h2>Processing</h2>

            <p>✓ Image Upload</p>
            <p>○ Preprocessing</p>
            <p>○ Lesion Detection</p>
            <p>○ Feature Extraction</p>
            <p>○ ML Prediction</p>
          </div>

          {/* DR Result */}
          <div className="card result-card">
            <h2>DR Screening Result</h2>

            {result ? (
              <>
                <h3>{result.prediction}</h3>

                <p>
                  Confidence:{" "}
                  <strong>
                    {(result.confidence * 100).toFixed(1)}%
                  </strong>
                </p>

                <p>
                  Risk Level:{" "}
                  <strong>{result.risk}</strong>
                </p>
              </>
            ) : (
              <p className="waiting">
                Waiting for analysis...
              </p>
            )}
          </div>

          {/* Detected Features */}
          <div className="card">
            <h2>Detected Features</h2>

            <p>Microaneurysms: --</p>
            <p>Exudates: --</p>
            <p>Hemorrhages: --</p>
            <p>Vessel Density: --</p>
            <p>Vessel Tortuosity: --</p>
          </div>

          {/* Explanation */}
          <div className="card explanation">
            <h2>Why This Result?</h2>

            {result ? (
              <div>
                <p>
                  The model analyzed the uploaded retinal image
                  and generated the following screening result:
                </p>

                <ul>
                  <li>
                    Predicted Grade:{" "}
                    <strong>{result.prediction}</strong>
                  </li>

                  <li>
                    Confidence:{" "}
                    <strong>
                      {(result.confidence * 100).toFixed(1)}%
                    </strong>
                  </li>

                  <li>
                    Risk Level:{" "}
                    <strong>{result.risk}</strong>
                  </li>
                </ul>

                <p>
                  Detailed feature-based explanations will be
                  displayed here after the actual ML model and
                  feature extraction pipeline are connected.
                </p>
              </div>
            ) : (
              <p>
                The explanation will show which retinal features
                contributed to the predicted diabetic retinopathy
                grade.
              </p>
            )}
          </div>

        </section>
      </main>
    </div>
  );
}

export default App;

