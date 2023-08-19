import { useEffect, useRef, useState } from "react"
import { ZoningBlock } from "./ZoningBlock"
import { Type } from "protobufjs"

export function Zoning(props){
    
    
    const dayStart = 8 //Hours
    const dayEnd= 20
    const [zoningBlockColours, setZoningBlockColours] = useState([])
    const [resetRequested, setResetRequested] = useState(false);
    const [initialColors,setInitialColors] = useState([]);
    
    const zoningRef = useRef(zoningBlockColours)
    const height = 49
    const style = {
        height:`${height}px`
    }
    const top = {
        top:`${dayStart*100}px`,
        position: `relative`
    }
    useEffect(() => {
        if(resetRequested){
            setResetRequested(false)
        }
    },[resetRequested])
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const dataFromFireStore = await props.checkFirestoreForZoningSchedule();
                console.log(dataFromFireStore);
    
                if (dataFromFireStore === null) {
                    const defaultColors = Array.from({ length: (dayEnd - dayStart) * 2 });
                    setZoningBlockColours(defaultColors);
                    setInitialColors(defaultColors.map((zone) => {
                        return "unassigned"
                    }));
                    console.log(initialColors)
                
                } else {
                    setZoningBlockColours(dataFromFireStore);
                    setInitialColors(dataFromFireStore)
                }
            } catch (error) {
                console.error("Error fetching data from Firestore:", error);
            }
        };
    
        fetchData();
    }, []);
    

    useEffect(()=>{
        
        if(zoningBlockColours.length > 0){
            console.log(zoningBlockColours.length)
            props.updateZoningSchedule(zoningBlockColours)
        }
        
        
    },[zoningBlockColours])

    function resetZoning(){
        setResetRequested(true)
    }
    
    
    const handleColorChange = (newColor, index) => {
        setZoningBlockColours(prevColors => {
          const newColors = [...prevColors]; // Create a copy of the array
          newColors[index] = newColor; // Update the color at the specified index
          return newColors;
        });
        console.log(`Color from child: ${newColor}`);
      };

    
    
    return(
        <>
        <button onClick={e => resetZoning()}/>
        <div style={top} >
        {Array.from({ length: (dayEnd-dayStart)*2 }).map((_, index) => (
            <ZoningBlock initialColor={initialColors[index]} key={index} index={index} style={style}
             handleColorChange={handleColorChange}
             resetRequested={resetRequested}></ZoningBlock>
        ))}
        </div>
        </>
              
    )




}