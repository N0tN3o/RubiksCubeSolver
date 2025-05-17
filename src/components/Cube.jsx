// src/components/Cube.jsx
import { useState } from 'react';
import CubeFace from './CubeFace';
import { DEFAULT_CUBE_COLORS, FACE_ORDER } from '../config/cubeConfig';

const Cube = ({ cubeState, onFaceChange }) => {
  const [selectedColor, setSelectedColor] = useState('white');
  
  // Create color classes mapping
  const COLOR_CLASSES = {};
  Object.keys(DEFAULT_CUBE_COLORS).forEach(color => {
    COLOR_CLASSES[color] = `bg-${color}`;
  });

  const handleTileClick = (face, index) => {
    onFaceChange(face, index, selectedColor);
  };

  return (
    <div className="cube-2d-wrapper">
      {/* Color selection toolbar */}
      <div className="color-selector">
        {Object.entries(DEFAULT_CUBE_COLORS).map(([color, hex]) => (
          <button
            key={color}
            className={`color-btn ${selectedColor === color ? 'selected' : ''}`}
            style={{ backgroundColor: hex }}
            onClick={() => setSelectedColor(color)}
            aria-label={`Select ${color} color`}
          />
        ))}
      </div>

      {/* Cube layout - using CSS Grid for better positioning */}
      <div className="cube-2d-layout">
        <div className="cube-2d-grid">
          {/* Empty cell for top-left */}
          <div></div>
          
          {/* Up face */}
          <CubeFace 
            face="up" 
            tiles={cubeState.up} 
            colorClasses={COLOR_CLASSES} 
            onTileClick={handleTileClick} 
          />
          
          {/* Empty cell for top-right */}
          <div></div>
          
          {/* Left, Front, Right faces in a row */}
          <CubeFace 
            face="left" 
            tiles={cubeState.left} 
            colorClasses={COLOR_CLASSES} 
            onTileClick={handleTileClick} 
          />
          
          <CubeFace 
            face="front" 
            tiles={cubeState.front} 
            colorClasses={COLOR_CLASSES} 
            onTileClick={handleTileClick} 
          />
          
          <CubeFace 
            face="right" 
            tiles={cubeState.right} 
            colorClasses={COLOR_CLASSES} 
            onTileClick={handleTileClick} 
          />
          
          {/* Empty cell for bottom-left */}
          <div></div>
          
          {/* Down face */}
          <CubeFace 
            face="down" 
            tiles={cubeState.down} 
            colorClasses={COLOR_CLASSES} 
            onTileClick={handleTileClick} 
          />
          
          {/* Empty cell for bottom-right */}
          <div></div>
          
          {/* Empty cell for back-left */}
          <div></div>
          
          {/* Back face (displayed below) */}
          <CubeFace 
            face="back" 
            tiles={cubeState.back} 
            colorClasses={COLOR_CLASSES} 
            onTileClick={handleTileClick} 
          />
          
          {/* Empty cell for back-right */}
          <div></div>
        </div>
      </div>
      
      <div className="mt-6 p-3 bg-gray-50 rounded-md border border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Instructions:</h3>
        <p className="text-sm text-gray-600">
          Click a color from the palette above, then click on any cube tile to apply that color.
          The cube is displayed in an unfolded pattern. Ensure you set all faces correctly.
        </p>
      </div>
    </div>
  );
};

export default Cube;