import React, { useState } from 'react';
import axios from '../api/axios';
import { useDispatch } from 'react-redux';
import { setUser, setToken } from '../redux/slices/userSlice';
import { useNavigate, Link } from 'react-router-dom';
import '../styles.css';
import Footer from './Footer'; 
import { Helmet } from 'react-helmet';
import styled from 'styled-components';

const StyledButton = styled.button`
  width: 150px;
  margin: 10px;
`;

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/login', { email, password });
      dispatch(setUser(response.data.user));
      dispatch(setToken(response.data.access_token));
      localStorage.setItem('token', response.data.access_token);
      navigate('/about'); // Redirect to About page after login
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Error logging in');
      console.error('Error logging in', error);
    }
  };

  return (
    <div className="home">
      <Helmet>
        <title>Content Craft-Login</title>
      </Helmet>
      <div className="container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <center><input
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
        <center><StyledButton>Login</StyledButton></center>
      </form>
      <center>{errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}</center>
      <center><p>Don't have an Account? <u><Link to="/register" className="text-link">Register Now</Link></u></p></center> 
      </div>
      <Footer />
    </div>
  );
}

export default Login;
