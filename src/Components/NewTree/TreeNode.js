import React, { useState } from 'react';
import '../Dashboard/splitpanel.css';

const TreeNode = ({ node, onComponentDataChange }) => {
  const [expandedNodes, setExpandedNodes] = useState({});
  const toggleExpand = (nodeName) => {
    setExpandedNodes((prevExpandedNodes) => ({
      ...prevExpandedNodes,
      [nodeName]: !prevExpandedNodes[nodeName],
    }));
  };

  
  const getDets = async (modules) => {
    try {
      const response = await fetch(`/getComponent/${modules}`, {
        method: 'GET',
      });
      if (response.ok) {
        const mydata = await response.json();
        onComponentDataChange(mydata['data']['components']['component']['state']);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const nameStyle = {
    cursor: 'pointer',
   // marginLeft: '30px',
  };
  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
  };
  const handleClick = (nodeName) => {
    toggleExpand(nodeName);
  };
  
  return (
    <div>
      <div>
      
        {node && node.map((ele, index) => (
            <div key={index}>
                  <div
              style={containerStyle}
            >
              <div
                onClick={() => handleClick(ele['name'])}
                style={{
                  cursor: 'pointer',
                  padding: '10px',
                  marginLeft:'50px'
                }}
              >
                {ele['name'] && (expandedNodes[ele['name']] ? '[-]' : '[+]')}
              </div>

              <div
                style={{
                  ...nameStyle             
                }}
                onClick={() => getDets(ele['name'])}
              >
                {ele['name']}
              </div>
            </div>
              {ele['subcomponents'] &&
                ele['subcomponents']['subcomponent'] &&
                Array.isArray(ele['subcomponents']['subcomponent']) &&
                expandedNodes[ele['name']] && (
                  <div>
                    {ele['subcomponents']['subcomponent'].map((child, index) => (
                      <div key={index}>
                        <TreeNode node={[child]} onComponentDataChange={onComponentDataChange} />
                      </div>
                    ))}
                  </div>
                )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default TreeNode;
