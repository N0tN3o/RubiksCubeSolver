// src/components/CubeFace.jsx
import { FACE_NAMES } from '../config/cubeConfig';

const CubeFace = ({ face, tiles, colorClasses, onTileClick }) => {
  const faceLabel = FACE_NAMES[face] || face.charAt(0).toUpperCase() + face.slice(1);
  
  return (
    <div className="face-container">
      <span className="face-label">{faceLabel}</span>
      <div className="cube-face">
        {tiles.map((color, index) => (
          <button
            key={`${face}-${index}`}
            className={`cube-tile ${colorClasses[color]}`}
            style={{ backgroundColor: color }}
            onClick={() => onTileClick(face, index, color)}
            aria-label={`${face} face, tile ${index + 1}, currently ${color}`}
          />
        ))}
      </div>
    </div>
  );
};

export default CubeFace;