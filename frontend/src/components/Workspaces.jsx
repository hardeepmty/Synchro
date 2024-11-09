import React, { useEffect, useState } from 'react'

const Workspaces = () => {
  const [username,setUsername] = useState('') ;

  useEffect(() => {
    const fetchWorkSpaces = async() => {
      try{
        const response = await axios.get()
      }catch(error){
        console.log(error) ;
      }
    }
  },[])
  return (
    <div>
      <h2>Workspaces</h2>
    </div>
  )
}

export default Workspaces
