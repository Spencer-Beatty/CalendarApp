
import "./zoningModal.css"
export default function ZoningModal(props){

    return(
        <>
        <div className="zoning-modal">
        <div className="zoning-modal-element" >
          <div className="zoning-modal-btn-container">

            
          <button className="zoning-modal-btn-close" onClick={() => {props.setZoningModalActive(false)}}>⨉</button>
          </div>

          
          <div className="zoning-modal-form-group">
          
          
          </div>
          
          <button className="modal-btn-submit"  >Submit</button>

        </div>
        
      </div>
      <div className="modal-overlay" ></div>
      </>)
          }