import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userData, setUserData] = useState(localStorage.getItem('userData') || '');
  const [workspaces, setWorkspaces] = useState(
    JSON.parse(localStorage.getItem('workspaces')) || null
  );
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'https://synchr.zapto.org/api/user/login',
        { username, password },
        { withCredentials: true }
      );
      if (response.data.success) {
        setUserData(response.data.user.username);
        setWorkspaces(response.data.user.workspaces);
        
        localStorage.setItem('userData', response.data.user.username);
        localStorage.setItem('workspaces', JSON.stringify(response.data.user.workspaces));
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.log(error);
      setError('Failed to login');
    }
  };

  const handleWorkspaceClick = (roomId) => {
    navigate(`/workspace/${roomId}`);
  };

  const handleLogout = () => {
    setUserData('');
    setWorkspaces(null);
    localStorage.removeItem('userData');
    localStorage.removeItem('workspaces');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="login-title">Login to Synchro</h2>
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-field"
              placeholder="Enter your username"
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="login-btn">Login</button>
        </form>
        {error && <p className="error-message">{error}</p>}

        {userData && (
          <div className="user-dashboard">
            <h3 className="user-welcome">Welcome, {userData}!</h3>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
            <h4>Your Workspaces:</h4>
            <ul className="workspace-list">
              {workspaces.map((workspace, index) => (
                <li key={index} onClick={() => handleWorkspaceClick(workspace.roomId)} className="workspace-item">
                  {workspace.roomId}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
