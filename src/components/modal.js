import React, { useRef } from "react";

function Modal(props){

  const refClose = useRef(null);

  function handleClick(){
    props.update(props.index);
    refClose.current.click();
  }

    return(
      <>
      <button type="button" className="btn btn-primary d-none"  ref={props.modalRef} data-bs-toggle="modal" data-bs-target="#exampleModal">Launch Demo Modal</button>  

      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Note</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form>
              <input name="eTitle" onChange={props.handleChange} value={props.items.eTitle} placeholder="Title" />
              <textarea name="eContent" onChange={props.handleChange} value={props.items.eContent} placeholder="Take a note..." rows="1" />
            </form>
            <div className="modal-footer">
              <button ref={refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" onClick={handleClick} className="btn btn-primary">Update Note</button>
            </div>
          </div>
        </div>
      </div>
    </>
    );
}

export default Modal;