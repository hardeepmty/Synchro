import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const[username,setUsername] = useState('') ;
  const[password,setPassword] = useState('') ;
  const navigate = useNavigate() ;

  const handleSubmit = async(e) =>{
    e.preventDefault() ;
    try{
      const response = await axios.post('http://localhost:5000/api/user/register' , {
        username, password
      })
      if(response.data.success){
        alert("registered!") ;
        navigate('/login') ;
      }else{
        console.log(response.data.message) ;
      }
    }catch(err){
      console.log(err) ;
    }
  }
  return (
    <div className='register-page'>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <label>Username</label>
        <input
        type='text'
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        />
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="register-button">Register</button>
      </form>
    </div>
  )
}

export default Register
