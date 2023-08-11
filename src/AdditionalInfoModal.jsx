import React, { useState } from "react";
import "./additionalInfoModal.css"


export default function AdditionalInfoModal(){
    const [style, setStyle] = useState()
    

    function showModal(){
        setStyle({display:'block'})
        
    }

    function closeModal(){
        setStyle({display:'none'})
    }
    
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

        <input type="email" id="email" placeholder="brendaneich@js.com" />
        <button className="btn" onClick={e=>closeModal()}>Submit</button>


    </div>

<div className="overlay hidden" style={style} ></div>
<button className="btn btn-open" onClick={e=>showModal()}>Open Modal</button>
</>
    )
}