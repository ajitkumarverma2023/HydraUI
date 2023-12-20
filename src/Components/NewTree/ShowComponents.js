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
      return <ShowComponents componentData={value} />;
    }
  } else {
    // Render primitive values
    return value;
  }
};

export default function ShowComponents({ componentData }) {
  if (!componentData || Object.keys(componentData).length === 0) {

      
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
          {componentData && Object.entries(componentData).map(([key, value], index) => (
            <tr key={index}>
              <td>{key}</td>
              <td>{typeof value === 'string'
                    ? renderValue(value.replace(value.substr(0, value.indexOf(':') + 1), ''))
                    : renderValue(value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
