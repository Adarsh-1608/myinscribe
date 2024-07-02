import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Footer from './Footer'; 
import styled from 'styled-components';

const StyledButton = styled.button`
  width: 150px;
  margin: 10px;
`;

function About() {
  return (
    <div className="home">
      <div className="container">
      <Helmet>
        <title>Content Craft - About</title>
      </Helmet>
      <h1>Welcome to ContentCraft!</h1>
      <div>
        <Link to="/login">
        <center><StyledButton>Login</StyledButton></center>
        </Link>
        <Link to="/register"><br/>
        <center><StyledButton>Register</StyledButton></center>
        </Link>
      </div>
      </div>
      <Footer /> 
    </div>
  );
}

export default About;
