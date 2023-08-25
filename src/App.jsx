import { useState, useEffect, useRef } from 'react'
import "./app.css"
import { NewFixedEventForm } from "./NewFixedEventForm"
import { NewFillerEventForm } from "./NewFillerEventForm"
import { NewTaskForm } from './NewTaskForm'
import { Event } from "./Event"
import { HeaderInfo } from './HeaderInfo'
import { TimeList } from './TimeList'
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import firebaseApp, { postEventToFirestore, deleteEventFromFirestore, LoadEventsFromFirestore, postZoningScheduleToFirestore,LoadZoningScheduleFromFirestore } from './FirebaseConfig.js';
import { postFillerEventToFirestore } from './FirebaseConfig.js';
import { postTaskToFirestore } from './FirebaseConfig.js';
import { Zoning } from './Zoning'

import { EventDisplay } from "./EventDisplay"
import { Legend } from './Legend'


import { CalendarEvent } from "./CalendarEvent"
import "./calendar.css"
import { breakdownEventDescription,  fillSchedule  } from './PythonCommunicaton'



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
  const [calendarEvents, setCalendarEvents] = useState([])

  const [modalAnswer, setModalAnswer] = useState([])
  const [activePrompt, setActivePrompt] = useState("")
  const [activeModal, setActiveModal] = useState(true)
  const activeModalRef = useRef(activeModal)
  const modalAnswerRef = useRef(modalAnswer)

  // state variables for boolean displays
  const [displayFixed, setDisplayFixed] = useState(false)
  const [displayFiller, setDisplayFiller] = useState(false)
  const [displayTasks, setDisplayTasks] = useState(false)

  // state variables for date

  const [currentDates, setCurrentDates] = useState([])
  const [zoningSchedule, setZoningSchedule] = useState([])
  const [initialZoningSchedule, setInitialZoningSchedule] = useState(null)
  

  // Variables to align scroll-left styles
  const dateRef = useRef(null)
  const calendarRef = useRef(null)

  //Variable for Modal
  const [style, setStyle] = useState({ display: 'none' })
  // Popup for error messages
  const [popup, setPopup] = useState("")
  const [errorStyle, setErrorStyle] = useState({ display: 'none' })

  const dayStart = 8 // 8 am
  const dayEnd = 20// 10 pm

 

  useEffect(() => {
    activeModalRef.current = activeModal;
  }, [activeModal]);

  useEffect(() => {
    modalAnswerRef.current = modalAnswer;
  }, [modalAnswer]);

  
  useEffect(() => {
    // this number should be the start of day
    calendarRef.current.scrollTop = 800
    setCurrentDates(getCurrentDates())

    const fetchEvents = async () => {
      try {
        // Loads events from Firestore
        
        const eventsFromData = await LoadEventsFromFirestore();
        
        setCalendarEvents(eventsFromData.fixedEvents);
        setFixedEvents(eventsFromData.fixedEvents);
        setFillerEvents(eventsFromData.fillerEvents);
        setTasks(eventsFromData.tasks);
      }
      catch (error) {
        console.log(" Error fetching events");
        throw error;
      }
    };
    fetchEvents();


  }, []);


  useEffect(()=>{
    
    if(zoningSchedule.length > 0){
      console.log("ZoningSchedule is changed")
      console.log(zoningSchedule)
      postZoningScheduleToFirestore(zoningSchedule)
    }
    
  

  },[zoningSchedule])

  function updateZoningSchedule(inputSchedule){
    
    setZoningSchedule(inputSchedule)
    
  }

  async function fetchZoningScheduleFromFirestore() {
    try {
        const zoningScheduleFromData = await LoadZoningScheduleFromFirestore();
        console.log(zoningScheduleFromData)
        if (zoningScheduleFromData.length > 0) {
            return zoningScheduleFromData[0].schedule;
        } else {
            return null;
        }
    } catch (error) {
        throw error;
    }
}




async function checkFirestoreForZoningSchedule() {
    const zoningSchedule = await fetchZoningScheduleFromFirestore();
    
    return zoningSchedule;
}


  

  function showModal() {

    setStyle({ display: 'block' })
  }


  function closeModal() {
    console.log(activeModal)
    setActiveModal(false)
    setStyle({ display: 'none' })
  }


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

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  //Function to ask prompts to the modal for additional information
  const aprompt = async (prompt) => {
    setActivePrompt(prompt);
    showModal();

    console.log("currentref : " + activeModalRef.current)


    while (activeModalRef.current) {
      console.log("here");
      await sleep(1000);
    }



    console.log("answer: " + modalAnswerRef.current);
    if (modalAnswer === "") {
      return -1;
    }


    return modalAnswerRef.current;
  };

  function handleFill(){
    callFillSchedule();
  }

  async function callFillSchedule(){
    console.log("fill schedule called")

    const data = async () => {
      try{
        const schedule = await fillSchedule(fillerEvents, fixedEvents, zoningSchedule)
        setCalendarEvents(currentEvents => {
          const updatedGeneratedEvents = schedule.generatedEvents.map(event => ({
            ...event,
            startTime: event.startTime + "-0400",
            endTime: event.endTime + "-0400"
          }));
          
          return [...fillerEvents, ...updatedGeneratedEvents];
        });
      
        console.log(schedule)
        return schedule
      }catch(error){
        throw error
      }
    }
    data();
  }

  //Function takes event sentence as input and adds an event to fixedEvents
  async function callBreakdown(eventDescription) {
    console.log("breakdown called")
    setActiveModal(true)
    const data = async () => {
      try {
        //Processed Event Decription (ped)
        const ped = await breakdownEventDescription(eventDescription, Date());

        //Update times to be pm if given
        if (ped.additionalPrompts.length > 0) {
          // Additional prompts will be of form [item, prompt]

          for (let prompt of ped.additionalPrompts) {
            console.log(prompt[1])
            const answer = await aprompt(prompt[1])
            if (answer === -1) {
              console.log("error")
              //exit breakdown
            }
            ped[prompt[0]] = answer
            console.log("line :" + answer)
          }
          // Pop up model with additional information to fill in?
        }



        const startDate = new Date(2023, ped.dateMonth, ped.dateDay)
        const [startHour, startMinute] = ped.startTime.split(":").map(Number)
        startDate.setHours(startHour, startMinute, 0, 0)
        const endDate = new Date(2023, ped.dateMonth, ped.dateDay)
        if (ped.endTime === "" || ped.endTime === null) {
          endDate.setHours(startHour + 1, startMinute, 0, 0)
        } else {
          const [endHour, endMinute] = ped.endTime.split(":").map(Number)
          endDate.setHours(endHour, endMinute, 0, 0)
        }

        console.log(startDate)
        console.log(endDate)

        const eventOverlap = assessNewEventTime(startDate, endDate)
        if (eventOverlap != null) {
          console.log("Couldn't add event due to event overlap")
          console.log("title: " + eventOverlap.title + " time:  " + eventOverlap.startTime)
          setPopup("Couldn't add event due to event overlap\ntitle: " + eventOverlap.title + " time:  " + eventOverlap.startTime + "-" + eventOverlap.endTime)
          setErrorStyle({ display: 'block' })
          // Pop Up Message
          //Exit 
        } else {
          addFixedEvents(ped.title, startDate, endDate, ped.dateDay);
        }
        //Add new event here

      } catch (error) {
        console.log("Error ", error)
      }
    }
    data();
  }


  function assessNewEventTime(startTime, endTime) {
    for (let event of fixedEvents) {
      // Check if events are on the same day
      if (event.startTime.toDateString() === startTime.toDateString()) {
        // Check if events overlap
        if ((startTime < event.endTime && endTime > event.startTime) ||
          (endTime > event.startTime && startTime < event.endTime)) {
          return event;
        }
      }
    }
    return null;
  }



  //Function removes fixed Events from firebase as well as state variables
  function removeFixedEvent(id, docRefNum) {
    deleteEventFromFirestore(docRefNum, 'fixedEvents')
    setFixedEvents(currentEvents => { return currentEvents.filter(event => event.id !== id) })
  }

  //Similar remove but for tasks
  function removeTask(id, docRefNum) {
    deleteEventFromFirestore(docRefNum, 'tasks')
    setTasks(currentTasks => { return currentTasks.filter(event => event.id !== id) })
  }

  //Similar remove but for filler events
  function removeFillerEvent(id, docRefNum) {
    deleteEventFromFirestore(docRefNum, 'fillerEvent')
    setFillerEvents(currentFillerEvents => { return currentFillerEvents.filter(event => event.id !== id) })
  }

  //Add for fixedEvents
  async function addFixedEvents(title, startTime, endTime, date) {

    const docRefNum = await postEventToFirestore(title, startTime, endTime, date);
    console.log(docRefNum)
    setFixedEvents(currentEvents => {
      return [...currentEvents,
      { id: crypto.randomUUID(), title: title, startTime: startTime, endTime: endTime, date: date, docRefNum: docRefNum }]
    })
  }

  //Add for fillerEvents
  async function addFillerEvent(title, duration, type) {
    const docRefNum = await postFillerEventToFirestore(title, duration, type);
    const id = crypto.randomUUID();
    setFillerEvents(currentFillerEvents => {
      return [...currentFillerEvents,
      { id: id, title: title, type: type, duration: duration, docRefNum: docRefNum }]
    })

  }

  //Add for tasks
  async function addTask(title, timeRequired, type) {
    const docRefNum = await postTaskToFirestore(title, timeRequired, type);
    setTasks(currentTasks => {
      return [...currentTasks,
      { id: crypto.randomUUID(), title: title, timeRequired: timeRequired, type: type, docRefNum: docRefNum }]
    })
  }

  function intToDay(i) {

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[i];
  }








  const handleScrollDate = () => {
    
    if (calendarRef.current) {
      calendarRef.current.scrollLeft = dateRef.current.scrollLeft;
    }
  };

  const handleScrollCalendar = () => {
    
    if (dateRef.current) {
      dateRef.current.scrollLeft = calendarRef.current.scrollLeft;
    }
  };





console.log(calendarEvents)

  return (
    <>
    <button onClick={handleFill}>HandleFill</button>
      <div className="error-element" style={errorStyle}>
        <div className='modal'>
          <div className="flex">

            <button className="btn-close" onClick={e => { setPopup(""); setErrorStyle({ display: 'none' }); }}>⨉</button>
          </div>

          <div>
            <h3>Error</h3>
            <p>
              {popup}
            </p>
          </div>

        </div>
        <div className='overlay'></div>
      </div>

      <div className="modal-element" style={style}>
        <div className="modal hidden" >
          <div className="flex">

            <button className="btn-close" onClick={e => { setModalAnswer(""); closeModal(); }}>⨉</button>
          </div>

          <div>
            <h3>Stay in touch</h3>
            <p>
              {activePrompt}
            </p>
          </div>

          <input value={modalAnswer} onChange={e => setModalAnswer(e.target.value)}
            type="email" id="email" placeholder="brendaneich@js.com" />
          <button className="btn" onClick={e => closeModal()}>Submit</button>


        </div>
        <div className="overlay hidden" ></div>
      </div>

      <div className="container">


      
       

        <div className='middle-side'></div>

        <div className="right-side">
          
          <div className="top-side">
          <Legend></Legend>
          
          <HeaderInfo callBreakdown={callBreakdown}></HeaderInfo>
          <NewFillerEventForm addFillerEvent={addFillerEvent}></NewFillerEventForm>    
      </div>

          <div className='calendar'>

            
            <div className='date-container'
              ref={dateRef}
              onScroll={handleScrollDate}>
              <div className='date'>

              </div>
              {currentDates.map(event => {
                return (<div className="date">
                  <p className="date-num">{intToDay(event.getDay())} </p>
                  <p className="date-day">{event.getDate()}</p>
                </div>)
              })}

            </div>


            <div className='days'
              ref={calendarRef}
              onScroll={handleScrollCalendar}>
                
      <Zoning 
      initialZoningSchedule={initialZoningSchedule}
        updateZoningSchedule={updateZoningSchedule}
        checkFirestoreForZoningSchedule={checkFirestoreForZoningSchedule}
        />
    
                
              <TimeList></TimeList>

              {
                currentDates.map(date => {
                  return (
                    
                    <div className='events'> 
                    
                   
                    
                    {calendarEvents.map(event => {
                    
                    const dateEvent = new Date(event.startTime + "-0400")
                    if ( dateEvent.getDate() === parseInt(date.getDate())) {
                      return <CalendarEvent event={event}>Helo</CalendarEvent>
                    }
                    return null;

                  })}</div> );

                })
              }



            </div>

          </div>
        </div>

      </div>
    </>)

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

  /* <div className='left-side'>
          <NewFixedEventForm addFixedEvents={addFixedEvents}></NewFixedEventForm>
          <button onClick={e => setDisplayFixed(!displayFixed)}>Display FixedEvents</button>
          {displayFixed && (<EventDisplay eventType={"fixedEvent"} events={fixedEvents} removeEvent={removeFixedEvent}></EventDisplay>)}

          <NewTaskForm addTask={addTask}></NewTaskForm>
          <button onClick={e => setDisplayTasks(!displayTasks)}>Display FixedEvents</button>
          {displayTasks && (<EventDisplay eventType={"task"} events={tasks} removeEvent={removeTask}></EventDisplay>)}

          <button onClick={e => setDisplayFiller(!displayFiller)}>Display FixedEvents</button>
          {displayFiller && (<EventDisplay eventType={"fillerEvent"} events={fillerEvents} removeEvent={removeFillerEvent}></EventDisplay>)}
        </div>*/