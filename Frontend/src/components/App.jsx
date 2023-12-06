import React, { useState } from "react";
import Header from "./Header";
import Footer from "./footer";
import Note from "./Note";
import CreateArea from "./createArea";
import Login from "./Login";
import SignUp from "./Signup";
import About from "./About";
import {BrowserRouter as Router,  Routes, Route } from "react-router-dom";

function App() {
    const [addedItems, setAddedItems] = useState([])
    const [items, setItems] = useState({
      title: "",
      content: "",
      tag: ""
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

    //for zooming the input section 
    const [isTrue, setIsTrue] = useState(false);
    function handleClick(){
        setIsTrue(true);
    }

    // adding items 
    async function onClick(val) {
      try {
        const response = await fetch(`https://mynotehub.onrender.com/addnote`, {
          method: "POST", 
          headers: {
            "Content-Type": "application/json",
            "access-token": localStorage.getItem('token')
          },
          body: JSON.stringify(val), 
        });
      
        const json = await response.json();

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status} ${json}`);
        }
        setAddedItems((prevValue) => {
          return [...prevValue, json];
        });
      } catch (error) {
        console.error("Error adding note:", error);
        // Handle the error appropriately, e.g., show a message to the user
      }
    }
    
    // deleting the added notes 
    async function handleDelete(ids) {
      try {
        const response = await fetch(`https://mynotehub.onrender.com/delete/${ids}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "access-token": localStorage.getItem('token'),
          },
        });
           
        const json = await response.json();
        console.log(json);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        setAddedItems((prevValue) => {
          return prevValue.filter((value) => {
            return value._id !== ids;
          });
        })

      } catch (error) {
        console.error("Error deleting:", error);
      }
    }
    
    // for updating the notes 

    async function handleUpdate(id, title, content, tag) {
      try {
        const response = await fetch(`https://mynotehub.onrender.com/update/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "access-token": localStorage.getItem('token')
          },
          body: JSON.stringify({id, title, content, tag}),
        });
    
        const json = await response.json();
        console.log(json);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        // let newNotes = JSON.parse(JSON.stringify())

        setAddedItems((prevValue) => {
          return prevValue.map((item) => {
            if (item._id === id) {
              return {_id:id, title: title, content: content, tag: tag };
            } else {
              return item;
            }
          });
        });
      } catch (error) {
        console.error("Error updating note:", error);
      }
    }
    
  return (
    <Router>
    <div>
      <Header />
    
      <Routes>
          <Route path="/"
           element =  {
           <div>
              <CreateArea click={onClick} items={items} setItems={setItems} setAddedItems={setAddedItems} handleChange={handleChange} handleClick={handleClick} isTrue={isTrue}/>
              {addedItems.map((item,index) => {
                return <Note key={index} delete={handleDelete} note={item}
                update={handleUpdate} />
              })}
            </div>
            }/>
          <Route path="/about"
           element =  {<About />} />
          <Route path="/login"
            element = {<Login />} />
          <Route path="/signup"
            element = {<SignUp />} />
          <Route path="/logout"
            element = {<Login />} />
      </Routes>

      <Footer />
    </div>
  </Router> 
  );
}

export default App;
//hello

