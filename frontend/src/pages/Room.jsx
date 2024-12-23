import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import AceEditor from 'react-ace';
import axios from 'axios'; 
import VideoCall from '../components/VideoCall';
import './Room.css';

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-markdown';

import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-twilight';
import 'ace-builds/src-noconflict/theme-solarized_dark';
import 'ace-builds/src-noconflict/theme-solarized_light';
import 'ace-builds/src-noconflict/theme-dracula';
import 'ace-builds/src-noconflict/theme-chaos';

const Room = () => {
  const { roomId } = useParams();
  const location = useLocation();
  const userName = location.state?.userName;

  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [code, setCode] = useState('// Write your code here...');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [theme, setTheme] = useState('monokai');
  const [projectDescription, setProjectDescription] = useState('');
  const [aiGeneratedCode, setAIGeneratedCode] = useState('');
  const [readOnly, setReadOnly] = useState(true);
  const [feedback, setFeedback] = useState('');
  const [typingUsers, setTypingUsers] = useState([]); 
  const [cursors, setCursors] = useState([]); // State for collaborators' cursors

  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.emit('joinRoom', roomId);

    newSocket.on('receiveMessage', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    newSocket.on('codeUpdate', (data) => {
      if (data.user !== userName) {
        setCode(data.code);
        setTypingUsers((prevTypingUsers) => [...prevTypingUsers, data.user]); 
        const timer = setTimeout(() => {
          setTypingUsers((prevTypingUsers) =>
            prevTypingUsers.filter((user) => user !== data.user)
          ); 
        }, 2000);
        return () => clearTimeout(timer);
      }
    });

    newSocket.on('languageUpdate', (data) => {
      if (data.user !== userName) {
        setLanguage(data.language);
      }
    });

    newSocket.on('codeOutput', (data) => {
      setOutput(data.output);
    });

    newSocket.on('cursorUpdate', (data) => {
      if (data.roomId === roomId) {
        setCursors((prevCursors) => {
          const existingCursorIndex = prevCursors.findIndex(
            (cursor) => cursor.user === data.user
          );
          if (existingCursorIndex === -1) {
            return [...prevCursors, data];
          } else {
            const updatedCursors = [...prevCursors];
            updatedCursors[existingCursorIndex] = data;
            return updatedCursors;
          }
        });
      }
    });

    return () => newSocket.close();
  }, [roomId, userName]);

  const sendMessage = () => {
    if (socket && message) {
      socket.emit('sendMessage', { roomId, user: userName, message });
      setMessage('');
    }
  };

  const updateCode = (newCode) => {
    setCode(newCode);
    if (socket) {
      socket.emit('codeUpdate', { roomId, user: userName, code: newCode });
    }
  };

  const updateLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    if (socket) {
      socket.emit('languageUpdate', { roomId, user: userName, language: newLanguage });
    }
  };

  const runCode = () => {
    if (socket) {
      socket.emit('runCode', { roomId, language, code });
    }
  };

  const downloadCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `code.${language === 'cpp' ? 'cpp' : language}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const addToWorkspace = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/workspace/newWorkSpace',
        { roomId, code, language },
        {
          withCredentials: true
        }
      );
      setFeedback(response.data.message);
    } catch (error) {
      setFeedback('Failed to save workspace');
      console.error('Error saving workspace:', error);
    }
  };

  const handleCursorMove = (e) => {
    const cursorPosition = {
      user: userName,
      roomId,
      position: { x: e.clientX, y: e.clientY },
    };
    socket.emit('cursorUpdate', cursorPosition);
  };

  return (
    <div className="room-container" style={{fontFamily:"Montserrat"}}>
      <div className="room-header">
        <h2>Room: {roomId}</h2>
        <h3>Welcome, {userName}</h3>
      </div>



      <div className="workspace">
        <div className="chat-section">
          <h3>Chat Messages</h3>
          <div className="chat-container">
            {messages.map((msg, index) => (
              <div key={index} className="chat-message">
                <strong>{msg.user}:</strong> {msg.message}
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              placeholder="Type a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button className="btn" onClick={sendMessage}>Send</button>
          </div>

          {typingUsers.length >= 0 && (
        <div className="typing-indicator">
          <p>
            {typingUsers.map((user, index) => (
              <span key={index}>
                {user}
                {index < typingUsers.length - 1 ? ', ' : ''} 
              </span>
            ))}{' '}
            {typingUsers.length > 1 ? 'are' : 'is'} typing...
          </p>
        </div>
      )}
        </div>

        <div className="editor-section" onMouseMove={handleCursorMove}>
          <h3>Collaborative Code Editor</h3>
          <div className="editor-controls">
            <div className="select-container">
              <select value={language} onChange={(e) => updateLanguage(e.target.value)}>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </select>
            </div>
            <div className="select-container">
              <label>Theme:</label>
              <select value={theme} onChange={(e) => setTheme(e.target.value)}>
                <option value="github">GitHub</option>
                <option value="monokai">Monokai</option>
                <option value="twilight">Twilight</option>
                <option value="solarized_dark">Solarized Dark</option>
                <option value="solarized_light">Solarized Light</option>
                <option value="dracula">Dracula</option>
                <option value="chaos">Chaos</option>
              </select>
            </div>
          </div>


          <div className="editor-wrapper">
            <AceEditor
              mode={language}
              theme={theme}
              name="code-editor"
              onChange={updateCode}
              value={code}
              editorProps={{ $blockScrolling: true }}
              setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
                showGutter: true,
                highlightActiveLine: true,
                fontSize: 16,
              }}
              style={{ width: '100%', height: '400px' }}
            />
          </div>

          <div className="btn-group">
            <button className="btn" onClick={runCode}>Run Code</button>
            <button className="btn" onClick={downloadCode}>Download Code</button>
            <button className="btn" onClick={addToWorkspace}>Add to Workspaces</button>
          </div>

          {feedback && <p className="feedback">{feedback}</p>}

          <h4>Output:</h4>
          <div className="output-container">
            <pre>{output}</pre>
          </div>
        </div>
      </div>

      {cursors.map((cursor, index) => (
        <div
          key={index}
          className="cursor-indicator"
          style={{
            top: cursor.position.y,
            left: cursor.position.x,
            backgroundColor: `hsla(${index * 137.508}deg, 70%, 50%, 0.5)`,
          }}
        />
      ))}

      <div className="video-call">
        <VideoCall appId="1eb60b7caffd48549e11940d39453bc7" channel="test" />
      </div>
    </div>
  );
};

export default Room;
