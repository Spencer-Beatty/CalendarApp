import { useState, useEffect, useRef } from 'react'


import { NewFixedEventForm } from "./NewFixedEventForm"
import { NewFillerEventForm } from "./NewFillerEventForm"
import { NewTaskForm } from './NewTaskForm'
import { Event } from "./Event"
import { HeaderInfo } from './HeaderInfo'
import { TimeList } from './TimeList'
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import firebaseApp, { postEventToFirestore, deleteEventFromFirestore, LoadEventsFromFirestore, postZoningScheduleToFirestore,LoadZoningScheduleFromFirestore} from './FirebaseConfig.js';
import { postFillerEventToFirestore } from './FirebaseConfig.js';
import { postTaskToFirestore, postCategoryToFirestore, postCategoryTimeOfDayToFirestore, postCategoryHoursAllottedToFirestore } from './FirebaseConfig.js';
import ZoningModal from "./ZoningModal"
import FillerModal from "./FillerModal"
import TaskModal from "./TaskModal"
import { Zoning } from './Zoning'



import { EventDisplay } from "./EventDisplay"
import { Legend } from './Legend'

import Modal from './Modal.jsx'


import { CalendarEvent } from "./CalendarEvent"

import { breakdownEventDescription,  fillSchedule  } from './PythonCommunicaton'

import "./app.css"



function getDate() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  return `${month}/${date}/${year}`;
}





export default function CalendarElement(props) {

  const monthChart = ["January", "February", "March", "April","May", "June", 
   "July", "August", "September", "October", "November", "December"]
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

  const [eventModalActive,setEventModalActive] = useState(false)
  const [zoningModalActive, setZoningModalActive] = useState(false)
  const [fillerModalActive, setFillerModalActive] = useState(false)
  const [taskModalActive, setTaskModalActive] = useState(false)

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

  //References for left-tab-options
  const calRef = useRef(null)
  const zoneRef = useRef(null)
  const fillRef = useRef(null)
  const taskRef = useRef(null)
 
  const [leftTabOption, setLeftTabOption] = useState(calRef)

  const [leftTabTop, setLeftTabTop] = useState(0)
  const [leftTabBottom, setLeftTabBottom] = useState(0)

  const dayStart = 8 // 8 am
  const dayEnd = 20// 10 pm
  const hourHeight=150;

  const [categories, setCategories] = useState([])
  const [typeToColorMap, setTypeToColorMap] = useState({})

  const [deleteMode, setDeleteMode] = useState(false)
  const [deleteStack, setDeleteStack] = useState([])

  const currentPath = window.location.pathname;

  
  
  useEffect(() => {
    // Create a copy of the existing typeToColorMap
    const updatedTypeToColorMap = { ...typeToColorMap };
  
    // Iterate through categories
    categories.forEach(category => {
      // Check if the category is not already in typeToColorMap
      if (!updatedTypeToColorMap[category.type]) {
        // Assign a color to the category (e.g., 'red')
        updatedTypeToColorMap[category.type] = getRandomColor();
      }
    });
  
    // Update the state with the updated typeToColorMap
    setTypeToColorMap(updatedTypeToColorMap);
  }, [categories]);

  function getRandomColor() {
    const letters = 'BCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 5)];
    }
    return color;
  }

  useEffect(() => {
    activeModalRef.current = activeModal;
  }, [activeModal]);

  useEffect(() => {
    modalAnswerRef.current = modalAnswer;
  }, [modalAnswer]);

  
  useEffect(() => {
    // this number should be the start of day
    calendarRef.current.scrollTop = dayStart * hourHeight
    setCurrentDates(getCurrentDates())

    const fetchEvents = async () => {
      try {
        // Loads events from Firestore
        
        const currentDate = new Date()
        const yesterday = new Date(currentDate);
        yesterday.setDate(currentDate.getDate() - 1);

        const eventsFromData = await LoadEventsFromFirestore(props.loginName);
        const filteredFixedEvents = eventsFromData.fixedEvents.filter(event => new Date(event.startTime) > yesterday )
        setCategories(eventsFromData.categories);
        setCalendarEvents(filteredFixedEvents);
        setFixedEvents(filteredFixedEvents);
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

  async function handleRemoveCategory(categoryToBeDeleted){
      try{
        deleteEventFromFirestore(categoryToBeDeleted.docRefNum, "categories", props.loginName);
        
        const updatedCategories = categories.filter((category) => category.docRefNum !== categoryToBeDeleted.docRefNum);
        
        setCategories(updatedCategories)
      }catch(e){
        console.error("Couldn't delete properly", e)
      }
      
     
    
  }

  async function handleAddCategory(newCategoryName){
    

    const matchingName = categories.filter((category) => category.type === newCategoryName)
    console.log(matchingName)
    if(matchingName.length > 0){
      console.log("No bueno, this name already exists " + newCategoryName )
    }
    if(props.loginName !== "to test mode"){
    const docRefNum = await postCategoryToFirestore(newCategoryName, 0, "any", props.loginName);
    

    console.log(categories)

    const newCategory = {
      docRefNum: docRefNum,
      key: crypto.randomUUID(),
      type: newCategoryName,
      hoursAllotted: 0,
      timeOfDay: "any"
    }
    setCategories(currentCategories => {
      return([...currentCategories, newCategory])
    })
    }else{
        const newCategory = {
            docRefNum: 1,
            key: crypto.randomUUID(),
            type: newCategoryName,
            hoursAllotted: 0,
            timeOfDay: "any"
          }

        setCategories(currentCategories => {
            return([...currentCategories, newCategory])
        })
    }
    

  }

  function changeCategoryTimeOfDay(keyId, newTimeOfDay){
    setCategories(categories.map(category => {
    
      if(category.key === keyId){
        postCategoryTimeOfDayToFirestore(category.docRefNum, newTimeOfDay, props.loginName);
        const newCategory = {
          docRefNum: category.docRefNum,
          key: keyId,
          type: category.type,
          hoursAllotted: category.hoursAllotted,
          timeOfDay: newTimeOfDay
        }
        
          
        return newCategory
      }else{
        return category
      }
    }))

  }

  function addCategoryAllottedHour(keyId){
    setCategories(categories.map(category => {

      if(category.docRefNum === keyId){
        if(props.loginName !== "to test mode"){
        postCategoryHoursAllottedToFirestore(category.docRefNum, category.hoursAllotted + 1, props.loginName)
        }
        const newCategory = {
          docRefNum: category.docRefNum,
          key: keyId,
          type: category.type,
          hoursAllotted: category.hoursAllotted + 1,
          timeOfDay: category.timeOfDay
        }
        return newCategory
      }else{
        return category
      }
    }))

  }

  function subCategoryAllottedHour(keyId){
    setCategories(categories.map(category => {

      if(category.docRefNum === keyId){
        if(props.loginName !== "to test mode"){
        postCategoryHoursAllottedToFirestore(category.docRefNum, category.hoursAllotted - 1, props.loginName)
        }
        const newCategory = {
          docRefNum: category.docRefNum,
          key: keyId,
          type: category.type,
          hoursAllotted: category.hoursAllotted - 1,
          timeOfDay: category.timeOfDay
        }
        return newCategory
      }else{
        return category
      }
    }))

  }

  useEffect(()=>{
    
    if(zoningSchedule.length > 0){
      console.log("ZoningSchedule is changed")
      console.log(zoningSchedule)
      if(props.loginName !== "to test mode"){
      postZoningScheduleToFirestore(zoningSchedule)
      }
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
    for (let i = 0; i < 5; i++) {
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

  function chooseColor(type){
      if(type === 'fixed'){
        return "lightblue"
      }
      return typeToColorMap[type]
  }
  async function callFillSchedule(){
    console.log("fill schedule called")

    const data = async () => {
      try{
        const schedule = await fillSchedule(fillerEvents, calendarEvents, tasks, categories)
        setCalendarEvents(currentEvents => {
          const updatedGeneratedEvents = schedule.generatedEvents.map(event => ({
            ...event,
            id: crypto.randomUUID(),
            startTime: event.startTime,
            endTime: event.endTime,
            styleColor: chooseColor(event.type)
          }));

          const updatedFixedEvents = fixedEvents.map(event => ({
            ...event,
            startTime: event.startTime,
            endTime: event.endTime,
            styleColor: chooseColor("fixed")
          }))
          
          return [...calendarEvents, ...updatedGeneratedEvents];
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


        //TODO look into 2023 vs getFullYear
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
    deleteEventFromFirestore(docRefNum, 'fixedEvents', props.loginName)
    setFixedEvents(currentEvents => { return currentEvents.filter(event => event.id !== id) })
  }

  //Similar remove but for tasks
  function removeTask(id, docRefNum) {
    deleteEventFromFirestore(docRefNum, 'tasks', props.loginName)
    setTasks(currentTasks => { return currentTasks.filter(event => event.id !== id) })
  }

  //Similar remove but for filler events
  function removeFillerEvent(id, docRefNum) {
    deleteEventFromFirestore(docRefNum, 'fillerEvent', props.loginName)
    setFillerEvents(currentFillerEvents => { return currentFillerEvents.filter(event => event.id !== id) })
  }

  //Add for fixedEvents
  async function addFixedEvents(title, startTime, endTime, date) {
    //Example colour trying blue
    if(props.loginName !== "to test mode"){
    const docRefNum = await postEventToFirestore(title, startTime, endTime, date, props.loginName);

    console.log(docRefNum)
    const newFixedEvent = { id: crypto.randomUUID(), title: title, startTime: startTime, endTime: endTime, date: date, docRefNum: docRefNum }
    setFixedEvents(currentEvents => {
      return [...currentEvents, newFixedEvent]
    })
    setCalendarEvents(currentEvents =>{
      return [...currentEvents, newFixedEvent]
    })
    }else{
        const docRefNum  =1
        console.log(docRefNum)
    const newFixedEvent = { id: crypto.randomUUID(), title: title, startTime: startTime, endTime: endTime, date: date, docRefNum: docRefNum }
    setFixedEvents(currentEvents => {
      return [...currentEvents, newFixedEvent]
    })
    setCalendarEvents(currentEvents =>{
      return [...currentEvents, newFixedEvent]
    })
    }
  }

  

  //Add for fillerEvents
  async function addFillerEvent(title, duration, type) {
    if(props.loginName !== "to test mode"){
    const docRefNum = await postFillerEventToFirestore(title, duration, type, props.loginName);
    const id = crypto.randomUUID();
    setFillerEvents(currentFillerEvents => {
      return [...currentFillerEvents,
      { id: id, title: title, type: type, duration: duration, docRefNum: docRefNum }]
    })
    }else{
        const docRefNum = 1;
    const id = crypto.randomUUID();
    setFillerEvents(currentFillerEvents => {
      return [...currentFillerEvents,
      { id: id, title: title, type: type, duration: duration, docRefNum: docRefNum }]
    })

    }

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

  function removeCalendarEvent(id){
    if(deleteMode){
      const calendarEvent = calendarEvents.find(event => event.id === id)
      const filteredCalendarEvents = calendarEvents.filter(event => event.id !== id)
      setCalendarEvents(filteredCalendarEvents)
      setDeleteStack((currentDeleteStack => {
        return [... currentDeleteStack, calendarEvent]
      }))
    } 
  }

  function undoDelete(){
    if(deleteStack.length > 0){
      const eventToBeUndone = deleteStack[deleteStack.length-1]
      setCalendarEvents(currentevents => {
        return [... currentevents, eventToBeUndone]
      })
      setDeleteStack(deleteStack.slice(0,-1))
    }
  }

  function toggleDelete(){
    setDeleteMode(!deleteMode)
  }
  

  useEffect(() => {
    console.log(window.innerHeight)
    console.log(leftTabOption.current.getBoundingClientRect().top)
    if(leftTabOption.current) {
      const rect = leftTabOption.current.getBoundingClientRect();
      
      
      setZoningModalActive(false)
      setFillerModalActive(false)
      setTaskModalActive(false)
      if(leftTabOption === zoneRef){
        setZoningModalActive(true)
      }else if(leftTabOption === fillRef){
        setFillerModalActive(true)
      }else if(leftTabOption === taskRef){
        setTaskModalActive(true)
      }

      
     
      setLeftTabTop(rect.top)
      setLeftTabBottom(rect.bottom )
    }
  }, [leftTabOption])



  useEffect(() => {
    console.log("lefttabbottom: " + leftTabBottom)
  }, [leftTabBottom])

  useEffect(() => {
    console.log("thurs")
    const thurs = calendarEvents.filter(event =>  event.date===21 )
    console.log(thurs)
  },[calendarEvents])

  console.log(calendarEvents)


console.log(typeToColorMap)


  return (
    <>
      {eventModalActive && <Modal callBreakdown={callBreakdown} setEventModalActive={setEventModalActive}></Modal>}
      <ZoningModal zoningModalActive={zoningModalActive}
                  setZoningModalActive={setZoningModalActive} 
                  handleFill={handleFill}
                  categories={categories}
                  handleAddCategory={handleAddCategory}
                  changeCategoryTimeOfDay={changeCategoryTimeOfDay}
                  addCategoryAllottedHour={addCategoryAllottedHour}
                  subCategoryAllottedHour={subCategoryAllottedHour}
                  handleRemoveCategory={handleRemoveCategory}>
      </ZoningModal>

      <FillerModal fillerModalActive={fillerModalActive}
                   setFillerModalActive={setFillerModalActive}
                   categories={categories}
                   handleAddCategory={handleAddCategory}
                   addFillerEvent={addFillerEvent}>          
      </FillerModal>

      <TaskModal taskModalActive={taskModalActive}
                 setTaskModalActive={setTaskModalActive}
                 categories={categories}
                 handleAddCategory={handleAddCategory}
                 addTask={addTask}>

      </TaskModal>


      <div className="page">
        
        <div className='left-tab'>
        
        
            <div className="left-tab-top" style={{ top : 0 , height : leftTabTop}}></div> 
            
            <div  className='left-tab-option-container'>
            <div>
              <div className='welcome-text'>Welcome {props.loginName}</div>
              <div className='toggle-delete-div'>
                <button className='toggle-delete-btn' onClick={() => toggleDelete()}>Toggle Delete</button>
                <>{deleteMode ? (<div className='del-active'>Delete Mode is Active</div>) :
                              (<div className='view-active'>View Mode is Active</div>)}</>
                <button className='undo-btn' onClick={() => undoDelete()}>Undo</button>
              </div>
              </div>
              <button ref={calRef} className="left-tab-option" onClick={e => setLeftTabOption(calRef)}>Calendar</button>
              <button ref={zoneRef} className="left-tab-option" onClick={e => setLeftTabOption(zoneRef)}>Zoning</button>  
              <button ref={fillRef} className="left-tab-option" onClick={e => setLeftTabOption(fillRef)}>Filler</button>
              <button ref={taskRef} className="left-tab-option" onClick={e => setLeftTabOption(taskRef)}>Task</button>  
            </div>

            <div className="left-tab-bottom" style={{top: leftTabBottom}}></div>   
        </div>

        <div className="right-tab">
          
          <div className='right-tab-header'>
              <div className='month-year'>{monthChart[new Date().getMonth()]} {new Date().getFullYear()}</div>
              <button className='add-new-event-btn grey' onClick={e=>handleFill()}>Fill Calendar</button>
              <button className='add-new-event-btn grey' onClick={e=>setCalendarEvents(fixedEvents)}>Un-Fill Calendar</button>
              <button className='add-new-event-btn' onClick={e => setEventModalActive(true)}>Add New Event</button>
              
          </div>

          <div className='calendar'>
            
            
            <div className='date-container'
              ref={dateRef}
              onScroll={handleScrollDate}>
              {currentDates.map(event => {
                return (<div className="date">
                  <div className="date-num">{event.getDate()}</div>
                  <div className="date-day">{intToDay(event.getDay())} </div>
                  <div className='date-nib'></div>
                </div>)
              })}

            </div>
            
            
            <div className='day-container'
              ref={calendarRef}
              onScroll={handleScrollCalendar}>
              <TimeList hourHeight={hourHeight}></TimeList>
      
    
                
              

              {
                currentDates.map(date => {
                  return (
                    
                    <div className='events'> 
                    
                   
                    
                    {calendarEvents.map(event => {
                    
                    const dateEvent = new Date(event.startTime + "-0400")
                    if ( dateEvent.getDate() === parseInt(date.getDate())) {
                      return <CalendarEvent removeEvent={removeCalendarEvent} event={event} hourHeight={hourHeight} backgroundColor={event.styleColor}>Helo</CalendarEvent>
                    }
                    return null;

                  })}</div> );

                })
              }



            </div>

          </div>
          
        </div>

      </div>
        </>
      )

}