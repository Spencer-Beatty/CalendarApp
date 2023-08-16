import React, { useEffect, useState } from "react";
import "./additionalInfoModal.css"

export default function AdditionalInfoModal(props){
    
    
    
  
    useEffect(() => {
        console.log(props.activeModal)
        if(props.activeModal){
            showModal();
        }else{
            closeModal();
        }
        
    },[props.activeModal])


    return (<>
    <div className="modal hidden" style={style}>
        <div className="flex">
            
            <button className="btn-close">⨉</button>
        </div>

        <div>
            <h3>Stay in touch</h3>
            <p>
            Info and questions can go here
             </p>
        </div>

        <input value={inputValue} onChange={e => setInputValue(e.target.value)} 
        type="email" id="email" placeholder="brendaneich@js.com" />
        <button className="btn" onClick={e=>closeModal}>Submit</button>


    </div>

<div className="overlay hidden" style={style} ></div>
<button className="btn btn-open" onClick={e=>showModal()}>Open Modal</button>
</>
    )
}