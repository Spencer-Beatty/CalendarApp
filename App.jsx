import { useState, useEffect } from 'react'
import "./app.css"
import { NewEventForm } from "./NewEventForm"
import { NewFillerEventForm } from "./NewFillerEventForm"
import { NewTaskForm } from './NewTaskForm'
import { Event } from "./Event"
import { HeaderInfo } from './HeaderInfo'
import { TimeList } from './TimeList'
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import firebaseApp, {postEventToFirestore, deleteEventFromFirestore, LoadEventsFromFirestore} from './FirebaseConfig.js';
import {postFillerEventToFirestore} from './FirebaseConfig.js';
import {postTaskToFirestore} from './FirebaseConfig.js';

export default function App() {
  
  const [events, setEvents] = useState([])
  const [fillerEvents, setFillerEvents] = useState([])
  const [tasks, setTasks] = useState([])
  
  
  useEffect(() => {
    const fetchEvents = async () => {
      try{
        const eventsFromData = await LoadEventsFromFirestore();
        setEvents(eventsFromData);
      }
      catch(error){
        console.log(" Error fetching events");
        throw error;
      }
    };
    fetchEvents();

  }, []);
  

  function removeEvent(id, docRefNum){
    deleteEventFromFirestore(docRefNum)
    setEvents(currentEvents => 
      {return currentEvents.filter(event => event.id !== id)})
  }

  async function addEvent(newEvent, newStartTime, newEndTime){
    
    const docRefNum = await postEventToFirestore(newEvent, newStartTime);
    console.log(docRefNum)
    setEvents(currentEvents => {return [...currentEvents,
      {id:crypto.randomUUID(), title:newEvent, startTime:newStartTime, endTime:newEndTime+30, docRefNum:docRefNum}]})
  }

  async function addFillerEvent(title, duration, type){
      const docRefNum = await postFillerEventToFirestore(title, duration, type);
      setFillerEvents(currentFillerEvents => {return [...currentFillerEvents,
      {id:crypto.randomUUID(), title:title, type:type, duration:duration, docRefNum:docRefNum}]})
  }

  async function addTask(title, timeRequired, type){
    const docRefNum = await postTaskToFirestore(title, timeRequired, type);
    setTasks(currentTasks => {return [...currentTasks,
    {id:crypto.randomUUID(), title:title, timeRequired:timeRequired, type:type, docRefNum:docRefNum }]})
  }

  console.log(events)
  
  
  return (
    <div className="container">
    
  
  <div className='left-side'>
  <NewEventForm addEvent={addEvent}></NewEventForm>
  <NewFillerEventForm addFillerEvent={addFillerEvent}></NewFillerEventForm>
  <NewTaskForm addTask={addTask}></NewTaskForm>
  </div>
  
  <div className='middle-side'></div>

  <div className="right-side">

      <HeaderInfo></HeaderInfo>

      <div className='scrollable-element'>
        
        <TimeList className="time-list-element"></TimeList>

        <div className="calendar-events">
          {events.map(event => {
            return (<Event key={event.id} eventDetails={event} removeEvent={removeEvent}></Event>)
          })}
        </div>

      </div>
    

  </div>

  
  

  
  

    
</div>
  )
}

/*<li className="event-item" key={event.id}>
            <h3>{event.title}</h3>
            <h3>{event.startTime} </h3>
            <button onClick={()=>removeEvent(event.id)}>Delete</button>
          </li>*/
