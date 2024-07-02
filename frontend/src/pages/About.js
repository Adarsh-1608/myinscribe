import React from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaSignOutAlt } from 'react-icons/fa';
import '../styles.css';
import Footer from './Footer'; 

function HomePage() {
  const navigate = useNavigate();

  // JavaScript functions for sidebar navigation
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
    <div className="homepage">
      <Helmet>
        <title>Content Craft - Home</title>
      </Helmet>
      <div id="mySidenav" className="sidenav">
        <a href="javascript:void(0)" className="closebtn" onClick={closeNav}>&times;</a>
        <ul>
          <li><Link to="/about"><FaHome style={{ marginRight: '8px' }} />Home</Link></li>
          <br />
          <li><Link to="/generate">Content Generation</Link></li>
          <br />
          <li><Link to="/optimize">Content Optimization</Link></li>
          <br />
          <li><Link to="/workflow">Content Workflow</Link></li>
          <br />
          <li><a href="#" onClick={handleLogout}><FaSignOutAlt style={{ marginRight: '8px' }} />Logout</a></li>
        </ul>
      </div>
      <span
        style={{
          fontSize: "30px",
          cursor: "pointer",
          marginLeft: "20px",
          marginTop: "10px"
        }}
        onClick={openNav}
      >
        &#9776;
      </span>
      <div className="optimize">
        <h1 class="heading">Welcome To Content Craft!</h1>
        <p class="content">At <i>MyInscribe Digital Private Limited</i>, we are transforming the content creation landscape with our cutting-edge AI-Based Content Workflow Automation system. 
        ContentCraft is designed to streamline and automate every step of your content creation process, ensuring that writers, editors, and content managers can work more efficiently and productively.
        <br/> <br/>
        From generating engaging content to optimizing readability, keyword analysis, and grammar correction, ContentCraft has it all!
        <br/> <br/>
        Experience the future of content creation with ContentCraft. Say goodbye to tedious manual tasks and hello to a more efficient, productive, and innovative way of working. Join us in revolutionizing the way content is created and managed, and take your content to the next level with AI-driven automation.
        </p>
    </div>
    <Footer /> {/* Add Footer component */}
    </div>
  );
}

export default HomePage;
