import React from 'react'
import './splitpanel.css';
import TreePanel from '../NewTree/TreePanel';
import { useEffect } from 'react';
import { useState } from 'react';
import ShowComponents from '../NewTree/ShowComponents';
import MenuListPage from "../MenuList/MenuListPage";
import FirstLoading from '../NewTree/FirstLoading';

export default function SplitPanel({menuData, flagFromMenu, setFlagFromMenu}) {
  const [res, setres] = useState();
  const [componentData, setComponentData] = useState();
  const [softData, setsoftData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from the JSON file or an API endpoint
        // Fetch data from the JSON file or an API endpoint
        const response = await fetch('/getequipment', {
          method: 'GET',
        });
        if (response.ok) {
          //console.log("API banner result", response);
          const mydata = await response.json();
          const getData = mydata['data']['components']['component'];

          const filteredData = getData.filter(ele => ele['name'].includes("CHASSIS"));

          setres(filteredData);

          //  console.log("TreeData",mydata);
        }

      } catch (error) {
        console.error('Error fetching data:', error);

      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const getDets = async () => {
      try {
        const response = await fetch('/getComponent/SYSTEM-SOFTWARE', {
          method: 'GET',
        });
        if (response.ok) {
          const mydata = await response.json();
          //console.log("splitPaneel", mydata['data']['components']['component']['name']);
          setsoftData(mydata['data']['components']['component']['state']);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    getDets();

  }, []);

  const handleComponentDataChange = (data) => {
    setFlagFromMenu("false");
    setComponentData(data);
  };
  return (

    <div className='container'>
      <div className="left">
        {/* Content for the left division (20%) */}
        <div style={{ backgroundColor: 'blue' }}></div>
        <div onClick={() => setComponentData(softData)} style={{
          cursor: 'pointer'
        }}> SYSTEM-SOFTWARE</div>
        <TreePanel data={res} compData={softData} onComponentDataChange={handleComponentDataChange} />
      </div>
      <div className="right">
        
      {!componentData ? <FirstLoading val={softData} />
          : flagFromMenu === "false" ? <ShowComponents componentData={componentData} /> : <MenuListPage menuData={menuData}/> }
      

        
      </div>


    </div>
  )
}
