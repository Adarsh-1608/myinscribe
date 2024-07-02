import React from 'react';
import '../styles.css'; // Assuming your CSS is in this file

function Footer() {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} MyInscribe Digital Private Limited. All rights reserved.</p>
    </footer>
  );
}

export default Footer;