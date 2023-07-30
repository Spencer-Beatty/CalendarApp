import React from "react";
import "./event.css"
export default function TimePlaceholder(props){
    const hours = Array.from({length: 24}, (_, i) => i); 
    
    return(
        <>
        <ul className="time-placeholder">
        {hours.map(hour => (
            <li className="individual-time-placeholder"
            key={hour} 
            style={{ top: `${hour * 100}px`, position: 'absolute' }}
            >  
           <ul className="event-container">
                {props.events
                .filter(event => parseInt(event.startTime.split(':')[0],10) === hour)
                .map(event => (
                        <li key={event.id} className="event-item">{event.title}</li>
                    ))}
                </ul>
            </li>
            ))}
        </ul>
        </>
    )
}