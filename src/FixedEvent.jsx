import React from "react"

export function FixedEvent(props)  {
      
  return (
    <>
      <li number={props.eventDetails.id} className={props.baseClassName} >
        <h3 >{props.eventDetails.title}</h3>
        <h3>{props.eventDetails.startTime}</h3>
        <button onClick={() => props.removeEvent(props.eventDetails.id, props.eventDetails.docRefNum)}>Delete</button>
        
      </li>
    </>
  );
}