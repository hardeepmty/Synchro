import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import AceEditor from 'react-ace';
import VideoCall from '../components/VideoCall';

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-c_cpp'
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/mode-markdown';


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
  const [projectDescription, setProjectDescription] = useState('');
  const [aiGeneratedCode, setAIGeneratedCode] = useState(''); 
  const [readOnly, setReadOnly] = useState(true)

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

  //function for read-only access
  // const toggleEdit = () =>{
  //   setReadOnly(!readOnly) ;
  // }

  return (
    <div>
      <h2>Room: {roomId}</h2>
      <h3>Welcome, {userName}</h3>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1, marginRight: '20px' }}>
          <h3>Chat Messages</h3>
          <div style={{ height: '200px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px' }}>
            {messages.map((msg, index) => (
              <div key={index}><strong>{msg.user}:</strong> {msg.message}</div>
            ))}
          </div>
          <input
            type="text"
            placeholder="Type a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
        </div>

        <div style={{ flex: 2 }}>
          <h3>Collaborative Code Editor</h3>
          <select value={language} onChange={(e) => updateLanguage(e.target.value)}>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>
          <AceEditor
            mode={language}
            theme="github"
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
            style={{ width: '100%', height: '300px' }}
          />
          <button onClick={runCode}>Run Code</button>
          <h4>Output:</h4>
          <pre style={{ border: '1px solid #ccc', padding: '10px', minHeight: '100px' }}>
            {output}
          </pre>
        </div>
      </div>

      <VideoCall appId="1eb60b7caffd48549e11940d39453bc7" channel="test" />
    </div>
  );
};

export default Room;
