import "./zoningModal.css"
import FillerPanel from "./FillerPanel.jsx"
/*Important for fade animations defined in zoningModal.css*/


export default function FillerModal(props){

    return(
        <>
        {props.fillerModalActive ? (<><div className="filler-modal fade-in-1">
        <div className="modal-element" >
          <FillerPanel categories={props.categories}
                       handleAddCategory={props.handleAddCategory}
                       addFillerEvent={props.addFillerEvent}>
                      
          </FillerPanel>

        </div>
        
      </div>
      <div className="modal-overlay fade-in-1-2" ></div></>) :
        
        (<><div className="filler-modal fade-out-1">
        <div className="modal-element" >
          

        </div>
        
      </div>
      <div className="modal-overlay fade-out-1-2" ></div></>)

      }
        
      </>)
          }