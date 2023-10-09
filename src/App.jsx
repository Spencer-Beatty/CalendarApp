import React, { useState } from "react";
import CalendarElement from "./CalendarElement";
import "./login.css"

export default function App(){
  
  const [loginName, setLoginName] = useState("")
  const [loginUnchosen, setLoginUnchosen] = useState(true)
  console.log(loginName)
  return( 
  <>
  
  {loginUnchosen ? 
  <div className="outer-div">
    <div className="login-div welcome"> Welcome to Spencer Beatty's Calendar App</div>
  <form className="login-form" onSubmit={() => setLoginUnchosen(false)}>
      <div className="login-div">Choose a Username Here</div>
      <input className="login-input" value={loginName} onChange={e => {setLoginName(e.target.value)}}></input>
      <button className="login-btn">Submit</button>
  </form>
    <div className="login-div">OR</div>
    <div className="login-div">If you are just looking at the portfolio</div>
    <div className="login-div">Here is a premade example of how the application works</div>
    <div className="login-div">None of the changes in test mode persist so have fun</div>
    <button className="login-btn limit" onClick={()=>{setLoginName("to test mode");setLoginUnchosen(false);}}>Test Mode</button>
  </div> :
  <CalendarElement loginName={loginName.toLowerCase()}/>
  }</>
  
  
  )

}