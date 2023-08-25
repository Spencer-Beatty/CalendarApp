import React, { useState } from "react";
import "./fillerEventForm.css"
export function NewFillerEventForm(props){
    const [title, setTitle] = useState("")
    const [duration, setDuration] = useState("")
    const [type, setType] = useState("")

    function handleSubmit(e){
        e.preventDefault();
        props.addFillerEvent(title, duration, type)
    }

    return( <form className='filler-event-form' onSubmit={handleSubmit}>
    <div className="filler-event-div">
      <label className='form-label' htmlFor='item'>Filler Event</label>
      <input
        className='form-input'
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder='Enter Filler Event Name'
        required
      />
  
      <label className='form-label' htmlFor='type'>Type</label>
      <select
        className='form-select'
        value={type}
        onChange={e => setType(e.target.value)}
      >
        <option>unassigned</option>
        <option>work</option>
        <option>active</option>
        <option>passion</option>
        <option>social</option>
      </select>
  
      <label className='form-label' htmlFor='duration'>Duration</label>
      <select
        className='form-select'
        value={duration}
        onChange={e => setDuration(e.target.value)}
      >
        <option>15</option>
        <option>30</option>
        <option>60</option>
      </select>
    </div>
  
    <button className='filler-btn' type="submit">
      <span className="ripple" id="ripple"></span>
      Add Filler Event
    </button>
  </form>
  
  
  
  )
}