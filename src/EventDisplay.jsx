import React from "react";
import "./eventDisplay.css"
import { Event } from "./Event";

export function EventDisplay(props){


    return(
    <div className="event-display">
    <ul className="event-display-container">
    {props.events.map(event => {
            // This should have a remove event button passed through that deals with all possibel events
            return (<Event baseClassName={"displayed-event"} eventType={props.eventType} key={event.id} eventDetails={event} removeEvent={props.removeEvent} ></Event>)
          })}
    </ul>
    </div>)
}