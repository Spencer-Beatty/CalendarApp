import { useState, useEffect } from 'react'
import "./app.css"
import { NewFixedEventForm } from "./NewFixedEventForm"
import { NewFillerEventForm } from "./NewFillerEventForm"
import { NewTaskForm } from './NewTaskForm'
import { Event } from "./Event"
import { HeaderInfo } from './HeaderInfo'
import { TimeList } from './TimeList'
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import firebaseApp, {postEventToFirestore, deleteEventFromFirestore, LoadEventsFromFirestore} from './FirebaseConfig.js';
import {postFillerEventToFirestore} from './FirebaseConfig.js';
import {postTaskToFirestore} from './FirebaseConfig.js';

import {EventDisplay} from "./EventDisplay"

export default function App() {
  // State variables for events
  const [fixedEvents, setFixedEvents] = useState([])
  const [fillerEvents, setFillerEvents] = useState([])
  const [tasks, setTasks] = useState([])

  // state variables for boolean displays
  const [displayFixed, setDisplayFixed] = useState(false)
  const [displayFiller, setDisplayFiller] = useState(false)
  const [displayTasks, setDisplayTasks] = useState(false)
  
  
  useEffect(() => {
    const fetchEvents = async () => {
      try{
        const eventsFromData = await LoadEventsFromFirestore();
        setFixedEvents(eventsFromData);
      }
      catch(error){
        console.log(" Error fetching events");
        throw error;
      }
    };
    fetchEvents();

  }, []);
  

  function removeFixedEvent(id, docRefNum){
    deleteEventFromFirestore(docRefNum, 'fixedEvents')
    setFixedEvents(currentEvents => 
      {return currentEvents.filter(event => event.id !== id)})
  }

  function removeTask(id, docRefNum){
    deleteEventFromFirestore(docRefNum, 'tasks')
    setTasks(currentTasks =>
      {return currentTasks.filter(event => event.id !== id)})
  }

  function removeFillerEvent(id, docRefNum){
    deleteEventFromFirestore(docRefNum, 'fillerEvent')
    setFillerEvents(currentFillerEvents =>
      {return currentFillerEvents.filter(event => event.id !== id)})
  }

  async function addEvent(newEvent, newStartTime, newEndTime){
    
    const docRefNum = await postEventToFirestore(newEvent, newStartTime);
    console.log(docRefNum)
    setFixedEvents(currentEvents => {return [...currentEvents,
      {id:crypto.randomUUID(), title:newEvent, startTime:newStartTime, endTime:newEndTime+30, docRefNum:docRefNum}]})
  }

  async function addFillerEvent(title, duration, type){
      const docRefNum = await postFillerEventToFirestore(title, duration, type);
      const id = crypto.randomUUID();
      setFillerEvents(currentFillerEvents => {return [...currentFillerEvents,
      {id:id, title:title, type:type, duration:duration, docRefNum:docRefNum}]})
    
  }

  async function addTask(title, timeRequired, type){
    const docRefNum = await postTaskToFirestore(title, timeRequired, type);
    setTasks(currentTasks => {return [...currentTasks,
    {id:crypto.randomUUID(), title:title, timeRequired:timeRequired, type:type, docRefNum:docRefNum }]})
  }

  console.log(fixedEvents)
  
  
  return (
    <div className="container">
    
  
  <div className='left-side'>
  <NewFixedEventForm addEvent={addEvent}></NewFixedEventForm>
  <button onClick={e => setDisplayFixed(!displayFixed)}>Display FixedEvents</button>
  {displayFixed && (<EventDisplay eventType={"fixedEvent"}events={fixedEvents} removeEvent={removeFixedEvent}></EventDisplay>)}
  
  <NewFillerEventForm addFillerEvent={addFillerEvent}></NewFillerEventForm>
  <button onClick={e => setDisplayFiller(!displayFiller)}>Display FixedEvents</button>
  {displayFiller && (<EventDisplay eventType={"fillerEvent"} events={fillerEvents} removeEvent={removeFillerEvent}></EventDisplay>)}
  
  <NewTaskForm addTask={addTask}></NewTaskForm>
  <button onClick={e => setDisplayTasks(!displayTasks)}>Display FixedEvents</button>
  {displayTasks && (<EventDisplay eventType={"task"} events={tasks} removeEvent={removeTask}></EventDisplay>)}
  </div>
  
  <div className='middle-side'></div>

  <div className="right-side">

      <HeaderInfo></HeaderInfo>

      <div className='scrollable-element'>
        
        <TimeList className="time-list-element"></TimeList>

        <div className="calendar-events">
          {fixedEvents.map(event => {
            // This should have a remove event button passed through that deals with all possibel events
            return (<Event eventType={"fixedEvent"} key={event.id} eventDetails={event} removeEvent={removeFixedEvent}></Event>)
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
