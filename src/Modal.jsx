import { useState } from "react"
import React from "react"
import "./modal.css"

export default function Modal(props){
    const [inputValue, setInputValue] = useState("")
    return(<>
        <div className="modal">
        <div className="modal-element" >
          <div className="modal-btn-container">

            <button className="modal-btn-close" onClick={() => {setInputValue("");
                                                               props.setEventModalActive(false)}}>⨉</button>
          </div>

          
          <div className="modal-form-group">
          
          <input className="modal-input" value={inputValue} 
            type="text" id="event" placeholder="ex. Add Meeting from 4-5pm on Tue" 
            onChange={e => setInputValue(e.target.value)}/>

          <label for="event" class="modal-label">ex. Add Meeting from 4-5pm on Tue</label>
          </div>
          <button className="modal-btn-submit" onClick={() => {props.callBreakdown(inputValue);
                                                               setInputValue("");
                                                               props.setEventModalActive(false)}}
                                                               >Submit</button>


        </div>
        <div className="modal-overlay" ></div>
      </div>
        
    </>)
}