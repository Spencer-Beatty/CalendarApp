import { useEffect, useRef, useState } from "react"
import { ZoningBlock } from "./ZoningBlock"

export function Zoning(props){
    
    
    const dayStart = 8 //Hours
    const dayEnd= 20
    const [zoningBlockColours, setZoningBlockColours] = useState(Array.from({ length: (dayEnd-dayStart)*2 }))
    const zoningRef = useRef(zoningBlockColours)
    const height = 49
    const style = {
        height:`${height}px`
    }
    const top = {
        top:`${dayStart*100}px`,
        position: `relative`
    }

    useEffect(()=>{
        props.updateZoningSchedule(zoningBlockColours)
        console.log(zoningBlockColours)
    },[zoningBlockColours])

    
    
    const handleColorChange = (newColor, index) => {
        setZoningBlockColours(prevColors => {
            return prevColors.map((color, idx) => (idx === index ? newColor : color));
        });
        console.log(`Color from child: ${newColor}`);
        
        
    };

    
    
    return(
        
        <div style={top} >
        {Array.from({ length: (dayEnd-dayStart)*2 }).map((_, index) => (
            <ZoningBlock initialColor={props.initialZoningSchedule[index]} key={index} index={index} style={style} handleColorChange={handleColorChange}></ZoningBlock>
        ))}
        </div>
              
    )




}