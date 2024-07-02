// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import ContentGenerator from './components/ContentGenerator';
import Optimizer from './components/Optimizer';
import WorkflowManager from './components/WorkflowManager';
import Analyze from './components/Analyze'; // Import Analyze component

function ProtectedRoute({ element, ...rest }) {
  const token = useSelector((state) => state.user.token);
  return token ? element : <Login />;
}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<ProtectedRoute element={<About />} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/generate" element={<ProtectedRoute element={<ContentGenerator />} />} />
          <Route path="/optimize" element={<ProtectedRoute element={<Optimizer />} />} />
          <Route path="/workflow" element={<ProtectedRoute element={<WorkflowManager />} />} />
          <Route path="/analyze" element={<ProtectedRoute element={<Analyze />} />} /> {/* Add Analyze route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
