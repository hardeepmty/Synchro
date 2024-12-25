import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AceEditor from 'react-ace';
import './Workspace.css';

// Importing modes
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-markdown';

// Importing themes
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-twilight';
import 'ace-builds/src-noconflict/theme-solarized_dark';
import 'ace-builds/src-noconflict/theme-solarized_light';
import 'ace-builds/src-noconflict/theme-dracula';
import 'ace-builds/src-noconflict/theme-chaos';

const Workspace = () => {
  const { roomId } = useParams();
  const [workspaceData, setWorkspaceData] = useState(null);
  const [error, setError] = useState('');
  const [theme, setTheme] = useState('dracula'); // Changed default theme to match dark theme

  useEffect(() => {
    const fetchWorkspaceData = async () => {
      try {
        const response = await axios.get(`http://13.211.188.41/api/workspace/getWorkSpace/${roomId}`, {
          withCredentials: true,
        });
        setWorkspaceData(response.data);
      } catch (error) {
        console.error(error);
        setError('Failed to load workspace data.');
      }
    };

    fetchWorkspaceData();
  }, [roomId]);

  if (error) {
    return <div className="workspace-container">
      <div className="error-message">{error}</div>
    </div>;
  }

  if (!workspaceData) {
    return <div className="workspace-container">
      <div className="loading-message">Loading workspace data...</div>
    </div>;
  }

  return (
    <div className="workspace-container" style={{fontFamily:"Montserrat"}}>
      <div className="workspace-header">
        <h2>Workspace {roomId}</h2>
        <div className="language-info">
          <strong>Language:</strong> {workspaceData.language}
        </div>
      </div>

      <div className="editor-controls">
        <div className="theme-selector">
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
          mode={workspaceData.language.toLowerCase()}
          theme={theme}
          value={workspaceData.code}
          name="workspace_code_editor"
          editorProps={{ $blockScrolling: true }}
          setOptions={{
            readOnly: true,
            fontSize: 16,
            showPrintMargin: false,
            highlightActiveLine: true,
            showGutter: true,
          }}
          width="100%"
          height="100%"
        />
      </div>
    </div>
  );
};

export default Workspace;