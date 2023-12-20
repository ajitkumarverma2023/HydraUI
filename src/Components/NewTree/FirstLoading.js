import React from 'react';
import './Showcomponent.css';

const renderValue = (value) => {
  if (typeof value === 'object') {
    if (Array.isArray(value)) {
      // Render array values as a list
      return (
        <ul>
          {value.map((item, index) => (
            <li key={index}>{renderValue(item)}</li>
          ))}
        </ul>
      );
    } else {
      // Render nested object values as a nested table
      return <FirstLoading val={value} />;
    }
  } 
};

export default function FirstLoading({ val }) {
  console.log(val)
  if (!val || Object.keys(val).length === 0) {

      
    <p>No data to display</p>;
  }

  return (
    <div>
      <table className="dynamic-table">
        <thead>
          <tr>
            <th>Attribute</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {val && Object.entries(val).map(([key, value], index) => (
            <tr key={index}>
              <td>{key}</td>
              <td>{renderValue(value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
