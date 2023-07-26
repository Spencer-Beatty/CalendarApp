import React, { useState } from "react";

export function NewFillerEventForm(props){
    const [title, setTitle] = useState("")
    const [duration, setDuration] = useState("")
    const [type, setType] = useState("")

    function handleSubmit(e){
        e.preventDefault();
        props.addFillerEvent(title, duration, type)
    }

    return( <><form className='p' onSubmit={handleSubmit}>
    <div>

    <label htmlFor='item'>Filler Event</label>
    <input value={title}
    onChange={e => setTitle(e.target.value)}
    placeholder='Enter Filler Event Name' required></input>
   
    
    <label htmlFor='type'>Type</label>
    <select value={type} onChange={e => setType(e.target.value)}>
        <option>Excercise</option>
        <option>Work</option>
        <option>Relax</option>
        <option>Creative</option>
        <option>Social</option>
    </select>


    <label htmlFor='duration'>Duration</label>
    <select value={duration} onChange={e => setDuration(e.target.value)}>
        <option >15</option>
        <option >30</option>
    </select> 
    
    
    
    </div>

    <button className='btn-event'></button>
  </form>
  
  </>)
}