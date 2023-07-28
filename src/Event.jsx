import React, {useEffect} from 'react';
import './Event.css';
import { FixedEvent } from './FixedEvent';
import { FillerEvent } from './FillerEvent';
import { Task } from './Task';



export function Event(props)  {


  if(props.eventType === "fixedEvent"){
    return(<FixedEvent eventDetails={props.eventDetails} removeEvent={props.removeEvent}></FixedEvent>)
  }else if(props.eventType === "fillerEvent"){
    return(<FillerEvent eventDetails={props.eventDetails} removeEvent={props.removeEvent}></FillerEvent>)
  }else if(props.eventType === "task"){
    return(<Task eventDetails={props.eventDetails} removeEvent={props.removeEvent}></Task>)
  }else{
    console.log("Event type not specified error")
    return(<></>)
  }

}
