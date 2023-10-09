// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc, deleteDoc, doc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBAH94coCnza50bxfu8nnW71kAjPh-xkp0",
  authDomain: "calendar-app-d2a74.firebaseapp.com",
  projectId: "calendar-app-d2a74",
  storageBucket: "calendar-app-d2a74.appspot.com",
  messagingSenderId: "335108617121",
  appId: "1:335108617121:web:246ccb89eac71a5e7d51e0",
  measurementId: "G-5ZR20VWV4K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export default app;

export function database() {
    return getFirestore(app);
  }
  // Comment
  export const postEventToFirestore = async (title, startTime, endTime, date, name) => {
    const db = getFirestore();

    const fe = 'fixedEvents' + "-" + name
    // Specify the collection where you want to store events
    const eventsCollection = collection(db, fe);

    // Create an object with event details to be stored in Firestore
    const newEvent = {
      title: title,
      startTime: startTime,
      endTime: endTime,
      date: date
    };

    try {
      // Add the new event to the Firestore collection
      const docRef = await addDoc(eventsCollection, newEvent);
      console.log('Event added with ID: ', docRef.id);
      return docRef.id;
      
    } catch (error) {
      console.error('Error adding event: ', error);
      
    }

    
  };

  export const LoadEventsFromFirestore = async (name) => {

    // Will load all data and then pass it back to be set to all state variables
    const db = getFirestore();
    const fe = 'fixedEvents' + "-" + name
    const ca = "categories" + "-" + name
    const fillername = 'fillerEvents' + "-" + name
    const fixedEventsCollection = collection(db, fe);
    const fillerEventsCollection = collection(db, fillername);
    const tasksCollection = collection(db, 'tasks');
    const categoriesCollection = collection(db, ca);
    

    

    try {
        const fixedQuerySnapshot = await getDocs(fixedEventsCollection);
        const fillerQuerySnapshot = await getDocs(fillerEventsCollection);
        const tasksQuerySnapshot = await getDocs(tasksCollection);
        const categoriesQuerySnapshot = await getDocs(categoriesCollection);


        const fixedEvents = fixedQuerySnapshot.docs.map((doc) => {
          const data = doc.data();
      
          // Convert Timestamp to JavaScript Date objects
          const startTime = data.startTime ? data.startTime.toDate() : null;
          const endTime = data.endTime ? data.endTime.toDate() : null;
      
          return {
              id: crypto.randomUUID(),
              docRefNum: doc.id,
              ...data,
              startTime,  // Override with the converted startTime
              endTime     // Override with the converted endTime
          };
      });

        const fillerEvents = fillerQuerySnapshot.docs.map((doc) => ({
        
          id:crypto.randomUUID(), docRefNum: doc.id, ... doc.data()
      }))

      const tasks = tasksQuerySnapshot.docs.map((doc) => ({
        
        id:crypto.randomUUID(), docRefNum: doc.id, ... doc.data()
    }))

      const categories = categoriesQuerySnapshot.docs.map((doc) => ({
        id:crypto.randomUUID(), docRefNum: doc.id, ... doc.data()
      }))



        const eventsHolder=  {
          fixedEvents: fixedEvents,
          fillerEvents : fillerEvents,
          tasks : tasks,
          categories: categories,
    
        }

        return eventsHolder;
    }catch(error){
        console.log("Load from firebase failed");
        throw error;
    }
    
  };

  export const LoadZoningScheduleFromFirestore = async () => {
    const db = getFirestore();  
    try{
      const zoningQuerySnapshot = await getDocs(collection(db, "Settings"))
    const zoningSchedule = zoningQuerySnapshot.docs.map((doc) => ({
      id:crypto.randomUUID(), docRefNum: doc.id, ... doc.data()
    }))
    console.log(zoningSchedule)
    return zoningSchedule
    }catch(error){

    }
    
    

  };
 

  export const deleteEventFromFirestore= async (docRefNum, eventType, name) => {
    
    const db = getFirestore(app);

    const col = eventType + "-" + name
    const eventsCollection = collection(db, col);

    try {
      console.log(docRefNum)
      const eventRef = doc(eventsCollection, docRefNum);
      await deleteDoc(eventRef);
      
      console.log('Event '+docRefNum+' deleted from Firestore successfully');
    } catch (error) {
      console.error('Error deleting event: ', error);
    }
  };

  export const postZoningScheduleToFirestore = async(zoningSchedule) => {
    const db = getFirestore();
    
    const newZoningSchedule = {
      schedule: zoningSchedule
    }
    if(zoningSchedule===undefined){
      throw new Error("Zoning Schedule is undefined")
      
    }
    // Specify the collection where you want to store events
    const zoningCollection = collection(db, 'Settings');
    try{
      const docRef = await setDoc(doc(db, "Settings", "ZoningSchedule"), newZoningSchedule)
      return docRef
    }catch(error){
      throw error
    }
    
  };

  export const postFillerEventToFirestore = async (title, duration, type, name) => {
    const db = getFirestore();

    // Specify the collection where you want to store events
    const fillName = "fillerEvents" + "-" + name
    const eventsCollection = collection(db, fillName);

    const newFillerEvent = {
        title: title,
        duration: duration,
        type: type
    }

    try {
        const docRef = await addDoc(eventsCollection, newFillerEvent);
        console.log('FillerEvent added with ID: ', docRef.id);
        return docRef.id;
    }catch(error){
        console.log("error adding newFillerEvent");
        throw(error);
    }
  };

  export const postCategoryToFirestore = async (type, hoursAllotted, timeOfDay, name) => {
    const db = getFirestore();

    // Specify the collection where you want to store events
    const ca = "categories" + "-" + name
    const eventsCollection = collection(db, ca);

    const newCategory = {
        type: type,
        hoursAllotted: hoursAllotted,
        timeOfDay: timeOfDay
    }

    try {
        const docRef = await addDoc(eventsCollection, newCategory);
        console.log('Category added with ID: ', docRef.id);
        return docRef.id;
    }catch(error){
        console.log("error adding new Category");
        throw(error);
    }
  };

  export const postCategoryTimeOfDayToFirestore = async (docRefNum, newTimeOfDay, name) => {
    const db = getFirestore();

    // Specify the collection where you want to store events
    const ca = "categories" + "-" + name
    const categoriesCollection = collection(db, ca);

    try {
      console.log(docRefNum)
      const categoryRef = doc(categoriesCollection, docRefNum);
      await updateDoc(categoryRef, {
        timeOfDay:newTimeOfDay,
      });
      
      console.log('Category '+docRefNum+' updated from Firestore successfully');
    } catch (error) {
      console.error('Error updating category: ', error);
    }

  };

  export const postCategoryHoursAllottedToFirestore = async (docRefNum, newHoursAllotted, name) => {
    const db = getFirestore();

    // Specify the collection where you want to store events
    const ca = "categories" + "-" + name
    const categoriesCollection = collection(db, ca);

    try {
      console.log(docRefNum)
      const categoryRef = doc(categoriesCollection, docRefNum);
      await updateDoc(categoryRef, {
        hoursAllotted:newHoursAllotted,
      });
      
      console.log('Category '+docRefNum+' updated from Firestore successfully');
    } catch (error) {
      console.error('Error updating category: ', error);
    }

  };

  export const postTaskToFirestore = async (title, timeRequired, type) => {
    const db = getFirestore();

    // specify which colllection in this case tasks, matches state variable in App.jsx
    const eventsCollection = collection(db, 'tasks');

    //build prototype
    const newTask = {
        title: title,
        timeRequired: timeRequired,
        type: type
    }
    try {
        const docRef = await addDoc(eventsCollection, newTask);
        console.log('Task added with ID: ', docRef.id);
        return docRef.id;
    }catch(error){
        console.log("error adding newTask");
        throw(error);
    }
  };
  

  export const deleteTaskFromFirestore = async (docRefNum) => {
    const db = getFirestore(app);
    const eventsCollection = collection(db, 'tasks');

    try {
      console.log(docRefNum)
      // Collect event reference from correct collection and then delete
      const eventRef = doc(eventsCollection, docRefNum);
      await deleteDoc(eventRef);
      
      console.log('Event '+docRefNum+' deleted from Firestore successfully');
    } catch (error) {
      console.error('Error deleting event: ', error);
    }
  };



  
  const style = {
    position: `absolute`,
    top: `${top}px`
  };




// Example usage: Get all documents from a collection


//const analytics = getAnalytics(app);