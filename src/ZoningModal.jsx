
import { fillSchedule } from "./PythonCommunicaton"
import "./zoningModal.css"
import ZoningPanel from "./ZoningPanel"

export default function ZoningModal(props){

    return(
        <>
        {props.zoningModalActive ? (<><div className="zoning-modal fade-in-1">
        <div className="zoning-modal-element" >
          <ZoningPanel categories={props.categories}></ZoningPanel>

        </div>
        
      </div>
      <div className="zoning-modal-overlay fade-in-1-2" ></div></>) :
        
        (<><div className="zoning-modal fade-out-1">
        <div className="zoning-modal-element" >
          <div className="zoning-modal-btn-container">

            
          <button className="zoning-modal-btn-close" onClick={() => {props.setZoningModalActive(false)}}>⨉</button>
          </div>

          
          <div className="zoning-modal-form-group">
          
          
          </div>
          
          <button className="modal-btn-submit" onClick={props.handleFill()} >Submit</button>

        </div>
        
      </div>
      <div className="zoning-modal-overlay fade-out-1-2" ></div></>)

      }
        
      </>)
          }