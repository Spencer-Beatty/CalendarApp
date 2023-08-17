import { useEffect, useState } from "react";

export function ZoningBlock(props) {
    const [color, setColor] = useState("grey");
    const colors = ["grey", "blue", "green", "yellow", "brown"];
    const className = "zoning-block " + color;

    useEffect(()=>{
        props.handleColorChange(color, props.index);
        
    },[])
    function changeColour() {
        const currentIndex = colors.indexOf(color);
        let newColor;

        if (currentIndex === -1 || currentIndex === colors.length - 1) {
            newColor = colors[0];
        } else {
            newColor = colors[currentIndex + 1];
        }

        setColor(newColor);
        props.handleColorChange(newColor, props.index);
    }

    return (
        <button 
            key={props.index} 
            className={className} 
            style={props.style} 
            onClick={changeColour}
            
        />
    );
}
