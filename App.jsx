import React, { useState, useRef } from "react";

function App() {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef();

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      generateImage();
    }
  };

  const generateImage = async () => {
    const prompt = inputRef.current.value.trim();
    if (!prompt) {
      setError("Please enter a prompt");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://clipdrop-api.co/text-to-image/v1", {
        method: "POST",
        headers: {
          "x-api-key":
            "a6f1ee113b39793465e83d3c5a561e4689494cfa306168804671645d5826e8119c39e497230904b13c4204661e98d078",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to load image");
      }

      const imageBlob = await response.blob();
      const imageObjectUrl = URL.createObjectURL(imageBlob);
      setImageUrl(imageObjectUrl);
    } catch (e) {
      console.log("Generation error", e);
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Welcome to AI Image Generator</h1>
      <p>Create stunning images using ClipDrop API</p>

      <input
        type="text"
        ref={inputRef}
        placeholder="e.g., a futuristic city in space"
        onKeyDown={handleKeyDown}
        style={{ padding: "10px", width: "300px" }}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Loading image...</p>}
      {imageUrl && <img src={imageUrl} alt="Generated" style={{ marginTop: "20px", maxWidth: "100%" }} />}
    </div>
  );
}

export default App;
