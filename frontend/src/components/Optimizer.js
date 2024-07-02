import React, { useState } from 'react';
import axios from '../api/axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaSignOutAlt } from 'react-icons/fa';
import '../styles.css';
import { Helmet } from 'react-helmet';

function Optimizer() {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [results, setResults] = useState({
    optimized_content: '',
    readability_score: '',
    keyword_analysis: {},
    grammar_correction: []
  });
  const [error, setError] = useState('');

  const handleOptimize = async () => {
    try {
      const response = await axios.post('/optimize', { text });
      setResults(response.data);
    } catch (error) {
      console.error('Error optimizing content', error);
      setError('Error optimizing content');
    }
  };
  const openNav = () => {
    document.getElementById("mySidenav").style.width = "250px";
  };

  const closeNav = () => {
    document.getElementById("mySidenav").style.width = "0";
  };

  const handleLogout = () => {
    // Remove the token from localStorage (or wherever it is stored)
    localStorage.removeItem('access_token');
    // Redirect to login page
    navigate('/');
  };

  


  return (
    <div className="homepage1">
      <Helmet>
        <title>Content Craft-Optimizer</title>
      </Helmet>
      
      <div id="mySidenav" className="sidenav">
        <a href="javascript:void(0)" className="closebtn" onClick={closeNav}>&times;</a>
        <ul>
        <li><Link to="/about"><FaHome style={{ marginRight: '8px' }} />Home</Link></li>
        <br/>
        <li><Link to="/generate">Content Generation</Link></li>
        <br/>
        <li><Link to="/optimize">Content Optimization</Link></li>
        <br/>
        <li><Link to="/workflow">Content Workflow</Link></li>
        <br />
          <li><a href="#" onClick={handleLogout}><FaSignOutAlt style={{ marginRight: '8px' }} />Logout</a></li>
        </ul>
      
      </div>
      <span style={{ fontSize: "30px", cursor: "pointer", marginLeft: "20px", marginTop: "10px"}} onClick={openNav}>&#9776;</span>
      <div className="optimize">
      <center><h1>Content Optimization</h1>
      <textarea
        rows="15"
        cols="50"
        placeholder="Enter text to optimize"
        value={text}
        onChange={(e) => setText(e.target.value)}
      /><br/>
      <button onClick={handleOptimize}>Optimize</button></center>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <h3>Optimized Content:</h3>
        <p>{results.optimized_content}</p>
        <h3>Readability Score:</h3>
        <p>{results.readability_score}</p>
        <h3>Keyword Density Analysis:</h3>
        <ul>
          {Object.entries(results.keyword_analysis).map(([word, density]) => (
            <li key={word}>{word}: {density.toFixed(2)}%</li>
          ))}
        </ul>
        <h3>Grammar and Spelling Correction:</h3>
        <ul>
          {results.grammar_correction.map((correction, index) => (
            <li key={index}>
              {correction.message}: {correction.corrections.join(', ')}
            </li>
          ))}
        </ul>
        </div>
        
      </div>
    </div>
  );
}

export default Optimizer;
