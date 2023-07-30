import React from "react";
import "./timeList.css"

export function TimeList() {
    const hours = Array.from({length: 24}, (_, i) => i); 

    return (
        <ul className="time-list">
            {hours.map(hour => (
                <li className="time-element" key={hour} style={{ top: `${hour * 100}px`, position: 'absolute' }}>
                    
                    {hour}:00
                </li>
            ))}
        </ul>
    );

}