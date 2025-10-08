import React from "react";
import "./FaceRecognition.css";

const FaceRecognition = ({ imageUrl, box }) => {
  return (
    <div className="center ma">
      <div className="absolute mt2" style={{ position: 'relative', display: 'inline-block' }}>
        <img
          id="inputimage"
          alt="Face of a person"
          src={imageUrl}
          width="500px"
          height="auto"
          crossOrigin="anonymous"
          style={{ display: 'block' }}
        />
        {box && box.topRow && (
          <div
            className="bounding-box"
            style={{
              position: 'absolute',
              top: `${box.topRow}px`,
              right: `${box.rightCol}px`,
              bottom: `${box.bottomRow}px`,
              left: `${box.leftCol}px`,
              border: '3px solid #149df2',
              boxShadow: '0 0 0 3px #fff inset',
              cursor: 'pointer'
            }}
          ></div>
        )}
      </div>
    </div>
  );
};

export default FaceRecognition;