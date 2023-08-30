import React from "react";


export function TimeList(props) {
    const hours = Array.from({length: 24}, (_, i) => i); 

    return (
        <div className="time-list">
            {hours.map(hour => (
                <div className="time-list-element" key={hour} style={{ top: `${hour * props.hourHeight}px`, position: 'absolute' }}>
                    
                    {hour}:00
                </div>
            ))}
        </div>
    );

}