import React from "react"
import { useState } from "react"
import "./app.css"
export function HeaderInfo(props) {
  const [data, setData] = useState("")

return( <><div className="calendar-header">
        <h1 className = "header title">Welcome Back</h1>
        <input className="header-input" value={data} onChange={e => setData(e.target.value)}></input>
        <button onClick={e => props.callBreakdown(data)}> <h1>Submit Event</h1></button>
      </div>
      </>
)};