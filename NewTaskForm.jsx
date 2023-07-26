import React, { useState } from "react";

export function NewTaskForm(props){
    const [title, setTitle] = useState("")
    const [timeRequired, setTimeRequired] = useState("")
    const [type, setType] = useState("")
    

    function handleSubmit(e){
        e.preventDefault();
        props.addTask(title, timeRequired, type)
    }

    return( <><form className='p' onSubmit={handleSubmit}>
    <div>

    <label htmlFor='item'>Task</label>
    <input value={title}
    onChange={e => setTitle(e.target.value)}
    placeholder='Enter Task Name' required></input>
   
   <label htmlFor='timeRequired'>Time Required</label>
   <input value={timeRequired}
    onChange={e => setTimeRequired(e.target.value)}
    placeholder='Enter Time Required' required></input>
    
    <label htmlFor='type'>Type</label>
    <select value={type} onChange={e => setType(e.target.value)}>
        <option>Excercise</option>
        <option>Work</option>
        <option>Relax</option>
        <option>Creative</option>
        <option>Social</option>
    </select>


    
    
    
    
    </div>

    <button className='btn-event'></button>
  </form>
  
  </>)
}