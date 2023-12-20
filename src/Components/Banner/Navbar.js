import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

const Menu = ({setFlagFromMenu, setMenuData}) => {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [jsonData, setJsonData] = useState(null);
  const [hoveredMenuItem, setHoveredMenuItem] = useState(null);
  const handleMenuItemHover = (index) => {
    setHoveredMenuItem(index);
  };

  const handleMenuClick = (val) => {
    // Set the flag to true when some condition is met
    setMenuData(val);
    setFlagFromMenu("true");
  };
  
  const handleMenuItemLeave = () => {
    setHoveredMenuItem(null);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/closeSession', {
        method: 'GET',
      });
      if (response.ok) {
        console.log("logout", response);
        navigate('/');
        document.title = "Hydra UI";
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from the JSON file or an API endpoint
        try {
          const response = await fetch("/module/submodule", {
            method: 'GET',
          });      
    
          if (response.ok ) {
            const data = await response.json();
            console.log("menuData", data)
            setJsonData(data['data']);
          } else {
            console.error("Login failed with status:", response.status);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
        // const response = await fetch('Menu.json');
        // const data = await response.json();
        // Update the state with the fetched data
        //  console.log(data['data']);
        //setJsonData(data['data']);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Call the fetchData function when the component mounts
    fetchData();
  }, []);
  return (
    <div>
      {/* Navigation Bar */}

      <nav className="navbar">
        <div className="hamburger" onClick={toggleMenu}>
          &nbsp; &#9776;
        </div>
        <div className="hamburger" onClick={handleLogout}>
          <button>Logout</button>
        </div>
        {/* Menu Items */}

        {isOpen && (

          <div className="menu">

            {
              jsonData.map((item, index) =>
                <Link key={index}
                  onMouseEnter={() => handleMenuItemHover(index)} > {item['moduleName'].toUpperCase().replaceAll("-", " ")}
                  {item['subModuleName'] && (
                    <span id="arrow" style={{ paddingLeft: '30px' }}>&#11208;
                      {item['subModuleName'] && hoveredMenuItem === index && (
                        <div className="subMenu">
                          {item['subModuleName'].map((subItem, index) => (
                            <Link key={index} onClick={() => handleMenuClick(item['moduleName'] +'/' + subItem)} >
                              {subItem.replaceAll("-", " ")}
                            </Link>
                          ))}
                        </div>
                      )}
                    </span>
                  )}
                </Link>
              )
            }
          </div>
        )}
      </nav>


    </div>

  );
};

export default Menu;
