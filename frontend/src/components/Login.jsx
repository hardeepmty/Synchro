import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {

  const [username,setUsername] = useState('') ;
  const [password, setPassword] = useState('') ;
  const [userData, setUserData] = useState('') ;
  const [workspaces, setWorkspaces] = useState(null) ;
  const [error, setError] = useState([]);

  const navigate = useNavigate() ;

  const handleLogin = async (e) => {
    e.preventDefault() ;
    try{
      const response = await axios.post('http://localhost:5000/api/user/login' , {username, password} , {withCredentials: true}) ;
      if(response.data.success){
        console.log(response) ;
        // navigate('/workspace') ;
        setUserData(response.data.user.username)
        setWorkspaces(response.data.user.workspaces)
      }
      else{
        setError(response.data.message);
        console.log(error) ;
      }
    }catch(error){
      console.log(error) ;
      setError('failed to login')
    }
  }
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <label>Username</label>
        <input type='text' value={username} onChange={(e) => setUsername(e.target.value)}></input>
        <label>Password</label>
        <input type='password' value={password} onChange={(e) => setPassword(e.target.value)}></input>
        <button type='submit'>Login</button>
      </form>
      {error && <p>{error}</p>}


      {userData && (
        <div>
          <h3>Welcome, {userData}!</h3>
          <h4>Your Workspaces:</h4>
          <ul>
            {workspaces.map((workspace, index) => (
              <li key={index}>{workspace.roomId}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default Login
