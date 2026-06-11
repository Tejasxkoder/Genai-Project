import React from 'react'
import { useNavigate,Link } from 'react-router'
import "../auth.form.scss" 
import { useAuth } from '../hooks/useAuth'
import { useState } from 'react'

import { useNavigate } from 'react-router'

const Login = () => {
  const {loading,handlelogin}=useAuth()
  const navigate = useNavigate()
  const[email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  
  const handleSubmit = async (e)=>{
    e.preventDefault()
    await handlelogin({email,password})
    navigate("/")
  }

  if(loading){
    return(<main><h1>Loading......</h1></main>)
  }
  return (
    <main>
      <div className="form-container">
        <h1>Login</h1>

        <form onSubmit={handleSubmit}>

          <div className="input-group">
            <label htmlFor='email'>Email</label>
            <input 
            onChange={(e)=>{setEmail(e.target.value)}} type="email" id="email" name="email" placeholder="Enter email address"></input>
          </div>
          <div>
            <div className="input-group">
              <label
              htmlFor='password'>assword</label>
            <input             onChange={(e)=>{setPassword(e.target.value)}}  type="password" id="password" name="password" placeholder="Enter password address"></input>
            </div>
          </div>
          <button className="button primary-button"> Login
          </button>

        </form>
        <p>Don't have an account? <Link to={"/Register"}>Register</Link></p>        
      </div>
    </main>
  )
}

export default Login