import React from 'react';
import { useEffect,useState } from 'react';
const Dynamiccreation = () => {
    
  // Assuming jsonData is passed as a prop
 // const [jsonData,setjsonData]=useState();
  const isTableData = (data) => {
    if(data.myData[0]){
    const keys = Object.keys(data.myData[0]);
    // const keys2=Object.keys(data.myData[1]);
     //console.log("length of rows",data.myData);
var myflag=false;
data.myData.forEach((row) => {
  const newKeys = Object.keys(row);
  console.log("New keys:", newKeys);

  // Check if any key in newKeys is present in the keys array
   
//console.log(new Set(keys).size === new Set([...keys, ...newKeys]).size)
     myflag= new Set(keys).size === new Set([...keys, ...newKeys]).size; 
     console.log("myflag ",myflag);// Stop iterating if a row with matching keys is found
  }
);
return myflag;
//return  new Set(keys).size === new Set([...keys, ...keys2]).size;
}


} 

  

  const renderTable = (data) => {
    // Implement logic to render a table based on the JSON data
    // For simplicity, this example assumes it's an array of objects
    return (
      <table>
        <thead>
          <tr>
            {Object.keys(data.myData[0]).map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.myData.map((row, index) => (
            <tr key={index}>
              {Object.values(row).map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderForm = (data) => {
    // Implement logic to render a form based on the JSON data
    // For simplicity, this example assumes it's an object
    return (
      <form>
        {Object.keys(data.myData).map((fieldName) => (
          <div key={fieldName}>
            <label htmlFor={fieldName}>{fieldName}</label>
            <input
              type="text"
              id={fieldName}
              name={fieldName}
              value={data.myData[fieldName]}
            />
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
    );
  };

  

const myData=
// [
//     {
//       "pm-resource-instance": "/oc-platform:components/oc-platform:component[oc-platform:name='OCH-1-1-L1']",
//       "pm-type": "PM_GROUP_TRANSCEIVER",
//       "supervision-switch": "enabled"
//     },
//     {
//       "pm-resource-instance": "/oc-platform:components/oc-platform:component[oc-platform:name='OCH-1-1-L1']",
//       "pm-type": "PM_GROUP_OPT_CHL",
//       "supervision-switch": "enabled"
//     },
//     {
//       "pm-resource-instance": "/oc-platform:components/oc-platform:component[oc-platform:name='OCH-1-1-L1']",
//       "pm-type": "PM_GROUP_OTSI",
//       "supervision-switch": "enabled"
//     },
//     {
//       "pm-resource-instance": "/oc-opt-term:terminal-device/oc-opt-term:logical-channels/oc-opt-term:channel[oc-opt-term:index='1010102117']",
//       "pm-type": "PM_GROUP_ETHERNET",
//       "supervision-switch": "enabled"
//     },
//     {
//       "pm-resource-instance": "/oc-platform:components/oc-platform:component[oc-platform:name='TRANSCEIVER-1-1-C1']",
//       "pm-type": "PM_GROUP_TRANSCEIVER",
//       "supervision-switch": "enabled"
//     },
//     {
//       "pm-resource-instance": "/oc-opt-term:terminal-device/oc-opt-term:logical-channels/oc-opt-term:channel[oc-opt-term:index='1010102117']",
//       "pm-type": "PM_GROUP_PCS",
//       "supervision-switch": "enabled"
//     },
//     {
//       "pm-resource-instance": "/oc-opt-term:terminal-device/oc-opt-term:logical-channels/oc-opt-term:channel[oc-opt-term:index='1010102117']",
//       "pm-type": "PM_GROUP_CLIENT_ETH_FEC",
//       "supervision-switch": "enabled"
//     },]
  
[
    {
        "name": "DRoute_to_OSPF",
        "config": {
          "name": "DRoute_to_OSPF"
        },
        "state": {
          "name": "DRoute_to_OSPF"
        },
        "statements": {
          "statement": {
            "name": "stmt_default_route",
            "config": {
              "name": "stmt_default_route"
            },
            "state": {
              "name": "stmt_default_route"
            },
            "conditions": {
              "match-prefix-set": {
                "config": {
                  "prefix-set": "DRoute_to_OSPF"
                },
                "state": {
                  "prefix-set": "DRoute_to_OSPF",
                  "match-set-options": "ANY"
                }
              }
            } }
            }
            }
            ]

  // Determine whether to render a table or form based on JSON structure
  const dynamicContent = isTableData({myData}) ? renderTable({myData}) :  renderForm({myData});
   const typeOfscreen= isTableData({myData}) ? "Table " : "form";
  return <div>
    <p>Its a {typeOfscreen} screen</p>
    {dynamicContent} 
  
  </div>;
};

export default Dynamiccreation;
