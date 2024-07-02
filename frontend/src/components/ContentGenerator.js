import React, { useState } from 'react';
import axios from '../api/axios';
import { Helmet } from 'react-helmet';
import { FaHome, FaSignOutAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import '../styles.css';


function ContentGenerator() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [maxTokens, setMaxTokens] = useState(512);  // Default to 512
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    try {
      const response = await axios.post('/generate', { prompt, max_tokens: maxTokens });
      console.log('Response data:', response.data);
      setContent(response.data.content);
      setError('');
    } catch (error) {
      console.error('Error generating content', error);
      setError('Error generating content');
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
    <div>
      <Helmet>
        <title>ContentCraft - Content Generator</title>
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
      <h1>Content Generator</h1>
      <center>
      <textarea
        placeholder="Enter prompt in this format: Q: */Write your prompt/* A:"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows="10"
        cols="50"
      />
      <br/>
      <input
        type="number"
        placeholder="Max tokens"
        value={maxTokens}
        onChange={(e) => setMaxTokens(e.target.value)}
      /> &nbsp;
      <button onClick={handleGenerate}>Generate</button> </center>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <h2>Generated Content:</h2>
        <p>{content}</p>
      </div>
    </div>
    </div>
  );
}

export default ContentGenerator;
