import React, {useEffect} from 'react';
import './Event.css';
import { getFirestore, collection, addDoc, doc, deleteDoc } from 'firebase/firestore';
import firebaseApp from './FirebaseConfig.js';

export function Event(props) {
    
    
    const timeParts = props.eventDetails.startTime.split(':')
    const hours = parseInt(timeParts[0], 10)
    const minutes = parseInt(timeParts[1], 10)


    const top = (hours * 100) + (minutes * 100 / 60) + 20 /*Amount from top */
    
    const style = {
        position: `absolute`,
        top: `${top}px`
    }
  

  return (
    <>
      <li number={props.eventDetails.id} className="event-item" style={style}>
        <h3 >{props.eventDetails.title}</h3>
        <h3>{props.eventDetails.startTime}</h3>
        <button onClick={() => props.removeEvent(props.eventDetails.id, props.eventDetails.docRefNum)}>Delete</button>
        
      </li>
    </>
  );
}
