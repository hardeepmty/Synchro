import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
        'http://localhost:5000/api/user/login',
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
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <label>Username</label>
        <input
          type='text'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label>Password</label>
        <input
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type='submit'>Login</button>
      </form>
      {error && <p>{error}</p>}

      {userData && (
        <div>
          <h3>Welcome, {userData}!</h3>
          <button onClick={handleLogout}>Logout</button>
          <h4>Your Workspaces:</h4>
          <ul>
            {workspaces.map((workspace, index) => (
              <li key={index} onClick={() => handleWorkspaceClick(workspace.roomId)}>
                {workspace.roomId}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Login;
