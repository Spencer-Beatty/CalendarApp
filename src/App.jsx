import { useState, useEffect , useRef} from 'react'
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

import {CalendarEvent} from "./CalendarEvent"
import "./calendar.css"
import { breakdownEventDescription } from './PythonCommunicaton'



export default function App() {
// flask variables






  // State variables for events
  const [fixedEvents, setFixedEvents] = useState([])
  const [fillerEvents, setFillerEvents] = useState([])
  const [tasks, setTasks] = useState([])
  
  const[calendarTimes, setCalendarTimes] = useState([])

  // state variables for boolean displays
  const [displayFixed, setDisplayFixed] = useState(false)
  const [displayFiller, setDisplayFiller] = useState(false)
  const [displayTasks, setDisplayTasks] = useState(false)
  
  const dateRef = useRef(null)
  const calendarRef = useRef(null)


  useEffect(() => {
    const fetchEvents = async () => {
      try{
        
        
        const eventsFromData = await LoadEventsFromFirestore();
        
        setFixedEvents(eventsFromData.fixedEvents);
        setFillerEvents(eventsFromData.fillerEvents);
        setTasks(eventsFromData.tasks);
      }
      catch(error){
        console.log(" Error fetching events");
        throw error;
      }
    };
    fetchEvents();

  }, []);

  function callBreakdown(eventDescription){
    console.log("breakdown called")
    const data = async () => {
      try{
        const proccessedEventDescription = await breakdownEventDescription(eventDescription);
        console.log(proccessedEventDescription)
      }catch(error){
        console.log("Error " , error)
      }
    }
    data();
  }
  

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


  

  function initializeCalendar(){
    // This should also slot in filler and task events but at later date.
    // As well this should strip apart fixed events and fill calendarTimes with
    // raw data points
    setCalendarTimes(fixedEvents);
  }


  

  const handleScrollDate = () => {
    if(calendarRef.current) {
      calendarRef.current.scrollLeft = dateRef.current.scrollLeft;
    }
  };

  const handleScrollCalendar = () => {
    if(dateRef.current) {
       dateRef.current.scrollLeft = calendarRef.current.scrollLeft;
    }
  };


 


  console.log(calendarTimes)




  
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

      <HeaderInfo callBreakdown={callBreakdown}></HeaderInfo>

      <div className='calendar'>
        

      <div className='date-container'
        ref={dateRef}
        onScroll={handleScrollDate}>
      <div className='date'>
      
      </div>
      <div className="date">
              <p className="date-num">9 </p>
              <p className="date-day">Mon</p>
            </div>
      <div className="date">
              <p className="date-num">10 </p>
              <p className="date-day">Tues</p>
      </div>
      <div className="date">
              <p className="date-num">11 </p>
              <p className="date-day">Wed</p>
      </div>
      <div className="date">
              <p className="date-num">12 </p>
              <p className="date-day">Thur</p>
      </div>
      </div> 


        <div className='days'
        ref={calendarRef}
        onScroll={handleScrollCalendar}>
          <TimeList></TimeList>
          <div className='day Mon'>
            <div className="events">
              <div className="event start-2 end-5 securities">
                <p className="title">Securities Regulation</p>
                <p className="time" top={"40px"}>2 PM - 5 PM</p>
              </div>
              
            </div>
          </div>
          <div className="day Tues">
            <div className="events">
              <CalendarEvent startTime={"1:00"} endTime={"2:00"}></CalendarEvent>
             
              <div className="event start-2 end-5 securities">
                <p className="title"></p>
                <p className="time">2 PM - 5 PM</p>
              </div>
            </div>
          </div>
          
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

          /*<div className="calendar-events">
          {fixedEvents.map(event => {
            // This should have a remove event button passed through that deals with all possible events
            return (<Event eventType={"fixedEvent"} key={event.id} eventDetails={event} removeEvent={removeFixedEvent} baseClassName={"event-item"}></Event>)
          })}
        </div>*/

        /*<CalendarEvents  events={fixedEvents}></CalendarEvents>*/

        /*<TimeList className="time-list-element"></TimeList>*/