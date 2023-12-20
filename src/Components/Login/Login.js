import React, { useState } from "react";
import NokiaImg from './Nokia-Logo.png';
import WavesuiteImg from './WaveSuite.png';
import './Login.css'
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isChecked, setIsChecked] = useState(true);
  const [activeInput, setActiveInput] = useState(null);
  const [loadingData, setLoadingData] = useState(false);
  const navigate = useNavigate();

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleInputClick = (inputType) => {
    setActiveInput(inputType);
  };

  const login = async () => {
    try {
      setLoadingData(true);
      const response = await fetch(`/validateLogin?username=${username}&password=${password}`, {
        method: 'GET',
        headers: {
          "access-control-allow-origin" : "*",
          "Content-type": "application/json; charset=UTF-8"
        },
      });   

      if (response.ok ) {
        console.log("login result", response);       
        setLoadingData(false);     
        navigate('/CommonBanner');
      } else {
        console.error("Login failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const handleLogin = () => {
    if (username !== "" && password !== "") {
      login();
    } else {
      alert("Invalid username or password");
    }
  };  
  
  return (
    
    <div className={`${loadingData ? "blur" : ""}`}>
    {loadingData && (
      <div className="loading-indicator-container">
        <div className="loading-indicator"></div>
      </div>
    )}
   
    <div className="mainDiv">
          {/* Wavesuite Image */}
          <div className="leftPanelDiv">
            <img className="wavesuitlogo" src={WavesuiteImg} alt="WaveSuite" />
          </div>

          {/* Input Fields */}
          <div className="rightPanelDiv">
            <img  className="nokialogo" src={NokiaImg} alt="Nokia-Logo" />
            <p className="wavesuitText">NE Hydra Web UI</p>
            <br /><br /><br /><br />

            {/* Username */}
            <label className="labels" ><strong>Username</strong></label><br />
            <input className="inputtexts"
              autoFocus
              onClick={() => handleInputClick('username')}
              style={{ outline: activeInput === 'username' ? '1px solid #33C2FF' : 'none' }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
<br />
            {/* Password */}
            <label className="labels"><strong>Password</strong></label><br />
            <input
            className="inputtexts"
              style={{  outline: activeInput === 'password' ? '1px solid #33C2FF' : 'none' }}
              type="password"
              onClick={() => handleInputClick('password')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Checkbox and Sign In button */}
            <div className="buttonDiv"> 
             <input type="checkbox" checked={!isChecked} onChange={handleCheckboxChange} className="checkboxField"  /><span className="checkboxText">Remember Username</span>
           <button onClick={handleLogin} className="signInbutton">  Sign In   </button>
            </div>
          </div>
        </div>
    </div>
  );
}

export default Login;
