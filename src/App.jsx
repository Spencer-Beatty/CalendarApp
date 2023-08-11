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
import AdditionalInfoModal from './AdditionalInfoModal'

import {CalendarEvent} from "./CalendarEvent"
import "./calendar.css"
import { breakdownEventDescription } from './PythonCommunicaton'


function getDate() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  return `${month}/${date}/${year}`;
}





export default function App() {


  ///----------Old Variables---------------

  // State variables for events
  const [fixedEvents, setFixedEvents] = useState([])
  const [fillerEvents, setFillerEvents] = useState([])
  const [tasks, setTasks] = useState([])
  
  const[calendarTimes, setCalendarTimes] = useState([])

  // state variables for boolean displays
  const [displayFixed, setDisplayFixed] = useState(false)
  const [displayFiller, setDisplayFiller] = useState(false)
  const [displayTasks, setDisplayTasks] = useState(false)
  

  // state variables for date
  
  const [currentDates, setCurrentDates] = useState([])
  // Variables to align scroll-left styles
  const dateRef = useRef(null)
  const calendarRef = useRef(null)
  

  useEffect(() => {
    
    setCurrentDates(getCurrentDates())

    const fetchEvents = async () => {
      try{
        // Loads events from Firestore
        
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

  //Date function
  
  const getCurrentDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };


  //Function takes event sentence as input and adds an event to fixedEvents
  function callBreakdown(eventDescription){
    console.log("breakdown called")
    const data = async () => {
      try{
        //Processed Event Decription (ped)
        const ped = await breakdownEventDescription(eventDescription, Date());
        
        //Update times to be pm if given
        if(ped.additionalPrompts !== []){
          console.log(ped.additionalPrompts[0])
          // Pop up model with additional information to fill in?
          
        }



        var a = new Date(2023, ped.dateMonth, ped.dateDay)
        console.log(a.toDateString())
        //Add new event here
        addFixedEvents(ped.title, ped.startTime, ped.endTime, ped.dateDay);
      }catch(error){
        console.log("Error " , error)
      }
    }
    data();
  }
  
  //Function removes fixed Events from firebase as well as state variables
  function removeFixedEvent(id, docRefNum){
    deleteEventFromFirestore(docRefNum, 'fixedEvents')
    setFixedEvents(currentEvents => 
      {return currentEvents.filter(event => event.id !== id)})
  }

  //Similar remove but for tasks
  function removeTask(id, docRefNum){
    deleteEventFromFirestore(docRefNum, 'tasks')
    setTasks(currentTasks =>
      {return currentTasks.filter(event => event.id !== id)})
  }

  //Similar remove but for filler events
  function removeFillerEvent(id, docRefNum){
    deleteEventFromFirestore(docRefNum, 'fillerEvent')
    setFillerEvents(currentFillerEvents =>
      {return currentFillerEvents.filter(event => event.id !== id)})
  }

  //Add for fixedEvents
  async function addFixedEvents(title, startTime, endTime, date){
    
    const docRefNum = await postEventToFirestore(title, startTime, endTime, date);
    console.log(docRefNum)
    setFixedEvents(currentEvents => {return [...currentEvents,
      {id:crypto.randomUUID(), title:title, startTime:startTime, endTime:endTime, date:date, docRefNum:docRefNum}]})
  }

  //Add for fillerEvents
  async function addFillerEvent(title, duration, type){
      const docRefNum = await postFillerEventToFirestore(title, duration, type);
      const id = crypto.randomUUID();
      setFillerEvents(currentFillerEvents => {return [...currentFillerEvents,
      {id:id, title:title, type:type, duration:duration, docRefNum:docRefNum}]})
    
  }

  //Add for tasks
  async function addTask(title, timeRequired, type){
    const docRefNum = await postTaskToFirestore(title, timeRequired, type);
    setTasks(currentTasks => {return [...currentTasks,
    {id:crypto.randomUUID(), title:title, timeRequired:timeRequired, type:type, docRefNum:docRefNum }]})
  }

  function intToDay(i) {
    
    const days = ['Sun','Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[i];
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


 


  console.log(currentDates.map(getDate))

  
  return (
    <div className="container">
    
  
  <div className='left-side'>
  <NewFixedEventForm addFixedEvents={addFixedEvents}></NewFixedEventForm>
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
      <AdditionalInfoModal></AdditionalInfoModal>

      <div className='date-container'
        ref={dateRef}
        onScroll={handleScrollDate}>
      <div className='date'>
      
      </div>
      {currentDates.map(event => {
        return(<div className="date">
                  <p className="date-num">{intToDay(event.getDay())} </p>
                  <p className="date-day">{event.getDate()}</p>
              </div>)
      })}
      
      </div> 


        <div className='days'
        ref={calendarRef}
        onScroll={handleScrollCalendar}>
          <TimeList></TimeList>
          
          {
          currentDates.map(date => {
            return <div className='events'> { fixedEvents.map(event => {
              
              if(event.date === parseInt(date.getDate())){
                
                return <CalendarEvent event={event}></CalendarEvent>
              }
              return null;

              })}</div>;
              
            })
          }

              
          
        </div>
        
      </div>
    </div>
    
</div>
  )
}
/* You can have a check for date setting? */
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


        /* <div className='day Mon'>
            <div className="events">
              <div className="event start-2 end-5 securities">
                <p className="title">Securities Regulation</p>
                <p className="time" top={"40px"}>2 PM - 5 PM</p>
              </div>
              
            </div>
          </div>
          <div className="day Tues">
            <div className="events">
    
              {fixedEvents.map(event => {
                // This should have a remove event button passed through that deals with all possible events
                return (<CalendarEvent event={event}></CalendarEvent>)
              })}
              <div> {currentDate} </div>
              <div className="event start-2 end-5 securities">
                <p className="title"></p>
                <p className="time">2 PM - 5 PM</p>
              </div>
            </div>
          </div>*/