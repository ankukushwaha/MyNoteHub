import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function SignUp(props){
    const navigate = useNavigate();
    const [detail, setDetail] = useState({
        username: "",
        email: "",
        password: ""
    })

    const handleChange = (e) => {
        const {value, name} = e.target;
        setDetail((prevValue) => {
            return{
                ...prevValue,
                [name]: value
            }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await fetch(`https://mynotehub.onrender.com/signup`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(detail),
          });
      
          const json = await response.json();
          if(json.error === "E11000 duplicate key error collection: keeperDB.users index: email_1 dup key: { email: \"hlw123@email.com\" }"){
              json.error = "This email is already in use. Enter another email."
          }
          else if(json.error === "E11000 duplicate key error collection: keeperDB.users index: username_1 dup key: { username: \"hlww\" }"){
            json.error = "User with this username already exists."
          }

          if (response.ok) {
            setDetail({username: "",
            email: "",
            password: ""});
            navigate("/login");
            props.showAlert("Account created successfully", "success");
          } else {
            // Handle errors here
            console.error("Signup failed");
            props.showAlert(`${json.error}`, "danger");
          }
        } catch (error) {
          console.error("Error during signup:", error.message);
          props.showAlert(`${error.message}`, "danger");
        }
      };
      

    return(
        <>
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label htmlFor="exampleInputUsername1" className="form-label">User Name</label>
                <input type="username" className="form-control" id="exampleInputUsername1" value={detail.username} onChange={handleChange} name="username" required/>
               </div>
            <div className="mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" value={detail.email} onChange={handleChange} name="email" required/>
                <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
            </div>
            <div className="mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                <input type="password" className="form-control" id="exampleInputPassword1" autoComplete="on" value={detail.password} onChange={handleChange} name="password" required />
            </div>
            <button type="submit" className="btn btn-primary" >SignUp</button>
        </form>
        <div className="d-flex justify-content-center ">
            <p className="m-1 text-center">Have an account</p>
            <Link to="/login" className="m-1" > 
                <span>Login</span>
            </Link>
        </div>
        </>
    )
}

export default SignUp;
//hello
