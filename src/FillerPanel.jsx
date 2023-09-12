import TimeSelect from "./TimeSelect"
import "./fillerPanel.css"
export default function FillerPanel(props){
    return(
        <div className="filler-panel">
            <div className="new-filler-event">
                New Filler Event
                <form className="new-filler-event-form">
                    Category
                    <select className="new-filler-event-form-category-select">
                        {props.categories.map(category => {
                            return(<option className="new-filler-event-form-category-select-option" value={category.type}>{category.type}</option>)
                        })}
                    </select>
                    Title
                    <input type="text" className="new-filler-event-form-title"></input>
                    Duration
                    <select className="new-filler-event-form-duration">
                        <option >1</option>
                    </select>
                    <button className="new-filler-event-form-submit-btn">Submit</button>
                </form>


            </div>
            <div className="view-filler-event">
                <button className="view-filler-event-btn"> View Filler Events </button>
            </div>


        </div>
    
    
    
        )
}