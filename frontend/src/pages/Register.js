import React, { useState } from 'react';
import axios from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Footer from './Footer'; 
import styled from 'styled-components';

const StyledButton = styled.button`
  width: 150px;
  margin: 10px;
`;

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error message

    if (!username || !email || !password) {
      setError('All fields are required!');
      return;
    }

    try {
      await axios.post('/register', { username, email, password });
      navigate('/about'); // Redirect to About page after registration
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message);
      } else {
        setError('Error registering!');
      }
    }
  };

  return (
    <div className="home">
      <Helmet>
        <title>Content Craft-Register</title>
      </Helmet>
      <div className="container">
        <h1>Register</h1>
        <center>{error && <p style={{ color: 'red' }}>{error}</p>}</center>
        <form onSubmit={handleSubmit}>
          <center>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </center>
          <center><StyledButton>Register</StyledButton></center>
        </form>
        <center>
          <p>
            Already have an Account? <u><Link to="/login" className="text-link">Login Now!</Link></u>
          </p>
        </center> 
      </div>
      <Footer />
    </div>
  );
}

export default Register;
