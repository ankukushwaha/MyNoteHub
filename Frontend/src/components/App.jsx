import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./footer";
import Note from "./Note";
import CreateArea from "./createArea";
import Login from "./Login";
import SignUp from "./Signup";
import About from "./About";
import {BrowserRouter as Router,  Routes, Route } from "react-router-dom";
import Alert from "./Alert";

function App() {

  // alert component 
    const [alert, setAlert] = useState(null);
    function showAlert(message, type){
      setAlert({
        msg: message,
        type: type
      })
      setTimeout(() => {
        setAlert(null);
      },2000);
    }
  
    // toggleMode
    const savedMode = localStorage.getItem('mode') || 'dark'; 
    const [mode, setMode] = useState(savedMode);
    function toggleMode(){
      setMode((prevMode) => (prevMode === 'dark'? 'light':'dark'));
    }
    useEffect(() => {
      // Save the current mode to local storage whenever it changes
      localStorage.setItem('mode', mode);
      document.body.style.backgroundColor = mode === 'dark'?'rgb(4, 48, 72)': 'white';
    }, [mode]);
    
    // notes 
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
          showAlert(`${json.error}`, "danger");
          throw new Error(`HTTP error! Status: ${response.status} ${json}`);
        }
        setAddedItems((prevValue) => {
          return [...prevValue, json];
        });
        showAlert("Items added successfully", "success");
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
        showAlert("Items deleted successfully", "success");

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
        showAlert("Items updated successfully", "success");
      } catch (error) {
        console.error("Error updating note:", error);
      }
    }
    
  return (
    <Router>
    <div>
      <Header showAlert={showAlert} toggle={toggleMode} mode={mode}/>
      <Alert alert={alert}/>
      <Routes>
          <Route path="/"
           element =  {
           <div>
              <CreateArea click={onClick} items={items} setItems={setItems} mode={mode} setAddedItems={setAddedItems} handleChange={handleChange} handleClick={handleClick} isTrue={isTrue} showAlert={showAlert}/>
              {addedItems.map((item,index) => {
                return <Note key={index} delete={handleDelete} note={item}
                update={handleUpdate} mode={mode}/>
              })}
            </div>
            }/>
          <Route path="/about"
           element =  {<About />} />
          <Route path="/login"
            element = {<Login showAlert={showAlert} mode={mode}/>} />
          <Route path="/signup"
            element = {<SignUp showAlert={showAlert} mode={mode}/>} />
      </Routes>

      <Footer mode={mode}/>
    </div>
  </Router> 
  );
}

export default App;
//hello

