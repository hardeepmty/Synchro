import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Register from '../components/Register';
import Login from '../components/Login';
import './Home.css'; // Make sure to create this CSS file

const Home = () => {
  const [roomId, setRoomId] = useState('');
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  const generateRoomId = () => {
    const newRoomId = Math.random().toString(36).substring(2, 10);
    setRoomId(newRoomId);
  };

  const handleJoinRoom = () => {
    if (roomId && userName) {
      navigate(`/room/${roomId}`, { state: { userName } });
    } else {
      alert('Please enter both Room ID and Your Name');
    }
  };

  return (
    <div className="page-container">
      <div className="grid-background">
        <div className="grid-overlay"></div>
      </div>
      
      {/* Your original content */}
      <div className="content">
        <h1>Welcome to Code Collaboration</h1>
        <input
          type="text"
          placeholder="Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <button onClick={generateRoomId}>Generate Room</button>
        <input
          type="text"
          placeholder="Your Name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <button onClick={handleJoinRoom}>Create/Join Room</button>
        <div className='auth-page' style={{display:"flex", gap:"20px"}}>
        <Register/>
        <Login/>
        </div>
      </div>
    </div>
  );
};

export default Home;