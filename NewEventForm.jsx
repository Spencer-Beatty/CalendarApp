import { useState } from 'react'


export function NewEventForm(props) {
    const [newEvent, setNewEvent] = useState("")
    const [newTime, setNewTime] = useState("10")
    
    
    

    function handleSubmit(e) {
        e.preventDefault();
        if(checkTime(newTime)){
            props.addEvent(newEvent, newTime)
        }else{
            window.alert("Please enter the time in the correct format (e.g., '13:00' for 1 PM)");
            return null;
        }
     }

     function checkTime(time) {
        return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
        
    }
     
     
    
   

    return (<><form className='p' onSubmit={handleSubmit}>
    <div>
    <label htmlFor='item'>New Item</label>
    <input value={newEvent}
    onChange={e => setNewEvent(e.target.value)}
    type="text" id="item"
    placeholder='Enter Event Name' required></input>
   
    
    <label htmlFor='item'>Time</label>
    <input value={newTime} onChange={e => setNewTime(e.target.value)}
    placeholder='Enter expected amount of time' required ></input>
    
    
    </div>

    <button className='btn-event'></button>
  </form>
  
  </>)
}