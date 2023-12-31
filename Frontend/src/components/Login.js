import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Login(props){
    const navigate = useNavigate();
    const [data, setData] = useState({
        email: "",
        password: ""
    })

    const handleChange = (e) =>{
        const {value, name} = e.target;
        setData((prevValue) => {
            return {
                ...prevValue,
                [name]: value
            }
        })
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
          const response = await fetch(`https://mynotehub.onrender.com/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
      
          const json = await response.json();
          if (response.ok) {
            localStorage.setItem('token', json.token); 
            setData({
            email: "",
            password: ""});
            props.showAlert("Logged In Successfully", "success");
            navigate("/")
          } else {
            // Handle errors here
            props.showAlert(`${json.error}`, "danger");
          }
        } catch (error) {
          console.error("Error during Login:", error.message);
        }
    }
    
    return(
        <>
        <form onSubmit={handleSubmit} style={{backgroundColor: props.mode === 'light'?'#fff':'#2c2a2a'}}>
            <div className="mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label" style={{color: props.mode === 'light'?'black':'white'}}>Email address</label>
                <input type="email" className="form-control" style={{backgroundColor: props.mode === 'light'?'#fff':'rgb(102 99 99)', color: props.mode === 'light'?'black':'white'}} id="exampleInputEmail1" aria-describedby="emailHelp" name="email" onChange={handleChange} value={data.email} required/>
                <div id="emailHelp" className="form-text" style={{color: props.mode === 'light'?'black':'white'}}>We'll never share your email with anyone else.</div>
            </div>
            <div className="mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label" style={{color: props.mode === 'light'?'black':'white'}}>Password</label>
                <input type="password" className="form-control" style={{backgroundColor: props.mode === 'light'?'#fff':'rgb(102 99 99)', color: props.mode === 'light'?'black':'white'}} id="exampleInputPassword1" autoComplete="on" onChange={handleChange} name="password" value={data.password} required/>
            </div>
            <button type="submit" className="btn btn-primary">Login</button>
        </form>
        <div className="d-flex justify-content-center ">
            <p className="m-1 text-center" style={{color: props.mode === 'light'?'black':'white'}}>Don't have an account</p>
            <Link to="/signup" className="m-1" style={{color: props.mode === 'light'?'blue':'#f5b907'}} > 
                <span>SignUp</span>
            </Link>
        </div>
        </>
    )
}

export default Login;
//hello
