import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Login(){
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
          const response = await fetch(`http://localhost:4000/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
      
          if (response.ok) {
            const json = await response.json();
            console.log(json);
            setData({
            email: "",
            password: ""});
            navigate("/")
          } else {
            // Handle errors here
            console.error("Login failed");
          }
        } catch (error) {
          console.error("Error during Login:", error.message);
        }
    }
    
    return(
        <>
        <form>
            <div className="mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" name="email" onChange={handleChange} value={data.email}/>
                <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
            </div>
            <div className="mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                <input type="password" className="form-control" id="exampleInputPassword1" autoComplete="on" onChange={handleChange} name="password" value={data.password}/>
            </div>
            <div className="mb-3 form-check">
                <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                <label className="form-check-label" htmlFor="exampleCheck1">Check me out</label>
            </div>
            <button type="submit" className="btn btn-primary" onClick={handleSubmit}>Login</button>
        </form>
        <div className="d-flex justify-content-center ">
            <p className="m-1 text-center">Don't have an account</p>
            <Link to="/signup" className="m-1" > 
                <span>SignUp</span>
            </Link>
        </div>
        </>
    )
}

export default Login;