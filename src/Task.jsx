import React from "react";

export function Task(props){


    return (
    <>
        <li  className={props.baseClassName} >
          <h3 >{props.eventDetails.title}</h3>
          <h3>{props.eventDetails.duration}</h3>
          <h3>{props.eventDetails.type}</h3>
          <button onClick={() => props.removeEvent(props.eventDetails.id, props.eventDetails.docRefNum)}>Delete</button>
          
        </li>
      </>)
}