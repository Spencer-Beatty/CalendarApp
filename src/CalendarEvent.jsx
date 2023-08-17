import React from "react";
import "./calendar.css"
export function CalendarEvent(props){
        const hourHeight = 100;
        const minuteHeight = hourHeight / 60;


        const startHour = props.event.startTime.getHours();
        const startMinute = props.event.startTime.getMinutes();
        const endHour = props.event.endTime.getHours();
        const endMinute = props.event.endTime.getMinutes();

        const top = parseInt(startHour * hourHeight + startMinute * minuteHeight);

        const bottom = parseInt(endHour * hourHeight + endMinute * minuteHeight);

        
        const style = {
            
            top: `${top}px`,
            height: `${bottom - top}px`
        }

    return(
        <>
            <div className="event" style={style}>
                <div className="title">{props.event.title}</div>
                <div className="time">{startHour} - {endHour}</div>




            </div>


        </>


    )
}