import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios';


const Workspace = () => {
  const {roomId} = useParams() ;
  const [workspaceData, setWorkspaceData] = useState(null) ;
  const [error,setError] = useState('') ;

  useEffect(()=>{
    const fetchWorkspaceData = async() => {
      try{
        const response = await axios.get(`http://localhost:5000/api/workspace/getWorkSpace/${roomId}`,{
          withCredentials: true,
        }) ;

        console.log(response.data) ;
        setWorkspaceData(response.data);
      }catch(error){
        console.log(error) ;
      }
    }

    fetchWorkspaceData() ;
  }, [roomId]) ;

  return (
    <div>
          <div>
      {error && <p>{error}</p>}
      {workspaceData ? (
        <div>
          <h2>Workspace {roomId}</h2>
          <p><strong>Language:</strong> {workspaceData.language}</p>
          <p><strong>Code:</strong></p>
          <pre>{workspaceData.code}</pre>
        </div>
      ) : (
        <p>Loading workspace data...</p>
      )}
    </div>
    </div>
  )
}

export default Workspace
