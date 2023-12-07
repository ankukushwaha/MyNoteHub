import React from "react";
import HighlightIcon from "@mui/icons-material/Highlight";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  function handleLogout(){
    localStorage.removeItem('token');
    navigate("/login");
  }

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        <h1>
          <HighlightIcon /> Keeper{" "}
        </h1>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto m-2 mb-2 mb-lg-0 ">
            <li className="nav-item">
              <Link
                className="nav-link active text-white h3"
                aria-current="page"
                to="/"
              >
                Home
              </Link>
            </li>
            <li className="nav-item ">
              <Link className="nav-link text-white h1" to="/about">
                About
              </Link>
            </li>
          </ul>
          {!localStorage.getItem('token') ? <div>
            <Link to="/login"><button type="button" className="btn btn-primary m-3">
              Login
            </button></Link>
            <Link to="/signup"><button type="button" className="btn btn-primary m-3">
              Signup
            </button></Link>
          </div>:<Link to="/logout"><button type="button" className="btn btn-primary" onClick={handleLogout}>
          Logout</button></Link>}
        </div>
      </div>
    </nav>
  );
}

export default Header;
