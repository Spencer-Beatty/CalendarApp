import React from "react";
import "./calendar.css"
export function CalendarEvent(props){
        const hourHeight = 100;
        const minuteHeight = hourHeight / 60;


        const startTime = props.event.startTime.split(":");
        const endTime = props.event.endTime.split(":");

        const top = parseInt(startTime[0] * hourHeight + startTime[1] * minuteHeight);

        const bottom = parseInt(endTime[0] * hourHeight + endTime[1] * minuteHeight);

        
        const style = {
            
            top: `${top}px`,
            height: `${bottom - top}px`
        }

    return(
        <>
            <div className="event" style={style}>
                <div className="title">{props.event.title}</div>
                <div className="time">{startTime[0]} - {endTime[0]}</div>




            </div>


        </>


    )
}