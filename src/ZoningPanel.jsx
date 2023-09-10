import TimeSelect from "./TimeSelect";
import { useEffect, useState } from "react";
import "./zoningPanel.css"
export default function ZoningPanel(props){
    /*
    props.categories [{type, hoursAllotted, timeOfDay}]
    hoursUnassigned 
    */
    const [hoursUnassigned,setHoursUnassigned] = useState(0)
    const [categoryClick, setCategoryClick] = useState(true)
    const [inputValue, setInputValue] = useState("")
    const [dayStart, setDayStart] = useState(8)
    const [dayEnd, setDayEnd] = useState(22)

    useEffect(()=>{
        
        const totalTime = dayEnd - dayStart
        const allottedTime = props.categories.reduce((accumulator, currentValue) => accumulator + currentValue.hoursAllotted, 0);
        setHoursUnassigned(totalTime - allottedTime)
    },[dayEnd,dayStart,props.categories])

    
    return(
    <div className="zoning-panel">
        <div className="zoning-panel-top">
            <div className="day-time">
                <div className="day-time-title"> Day Start</div>
                <TimeSelect time={dayStart} setTime={setDayStart}></TimeSelect>
            </div>
            <div className="day-time">
                <div className="day-time-title"> Day End</div>
                <TimeSelect time={dayEnd} setTime={setDayEnd}></TimeSelect>
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
                <div className="add-category-div">

                {categoryClick ? (
                <button className="add-category-btn" onClick={()=>setCategoryClick(false)}>ADD CATEGORY</button>)
                :
                (<div className="add-category-form">
                <button onClick={()=>setCategoryClick(true)}>X</button>
                
                <input className="add-category-input" value={inputValue} onChange={e => setInputValue(e.target.value)}></input>
                <button onClick={() => {props.handleAddCategory(inputValue);setInputValue("");}}>Submit</button>
                
                </div>)}  

                </div>
            </div>
            
            <div className="zoning-panel-block hours-allotted">
                
                {props.categories.map(category => {
                    return(<div className="hours-allotted-element">
                            <button className="hours-allotted-button" onClick={()=>props.subCategoryAllottedHour(category.key)}>-</button>
                            <div className="hours-allotted-int">{category.hoursAllotted}</div>
                            <button className="hours-allotted-button" onClick={()=>props.addCategoryAllottedHour(category.key)}>+</button>
                            </div>)
                })}
            </div>
            
            <div className="zoning-panel-block time-of-day">
                
                {props.categories.map(category => {
                    return(<select className="time-of-day-select" value={category.timeOfDay} onChange={e=>props.changeCategoryTimeOfDay(category.key, e.target.value)}>
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