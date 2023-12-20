// ConfigDetails.js
import React, { useState, useEffect } from 'react';

const ConfigDetails = ({ menuItem }) => {
  const [configData, setConfigData] = useState(null);

  useEffect(() => {
    
    const fetchData = async () => {
      try {
        // Fetch data from the JSON file or an API endpoint
        const response = await fetch('Dashboard.json');
        const data = await response.json();
        // Assuming "config" is a key in your JSON data
        const configDetails = data && data.system && data.system.config;

        // Update the state with the fetched data
        setConfigData(configDetails);
      } catch (error) {
        console.error('Error fetching config data:', error);
      }
    };

    // Call the fetchData function when the component mounts
    fetchData();
  }, [menuItem]);

  return (
    <div>
      
          {configData ? (
            <>
             <h2>Config Details</h2>
             <div>
             {/* Render the specific data (hostname) */}
                           {/* <pre>{JSON.stringify(configData, null, 2)}</pre> */}
             <p>Hostname: {configData.hostname}</p>
           </div>
           </>
            
         ) : (
           <p>Data not available</p>
         )}     
    </div>
  );
};


export default ConfigDetails;
