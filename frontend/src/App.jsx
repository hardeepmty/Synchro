import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Room from './pages/Room';
import Login from './components/Login';
import Workspace from './components/Workspace';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:roomId" element={<Room />} />
        <Route path='/login' element={<Login/>}/>
        <Route path="/workspace/:roomId" element={<Workspace/>} />
      </Routes>
    </Router>
  );
}

export default App;