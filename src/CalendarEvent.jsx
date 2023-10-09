import React from "react";


export function CalendarEvent(props){
        
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
            height: `${bottom - top}px`,
            backgroundColor: props.backgroundColor
        }

        const eventClass = "event-item " +  props.event.type
        
    return(
        <>
            <button className={eventClass} style={style} onClick={() => props.removeEvent(props.event.id)}>
                <div className="event-title">{props.event.title}</div>
                {((bottom - top)/minuteHeight > 20 ) ? (
                    
                    startHour < 12 ? (<div className="event-time">{startHour} am </div>) :
                                      (<div className="event-time">{startHour} pm </div>)
                    ) : (
                    <></>
                )} 

            </button>


        </>


    )
}