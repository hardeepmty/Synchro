import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AceEditor from 'react-ace';

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
  const [theme, setTheme] = useState('github'); 


  useEffect(() => {
    const fetchWorkspaceData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/workspace/getWorkSpace/${roomId}`, {
          withCredentials: true,
        });

        console.log(response.data);
        setWorkspaceData(response.data);
      } catch (error) {
        console.log(error);
        setError('Failed to load workspace data.');
      }
    };

    fetchWorkspaceData();
  }, [roomId]);

  return (
    <div>
      {error && <p>{error}</p>}
      {workspaceData ? (
        <div>
          <h2>Workspace {roomId}</h2>
          <p><strong>Language:</strong> {workspaceData.language}</p>
          <p><strong>Code:</strong></p>

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

          <AceEditor
            mode={workspaceData.language.toLowerCase()} 
            theme={theme} 
            value={workspaceData.code}
            name="workspace_code_editor"
            editorProps={{ $blockScrolling: true }}
            setOptions={{ readOnly: true }} 
            width="100%"
            fontSize={16}
            showPrintMargin={false}
            highlightActiveLine={true}
          />
        </div>
      ) : (
        <p>Loading workspace data...</p>
      )}
    </div>
  );
};

export default Workspace;
