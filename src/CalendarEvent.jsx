import React from "react";
import "./calendar.css"
export function CalendarEvent(props){
        const hourHeight = 100;
        const minuteHeight = hourHeight / 60;


        const startHour = new Date(props.event.startTime).getHours();
        const startMinute = new Date(props.event.startTime).getMinutes();
        const endHour = new Date(props.event.endTime).getHours();
        const endMinute = new Date(props.event.endTime).getMinutes();

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