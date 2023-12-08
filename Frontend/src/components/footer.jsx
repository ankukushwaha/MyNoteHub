import React from "react";

function Footer(props){
    return(
        <footer>
            <p style={{color: props.mode === 'light'?'black':'white'}}>Copyright ⓒ {new Date().getFullYear()}</p>
        </footer>
    )
}

export default Footer;