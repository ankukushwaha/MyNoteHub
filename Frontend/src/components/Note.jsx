import React, {useRef,  useState, useEffect} from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import EditNoteIcon from '@mui/icons-material/EditNote';

function Note(props) {
  const modalRef = useRef(null);
  const refClose = useRef(null);
  
  const [eItems, eSetItems] = useState({
    id:"",
    eTitle: "",
    eContent: "",
    eTag: ""
  })
  
  useEffect(() => {
    eSetItems({
      id: props.note._id,
      eTitle: props.note.title,
      eContent: props.note.content,
      eTag: props.note.tag,
    });
  }, [props.note]);


  function ehandleChange(event){
      const {name, value} = event.target;

      eSetItems((prevValue) => {
          return {
              ...prevValue,
              [name] : value
          }
      })
  }
  
  function handleEdit(currentNote){
    modalRef.current.click();
  }
  
  function handleClick(){
    props.update(eItems.id, eItems.eTitle, eItems.eContent, eItems.eTag);
    refClose.current.click();
  }
 
  return (
    <>
    <div className="note" style={{backgroundColor: props.mode === 'light'?'#fff':'rgb(167 52 52)'}}>
      <h1 style={{color: props.mode === 'light'?'black':'white'}}>{props.note.title}</h1>
      <p style={{color: props.mode === 'light'?'black':'white'}}>{props.note.content}</p>
      <p style={{color: props.mode === 'light'?'black':'white'}}>{props.note.tag}</p>
      <button onClick={() => {
        props.delete(props.note._id);
      }} style={{backgroundColor: props.mode === 'light'?'#fff':'rgb(167 52 52)'}}><DeleteIcon /></button>
      <button onClick={() => {
        handleEdit(props.note)
      }} style={{backgroundColor: props.mode === 'light'?'#fff':'rgb(167 52 52)'}}><EditNoteIcon /></button>
    </div>

     <button type="button" className="btn btn-primary d-none"  ref={modalRef} data-bs-toggle="modal" data-bs-target={`#exampleModal-${props.note._id}`}>Launch Demo Modal</button>  

    <div className="modal fade"  id={`exampleModal-${props.note._id}`} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content" style={{backgroundColor: props.mode === 'light'?'#fff':'rgb(82 79 79)'}}>
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel" style={{color: props.mode === 'light'?'black':'white'}}>Edit Note</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form className="modals" style={{backgroundColor: props.mode === 'light'?'#fff':'rgb(82 79 79)'}}>
              <input name="eTitle" onChange={ehandleChange} value={eItems.eTitle} placeholder="Title" className="input-field" style={{backgroundColor: props.mode === 'light'?'#fff':'rgb(102 99 99)', color: props.mode === 'light'?'black':'white'}}/>
              <textarea name="eContent" onChange={ehandleChange} value={eItems.eContent} placeholder="Take a note..." className="input-field" rows="1" style={{backgroundColor: props.mode === 'light'?'#fff':'rgb(102 99 99)', color: props.mode === 'light'?'black':'white'}}/>
              <input name="eTag" onChange={ehandleChange} value={eItems.eTag} placeholder="Tag" className="input-field" style={{backgroundColor: props.mode === 'light'?'#fff':'rgb(102 99 99)', color: props.mode === 'light'?'black':'white'}}/>
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

export default Note;
