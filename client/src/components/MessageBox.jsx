import React from "react";

function MessageBox(props) {
  return (
    <>
      <div className={`alert alert-${props.variant || "normal"}`}>
        {/* {props.variant === "info" && <i class="fas fa-info"></i>}
        {props.variant === "danger" && <i class="fas fa-exclamation"></i>}
        {props.variant === "success" && <i class="fas fa-check"></i>} */}
        {/* &nbsp;&nbsp;&nbsp; */}
        {props.children}
      </div>
    </>
  );
}

export default MessageBox;
