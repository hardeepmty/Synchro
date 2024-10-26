import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [roomId, setRoomId] = useState('');
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  // Function to generate a random room ID
  const generateRoomId = () => {
    const newRoomId = Math.random().toString(36).substring(2, 10); // Generates an 8-character random ID
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
    <div>
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
    </div>
  );
};

export default Home;
