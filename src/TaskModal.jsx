import "./zoningModal.css"
import TaskPanel from "./TaskPanel.jsx"
/*Important for fade animations defined in zoningModal.css*/


export default function TaskModal(props){

  return(
    <>
        {props.taskModalActive ? (<><div className="task-modal fade-in-1">
        <div className="modal-element" >
          Coming Soon

        </div>
        
      </div>
      <div className="modal-overlay fade-in-1-2" ></div></>) :
        
        (<><div className="task-modal fade-out-1">
        <div className="modal-element" >
          

        </div>
        
      </div>
      <div className="modal-overlay fade-out-1-2" ></div></>)

      }
        
      </>)
    /*
    return(
        <>
        {props.taskModalActive ? (<><div className="task-modal fade-in-1">
        <div className="modal-element" >
          <TaskPanel categories={props.categories}
                       handleAddCategory={props.handleAddCategory}
                       addTask={props.addTask}>
                      
          </TaskPanel>

        </div>
        
      </div>
      <div className="modal-overlay fade-in-1-2" ></div></>) :
        
        (<><div className="task-modal fade-out-1">
        <div className="modal-element" >
          

        </div>
        
      </div>
      <div className="modal-overlay fade-out-1-2" ></div></>)

      }
        
      </>)*/
          }