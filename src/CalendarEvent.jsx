import React from "react";

export function CalendarEvent(props){
        const hourHeight = 100;
        const minuteHeight = hourHeight / 60;


        const startTime = props.startTime.split(":");
        const endTime = props.endTime.split(":");

        const top = parseInt(startTime[0] * hourHeight + startTime[1] * minuteHeight);

        const bottom = parseInt(endTime[0] * hourHeight + endTime[1] * minuteHeight);

        console.log(bottom)
        const style = {
            position: `absolute`,
            top: `${top}px`,
            height: `${bottom - top}px`
        }

    return(
        <>
            <div className="event" style={style}>
                <p>Hello</p>




            </div>


        </>


    )
}