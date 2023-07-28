import React from "react"

export function FillerEvent(props)  {
    
    

  return (
    <>
      <li number={props.eventDetails.id} className="event-item" >
        <h3 >{props.eventDetails.title}</h3>
        <h3>{props.eventDetails.startTime}</h3>
        <button onClick={() => props.removeEvent(props.eventDetails.id, props.eventDetails.docRefNum)}>Delete</button>
        
      </li>
    </>
  );
}