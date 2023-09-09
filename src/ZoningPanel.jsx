import TimeSelect from "./TimeSelect";
import { useState } from "react";
import "./zoningPanel.css"
export default function ZoningPanel(props){
    /*
    props.categories [{type, hoursAllotted, timeOfDay}]
    hoursUnassigned 
    */
    const [hoursUnassigned,setHoursUnassigned] = useState(0)
    return(
    <div className="zoning-panel">
        <div className="zoning-panel-top">
            <div className="day-time">
                <div className="day-time-title"> Day Start</div>
                <TimeSelect></TimeSelect>
            </div>
            <div className="day-time">
                <div className="day-time-title"> Day End</div>
                <TimeSelect></TimeSelect>
            </div>
            <div className="hours-unassigned">
                Hours Unassigned
                <div className="hours-unassigned-int">
                    {hoursUnassigned}
                </div>
            </div>
        </div>
        <div className="zoning-panel-block-titles">
            <div className="block-title">Category</div>
            <div className="block-title">Hours Allotted</div>
            <div className="block-title">Time of Day</div>
        </div>
        <div className="zoning-panel-bottom">
            
            <div className="zoning-panel-block category">
                
                {props.categories.map(category => {
                    return(<div className="category-element">{category.type}</div>)
                        }
                    )
                }
                <button className="add-button">ADD CATEGORY</button>
            </div>
            
            <div className="zoning-panel-block hours-allotted">
                
                {props.categories.map(category => {
                    return(<div className="hours-allotted-element">
                            <button className="hours-allotted-button">-</button>
                            <div className="hours-allotted-int">{category.hoursAllotted}</div>
                            <button className="hours-allotted-button">+</button>
                            </div>)
                })}
            </div>
            
            <div className="zoning-panel-block time-of-day">
                
                {props.categories.map(category => {
                    return(<select value={category.timeOfDay}>
                        <option>any</option>
                        <option>morning</option>
                        <option>afternoon</option>
                        <option>evening</option>
                    </select>)
                })}
            </div>
        </div>


    </div>
    )

}