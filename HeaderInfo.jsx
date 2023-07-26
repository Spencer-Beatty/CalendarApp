import React from "react"
import "./app.css"
export function HeaderInfo() {
return( <><div className="calendar-header">
        <h1 className = "header title">Welcome Back</h1>
        <p className="header copy"> Calendar Plan</p>
      </div>

      <div className="calendar-plan">
        <div className="cl-plan">
          <div className="cl-title">Today</div>
          <div className="cl-copy">22nd  April  2018</div>
          <div className="cl-add">
            <i className="fas fa-plus"></i>
          </div>
        </div>
      </div>
      </>
)};