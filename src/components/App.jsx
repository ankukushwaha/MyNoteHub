import React, { useEffect, useRef, useState } from "react";
import Header from "./Header";
import Footer from "./footer";
import Note from "./Note";
import CreateArea from "./createArea";
import Modal from "./modal";
import Login from "./Login";
import SignUp from "./Signup";
import About from "./About";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
    const [addedItems, setAddedItems] = useState([])
    const [items, setItems] = useState({
      title: "",
      content: ""
    })

    function handleChange(event){
        const {name, value} = event.target;

        setItems((prevValue) => {
            return {
                ...prevValue,
                [name] : value
            }
        })
    }

    const [eItems, eSetItems] = useState({
      eTitle: "",
      eContent: ""
    })

    function ehandleChange(event){
        const {name, value} = event.target;

        eSetItems((prevValue) => {
            return {
                ...prevValue,
                [name] : value
            }
        })
    }

    //for zooming the input section 
    const [isTrue, setIsTrue] = useState(false);
    function handleClick(){
        setIsTrue(true);
    }

    // get notes
    async function getNotes() {
      try {
        const response = await fetch(`http://localhost:4000/fetchnotes`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "access-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NjA1YjA5YWU5OWVhOGRkYzljMjkyNCIsImlhdCI6MTcwMTE0ODA3NX0.3srQgcCxJ9Yf0PfPHvlLvWP-8UdyjafTwaIMV2_qm54"
          },
        });
    
        const json = await response.json();
        console.log(json);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        setAddedItems(json);
      } catch (error) {
        console.error("Error fetching notes:", error);
        // Handle the error appropriately, e.g., show a message to the user
      }
    }
    

    useEffect(() => {
      getNotes();
    }, [])

    // adding items 
    async function onClick(val) {
      try {
        const response = await fetch(`http://localhost:4000/addnote`, {
          method: "POST", 
          headers: {
            "Content-Type": "application/json",
            "access-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NjA1YjA5YWU5OWVhOGRkYzljMjkyNCIsImlhdCI6MTcwMTE0ODA3NX0.3srQgcCxJ9Yf0PfPHvlLvWP-8UdyjafTwaIMV2_qm54"
          },
          body: JSON.stringify(val), 
        });
      
        const json = await response.json();
        console.log(json);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status} ${json}`);
        }
        
        setAddedItems((prevValue) => {
          return [...prevValue, val];
        });
      } catch (error) {
        console.error("Error adding note:", error);
        // Handle the error appropriately, e.g., show a message to the user
      }
    }
    
    // deleting the added notes 
    async function handleDelete(id) {
      try {
        const response = await fetch(`http://localhost:4000/delete/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "access-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NjA1YjA5YWU5OWVhOGRkYzljMjkyNCIsImlhdCI6MTcwMTE0ODA3NX0.3srQgcCxJ9Yf0PfPHvlLvWP-8UdyjafTwaIMV2_qm54",
          },
        });
           
        const json = await response.json();
        console.log(json);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        setAddedItems((prevValue) => {
          return prevValue.filter((value) => {
            return value._id !== id;
          });
        })

      } catch (error) {
        console.error("Error deleting:", error);
      }
    }
    
    // for updating the notes 
    const modalRef = useRef(null);
    const [id, setId] = useState(null);

    function handleEdit(currentNote, index){
      modalRef.current.click();
      eSetItems({eTitle: currentNote.title, eContent: currentNote.content });
      setId(index);
    }

    async function handleUpdate(id){
      const response = await fetch(`http://localhost:4000/update/${id}`, {
        method: "PUT", 
        headers: {
          "Content-Type": "application/json",
          "Cookie": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NjA1YjA5YWU5OWVhOGRkYzljMjkyNCIsImlhdCI6MTcwMDk4OTQyNH0.jaArN9m7aPcaxZk4qVdrEgO8TPdhQ3lBqPhxyWvIOt8"
        },
        // body: JSON.stringify({title, content, tag}), 
      });
      // const json =  response.json();

      setAddedItems((prevValue) => {
        return prevValue.map((item, index) => {
          if(index === id){
            return {title: eItems.eTitle, content: eItems.eContent};
          }
          else{
            return item;
          }
        })
      })
    }

  return (
    <Router>
    <div>
      <Header />
    
      <Routes>
          <Route path="/"
           element =  {
           <div>
              <Modal modalRef={modalRef}  handleChange={ehandleChange} items={eItems} update={handleUpdate} index={id} />
              <CreateArea click={onClick} items={items} setItems={setItems} handleChange={handleChange} handleClick={handleClick} isTrue={isTrue}/>
              {addedItems.map((item,index) => {
                return <Note key={index} id={item._id} Title={item.title} Content = {item.content} delete={handleDelete} edit={handleEdit} note={item}/>
              })}
            </div>
            }/>
          <Route path="/about"
           element =  {<About />} />
          <Route path="/login"
            element = {<Login />} />
          <Route path="/signup"
            element = {<SignUp />} />
      </Routes>

      <Footer />
    </div>
    </Router>
  );
}

export default App;
