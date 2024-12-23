import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Register from '../components/Register';
import Login from '../components/Login';
import TestimonialsSection from '../components/TestimonialsSection';
import FAQSection from '../components/FAQSection';
import Footer from '../components/Footer'
import './Home.css';

const Home = () => {
  const [roomId, setRoomId] = useState('');
  const [userName, setUserName] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

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

  const handleShowLogin = () => {
    setShowLogin(true);
    setShowRegister(false);
  };

  const handleShowRegister = () => {
    setShowRegister(true);
    setShowLogin(false);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);


  return (
    <div className="page-container">

      {/* Cursor Tracker */}
      <div
        className="cursor-tracker"
        style={{
          left: `${cursorPosition.x}px`,
          top: `${cursorPosition.y}px`,
        }}
      ></div>


      <div className="grid-background">
        <div className="grid-overlay"></div>
      </div>

      {/* Content Section */}
      <div className="content">
        {/* Hero Section */}
        <header className="hero">
          <h2 className="hero-title">
            <span className="synchro-highlight">Synchro</span>: Collaborate, Code and Create
          </h2>
          <p className="hero-subtitle">Real-time coding collaboration made simple.</p>
        </header>

        {/* Room Creation & Join Section */}
        <div className="form-container">
          <div className="form-group">
            <input
              className="input-field"
              type="text"
              placeholder="Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />
            <button className="generate-btn" onClick={generateRoomId}>
              Generate Room
            </button>
          </div>
          <div className="form-group">
            <input
              className="input-field"
              type="text"
              placeholder="Your Name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <button className="join-btn" onClick={handleJoinRoom}>
              Join Room
            </button>
          </div>
        </div>

        {/* Features Section */}
        <section className="features-section">
          <div className="feature-card">
            <h3>Real-Time Collaboration</h3>
            <p>Work on code together with your team instantly.</p>
          </div>
          <div className="feature-card">
            <h3>Multiple Languages</h3>
            <p>Support for JavaScript, Python, C++, and more.</p>
          </div>
          <div className="feature-card">
            <h3>Save and Share</h3>
            <p>Easily save and share your workspaces with others.</p>
          </div>
        </section>

        {/* New Section: Register or Login */}
        <section className="auth-prompt">
          <h2>Unlock Workspaces</h2>
          <p>To create and store your code in workspaces, register now. Already have an account? Log in to access your workspaces.</p>
          <div className="auth-buttons">
            <button className="auth-btn" onClick={handleShowRegister}>Register</button>
            <button className="auth-btn" onClick={handleShowLogin}>Login</button>
          </div>
        </section>

        {/* Conditional rendering of Login/Registration Form */}
        <section className="auth-forms">
          {showLogin && <Login />}
          {showRegister && <Register />}
        </section>

        <TestimonialsSection />
        <FAQSection />
        <Footer/>
      </div>
    </div>
  );
};

export default Home;
