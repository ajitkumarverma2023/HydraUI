import React from 'react';
import loadingGif from './loaders.gif'; // Replace with the path to your loading GIF

const Loader = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <img src={loadingGif}  style ={{width:"40%",height:"40%" , marginTop:'10%'}}alt="Loading..." />
    </div>
  );
};

export default Loader;
