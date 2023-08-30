import React, {useEffect} from 'react';

import { FixedEvent } from './FixedEvent';
import { FillerEvent } from './FillerEvent';
import { Task } from './Task';



export function Event(props)  {

  
  if(props.eventType === "fixedEvent"){
    return(<FixedEvent eventDetails={props.eventDetails} removeEvent={props.removeEvent} baseClassName={props.baseClassName}></FixedEvent>)
  }else if(props.eventType === "fillerEvent"){
    return(<FillerEvent eventDetails={props.eventDetails} removeEvent={props.removeEvent} baseClassName={props.baseClassName}></FillerEvent>)
  }else if(props.eventType === "task"){
    return(<Task eventDetails={props.eventDetails} removeEvent={props.removeEvent} baseClassName={props.baseClassName}></Task>)
  }else{
    console.log("Event type not specified error")
    return(<></>)
  }
  

}
