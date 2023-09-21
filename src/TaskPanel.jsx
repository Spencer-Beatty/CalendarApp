import { useEffect, useState} from "react"
import "./taskPanel.css"
export default function TaskPanel(props){
    const [selectedCategory, setSelectedCategory] = useState('')
    const [title, setTitle] = useState('')
    const [selectedDuration, setSelectedDuration] = useState('')

    
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
        props.addTask(title, selectedDuration, selectedCategory)
        console.log(selectedCategory)
    };

    return( 
    <div className="task-panel">
    <div className="new-task-event">
        New Task
        <form className="new-task-event-form" onSubmit={handleSubmit}>
            Category
            <select className="new-task-event-form-category-select"
                    value={selectedCategory}
                    onChange={handleSelectedCategory}>
                {props.categories.map(category => {
                    return(<option className="new-task-event-form-category-select-option" value={category.type} key={category.type}>{category.type}</option>)
                })}
            </select>
            Title
            <input type="text" className="new-task-event-form-title" value={title} onChange={e => setTitle(e.target.value)}></input>
            Hours Required
            <select className="new-task-event-form-duration"
                    value={selectedDuration}
                    onChange={handleSelectedDuration}>
                <option >1</option>
                <option >2</option>
                <option >3</option>
            </select>
            <button className="new-task-event-form-submit-btn">Submit</button>
        </form>


    </div>
    <div className="view-task-event">
        <button className="view-task-event-btn"> View Task Events </button>
    </div>


</div>)
}