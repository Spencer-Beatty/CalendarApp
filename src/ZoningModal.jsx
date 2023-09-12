
import { fillSchedule } from "./PythonCommunicaton"
import "./zoningModal.css"
import ZoningPanel from "./ZoningPanel"

export default function ZoningModal(props){

    return(
        <>
        {props.zoningModalActive ? (<><div className="zoning-modal fade-in-1">
        <div className="modal-element" >
          <ZoningPanel categories={props.categories}
                       handleAddCategory={props.handleAddCategory}
                       changeCategoryTimeOfDay={props.changeCategoryTimeOfDay}
                       addCategoryAllottedHour={props.addCategoryAllottedHour}
                       subCategoryAllottedHour={props.subCategoryAllottedHour}>
                      
          </ZoningPanel>

        </div>
        
      </div>
      <div className="modal-overlay fade-in-1-2" ></div></>) :
        
        (<><div className="zoning-modal fade-out-1">
        <div className="modal-element" >
          

        </div>
        
      </div>
      <div className="modal-overlay fade-out-1-2" ></div></>)

      }
        
      </>)
          }