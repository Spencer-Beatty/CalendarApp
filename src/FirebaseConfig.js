// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
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
  export const postEventToFirestore = async (eventTitle, eventStartTime) => {
    const db = getFirestore();

    // Specify the collection where you want to store events
    const eventsCollection = collection(db, 'events');

    // Create an object with event details to be stored in Firestore
    const newEvent = {
      title: eventTitle,
      startTime: eventStartTime,
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

  export const LoadEventsFromFirestore = async () => {
    const db = getFirestore();

    const eventsCollection = collection(db, 'events');

    try {
        const querySnapshot = await getDocs(eventsCollection);
        
        const events = querySnapshot.docs.map((doc) => ({
        
            id:crypto.randomUUID(), docRefNum: doc.id, ... doc.data()
        }))

        return events;
    }catch(error){
        console.log("Load from firebase failed");
        throw error;
    }
    
  };

 

  export const deleteEventFromFirestore= async (docRefNum) => {
    
    const db = getFirestore(app);
    const eventsCollection = collection(db, 'events');

    try {
      console.log(docRefNum)
      const eventRef = doc(eventsCollection, docRefNum);
      await deleteDoc(eventRef);
      
      console.log('Event '+docRefNum+' deleted from Firestore successfully');
    } catch (error) {
      console.error('Error deleting event: ', error);
    }
  };


  export const postFillerEventToFirestore = async (title, duration, type) => {
    const db = getFirestore();

    // Specify the collection where you want to store events
    const eventsCollection = collection(db, 'fillerEvent');

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