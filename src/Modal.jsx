import React from "react"
import "./modal.css"

export default function Modal(props){

    return(<>
        <div className="modal">
        <div className="modal-element" >
          <div className="modal-btn-container">

            <button className="modal-btn-close">⨉</button>
          </div>

          <div className="modal-information">
            <h3 className="modal-information-header">Stay in touch</h3>
            <p>
              
            </p>
          </div>

          <input className="modal-input" value={""} 
            type="email" id="email" placeholder="brendaneich@js.com" />
          <button className="modal-submit-btn" >Submit</button>


        </div>
        <div className="modal-overlay" ></div>
      </div>
        
    </>)
}