// TreePanel.js
import React from 'react';
import TreeNode from './TreeNode'; // Import the TreeNode component

const TreePanel = ({ data ,onComponentDataChange}) => {
  console.log("Treepanel :",onComponentDataChange)
  return (
    <div>
      <TreeNode node={data} onComponentDataChange={onComponentDataChange} />
    </div>
  );
};

export default TreePanel;
