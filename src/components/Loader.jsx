import React from 'react';
import './Loader.css';

export const Loader = () => {
  return (
    <div className="main">
      <div className="up">
        <div className="loaders">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="loader"></div>
          ))}
        </div>
        <div className="loadersB">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="loaderA">
              <div className={`ball${i}`}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};