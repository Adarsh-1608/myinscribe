import React, { useState } from 'react';
import axios from '../api/axios';

function Analyze() {
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState([]);

  const handleAnalyze = async () => {
    try {
      const response = await axios.post('/analyze', { text });
      setAnalysis(response.data.analysis.entities || []);
    } catch (error) {
      console.error('Error analyzing content', error);
    }
  };

  return (
    <div>
      <h2>Text Analyzer</h2>
      <textarea
        placeholder="Enter text to analyze"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows="10"
        cols="50"
      />
      <button onClick={handleAnalyze}>Analyze</button>
      <div>
        <h3>Analysis Results</h3>
        {analysis.length > 0 ? (
          <ul>
            {analysis.map((entity, index) => (
              <li key={index}>
                {entity[0]} ({entity[1]})
              </li>
            ))}
          </ul>
        ) : (
          <p>No entities found or analysis is not in the expected format.</p>
        )}
      </div>
    </div>
  );
}

export default Analyze;
