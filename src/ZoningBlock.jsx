import { useEffect, useState } from "react";

export function ZoningBlock(props) {
    const [color, setColor] = useState("unassigned");
    const colors = ["unassigned", "work", "active", "passion", "social"];
    const className = "zoning-block " + color;

    
    

    useEffect(()=>{
        setColor(props.initialColor)
        props.handleColorChange(props.initialColor, props.index)
        console.log(props.initialColor)
    },[props.initialColor])
    
    useEffect(() => {
        if (props.resetRequested) {
            resetColor();
        }
    }, [props.resetRequested]);

    function resetColor() {
        setColor("unassigned"); // Reset the color to grey
        props.handleColorChange("unassigned", props.index)
    }

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
