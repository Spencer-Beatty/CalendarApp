import React from "react";


export function CalendarEvent(props){
        console.log(props.hourHeight)
        const hourHeight = props.hourHeight;
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

        const eventClass = "event-item " +  props.event.type

    return(
        <>
            <div className={eventClass} style={style}>
                <div className="event-title">{props.event.title}</div>
                <div className="event-time">{startHour} am</div>




            </div>


        </>


    )
}