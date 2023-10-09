import { useEffect, useState } from "react"
import TimeSelect from "./TimeSelect"
import "./fillerPanel.css"
export default function FillerPanel(props){
    const [selectedCategory, setSelectedCategory] = useState('')
    const [title, setTitle] = useState('')
    const [selectedDuration, setSelectedDuration] = useState(15)

    
    useEffect(() => {
        if(selectedCategory === ''){
            if(props.categories.length > 0){
                setSelectedCategory(props.categories[0].type)
            }
        }
        
        
       
    },[])

    const handleSelectedCategory= (e) => {
        setSelectedCategory(e.target.value)
    };

    const handleSelectedDuration= (e) => {
        setSelectedDuration(e.target.value)
    };
    


    const handleSubmit = (e) => {
        e.preventDefault();
        props.addFillerEvent(title, selectedDuration, selectedCategory);
    };

    return(
        <div className="filler-panel">
            <div className="new-filler-event">
                New Filler Event
                <form className="new-filler-event-form" onSubmit={handleSubmit}>
                    Category
                    <select className="new-filler-event-form-category-select"
                            value={selectedCategory}
                            onChange={handleSelectedCategory}>
                        {props.categories.map(category => {
                            return(<option className="new-filler-event-form-category-select-option" value={category.type} key={category.type}>{category.type}</option>)
                        })}
                    </select>
                    Title
                    <input value={title} onChange={e => setTitle(e.target.value)}type="text" className="new-filler-event-form-title"></input>
                    Duration
                    <select className="new-filler-event-form-duration"
                            value={selectedDuration}
                            onChange={handleSelectedDuration}>
                        <option value={15} >15</option>
                        <option value={30} >30</option>
                        <option value={45} >45</option>
                        <option value={60} >1 hr</option>
                    </select>
                    <button className="new-filler-event-form-submit-btn">Submit</button>
                </form>


            </div>
            


        </div>
    
    
    
        )
}

/*<div className="view-filler-event">
                <button className="view-filler-event-btn"> View Filler Events </button>
            </div>*/