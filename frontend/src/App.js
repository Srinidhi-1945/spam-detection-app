// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import NumberCheck from './NumberCheck';
import Report from './Report';
import Leaderboard from './Leaderboard';
import BlockSpam from './BlockSpam';
import './App.css';

const isAuthenticated = () => localStorage.getItem('token');

const ProtectedRoute = ({ element }) => (
  isAuthenticated() ? element : <Navigate to="/" />
);

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
          <Route path="/check" element={<ProtectedRoute element={<NumberCheck />} />} />
          <Route path="/report" element={<ProtectedRoute element={<Report />} />} />
          <Route path="/leaderboard" element={<ProtectedRoute element={<Leaderboard />} />} />
          <Route path="/blockspam" element={<ProtectedRoute element={<BlockSpam />} />} />
          <Route path="*" element={<h2>Page Not Found</h2>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
