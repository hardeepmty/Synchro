import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {

  const [username,setUsername] = useState('') ;
  const [password, setPassword] = useState('') ;
  const [error, setError] = useState('');

  const navigate = useNavigate() ;

  const handleLogin = async (e) => {
    e.preventDefault() ;
    try{
      const response = await axios.post('http://localhost:5000/api/user/login' , {username, password} , {withCredentials: true}) ;
      if(response.data.success){
        console.log(response) ;
        navigate('/workspace') ;
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
    </div>
  )
}

export default Login
