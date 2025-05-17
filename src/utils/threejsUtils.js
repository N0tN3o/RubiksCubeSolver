// src/utils/threejsUtils.js
import * as THREE from 'three';
import { THREEJS_CONFIG } from '../config/cubeConfig';

// Create cube pieces
export const createCubePieces = (cubeState, config = THREEJS_CONFIG) => {
  const { cubeSize, gap } = config;
  const pieces = [];
  const totalSize = cubeSize + gap;
  
  // Create 27 pieces (3x3x3 cube)
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        // Skip the center piece (internal)
        if (x === 0 && y === 0 && z === 0) continue;
        
        // Create piece
        const piece = createCubePiece(x, y, z, cubeState, config);
        piece.position.set(
          x * totalSize, 
          y * totalSize, 
          z * totalSize
        );
        
        pieces.push(piece);
      }
    }
  }
  
  return pieces;
};

// Create a single cube piece with the correct colors
const createCubePiece = (x, y, z, cubeState, config) => {
  const { cubeSize } = config;
  const pieceGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
  
  // Get colors for each face of this piece
  const materials = determinePieceMaterials(x, y, z, cubeState);
  
  // Create the piece mesh
  const pieceMesh = new THREE.Mesh(pieceGeometry, materials);
  
  // Store position data for animation and solving
  pieceMesh.userData = {
    initialPosition: { x, y, z },
    currentPosition: { x, y, z }
  };
  
  return pieceMesh;
};

// Determine the materials/colors for each face of a piece
const determinePieceMaterials = (x, y, z, cubeState) => {
  // Default black material for inner faces
  const blackMaterial = new THREE.MeshLambertMaterial({ 
    color: 0x111111,
    side: THREE.DoubleSide
  });
  
  // Create materials array for the 6 faces (right, left, top, bottom, front, back)
  const materials = Array(6).fill(blackMaterial);
  
  // Right face (x = 1)
  if (x === 1) {
    const colorIndex = getFaceColorIndex(z + 1, -y + 1);
    const color = getCubeColor(cubeState.right[colorIndex]);
    materials[0] = new THREE.MeshLambertMaterial({ 
      color, 
      side: THREE.DoubleSide 
    });
  }
  
  // Left face (x = -1)
  if (x === -1) {
    const colorIndex = getFaceColorIndex(-z + 1, -y + 1);
    const color = getCubeColor(cubeState.left[colorIndex]);
    materials[1] = new THREE.MeshLambertMaterial({ 
      color, 
      side: THREE.DoubleSide 
    });
  }
  
  // Top face (y = 1)
  if (y === 1) {
    const colorIndex = getFaceColorIndex(x + 1, -z + 1);
    const color = getCubeColor(cubeState.up[colorIndex]);
    materials[2] = new THREE.MeshLambertMaterial({ 
      color, 
      side: THREE.DoubleSide 
    });
  }
  
  // Bottom face (y = -1)
  if (y === -1) {
    const colorIndex = getFaceColorIndex(x + 1, z + 1);
    const color = getCubeColor(cubeState.down[colorIndex]);
    materials[3] = new THREE.MeshLambertMaterial({ 
      color, 
      side: THREE.DoubleSide 
    });
  }
  
  // Front face (z = 1)
  if (z === 1) {
    const colorIndex = getFaceColorIndex(x + 1, -y + 1);
    const color = getCubeColor(cubeState.front[colorIndex]);
    materials[4] = new THREE.MeshLambertMaterial({ 
      color, 
      side: THREE.DoubleSide 
    });
  }
  
  // Back face (z = -1)
  if (z === -1) {
    const colorIndex = getFaceColorIndex(-x + 1, -y + 1);
    const color = getCubeColor(cubeState.back[colorIndex]);
    materials[5] = new THREE.MeshLambertMaterial({ 
      color, 
      side: THREE.DoubleSide 
    });
  }
  
  return materials;
};

// Helper to get the right index from the 2D representation
const getFaceColorIndex = (x, y) => {
  // Ensure x and y are in the 0-2 range
  const normalizedX = Math.min(Math.max(Math.floor(x), 0), 2);
  const normalizedY = Math.min(Math.max(Math.floor(y), 0), 2);
  
  // Convert from 0-2 coordinates to index in the flat array
  return normalizedY * 3 + normalizedX;
};

// Convert color name to hex color
const getCubeColor = (colorName) => {
  const colorMap = {
    'white': 0xffffff,
    'yellow': 0xfcd34d,
    'red': 0xef4444,
    'orange': 0xf97316,
    'green': 0x10b981,
    'blue': 0x3b82f6
  };
  
  return colorMap[colorName] || 0x000000;
};

// Animate cube rotation for a move
export const animateCubeMove = (pieces, move, onComplete, config = THREEJS_CONFIG) => {
  const { animationDuration } = config;
  
  // Determine which pieces to rotate and rotation axis/angle
  const { piecesToRotate, axis, angle } = getMoveDetails(pieces, move);
  
  if (piecesToRotate.length === 0) {
    console.error(`Invalid move: ${move}`);
    onComplete();
    return;
  }
  
  // Create pivot point for rotation
  const pivot = new THREE.Object3D();
  const scene = pieces[0].parent;
  scene.add(pivot);
  
  // Add pieces to pivot
  piecesToRotate.forEach(piece => {
    // Save original parent
    const originalParent = piece.parent;
    // Get world position
    const worldPosition = new THREE.Vector3();
    piece.getWorldPosition(worldPosition);
    // Reparent to pivot
    originalParent.remove(piece);
    pivot.add(piece);
    // Set the piece's position in the pivot's coordinate system
    piece.position.copy(worldPosition);
    // Store original parent for later
    piece.userData.originalParent = originalParent;
  });
  
  // Set up animation
  const startTime = Date.now();
  const duration = animationDuration;
  
  // Animation loop
  const animate = () => {
    const elapsedTime = Date.now() - startTime;
    const progress = Math.min(elapsedTime / duration, 1);
    
    // Rotate pivot based on progress
    const rotationAmount = angle * progress;
    pivot.rotation[axis] = rotationAmount;
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      // Animation complete
      // Return pieces to original parents with new orientations
      while (pivot.children.length > 0) {
        const piece = pivot.children[0];
        const originalParent = piece.userData.originalParent;
        
        // Get world position and rotation
        const worldPosition = new THREE.Vector3();
        piece.getWorldPosition(worldPosition);
        const worldQuaternion = new THREE.Quaternion();
        piece.getWorldQuaternion(worldQuaternion);
        
        // Remove from pivot
        pivot.remove(piece);
        
        // Add back to original parent
        originalParent.add(piece);
        
        // Apply world position and rotation
        piece.position.copy(worldPosition);
        piece.quaternion.copy(worldQuaternion);
        
        // Update piece's current position data
        updatePiecePositionData(piece, move);
      }
      
      // Remove pivot
      scene.remove(pivot);
      
      // Call completion callback
      onComplete();
    }
  };
  
  // Start animation
  animate();
};

// Get details for a specific move
const getMoveDetails = (pieces, move) => {
  // Parse move notation
  const face = move.charAt(0);
  const direction = move.length > 1 ? move.charAt(1) : '';
  const isPrime = direction === "'";
  const isDouble = direction === '2';
  
  // Define which pieces to rotate
  let piecesToRotate = [];
  let axis = '';
  let angle = 0;
  
  // Determine axis and direction
  switch (face) {
    case 'U': // Up face
      piecesToRotate = pieces.filter(p => p.userData.currentPosition.y === 1);
      axis = 'y';
      angle = isPrime ? -Math.PI/2 : (isDouble ? Math.PI : Math.PI/2);
      break;
    case 'D': // Down face
      piecesToRotate = pieces.filter(p => p.userData.currentPosition.y === -1);
      axis = 'y';
      angle = isPrime ? Math.PI/2 : (isDouble ? Math.PI : -Math.PI/2);
      break;
    case 'R': // Right face
      piecesToRotate = pieces.filter(p => p.userData.currentPosition.x === 1);
      axis = 'x';
      angle = isPrime ? -Math.PI/2 : (isDouble ? Math.PI : Math.PI/2);
      break;
    case 'L': // Left face
      piecesToRotate = pieces.filter(p => p.userData.currentPosition.x === -1);
      axis = 'x';
      angle = isPrime ? Math.PI/2 : (isDouble ? Math.PI : -Math.PI/2);
      break;
    case 'F': // Front face
      piecesToRotate = pieces.filter(p => p.userData.currentPosition.z === 1);
      axis = 'z';
      angle = isPrime ? -Math.PI/2 : (isDouble ? Math.PI : Math.PI/2);
      break;
    case 'B': // Back face
      piecesToRotate = pieces.filter(p => p.userData.currentPosition.z === -1);
      axis = 'z';
      angle = isPrime ? Math.PI/2 : (isDouble ? Math.PI : -Math.PI/2);
      break;
    default:
      console.error(`Unknown move: ${move}`);
      return { piecesToRotate: [], axis: 'y', angle: 0 };
  }
  
  return { piecesToRotate, axis, angle };
};

// Update piece position data after a move
const updatePiecePositionData = (piece, move) => {
  const face = move.charAt(0);
  const direction = move.length > 1 ? move.charAt(1) : '';
  const isPrime = direction === "'";
  const isDouble = direction === '2';
  
  // Get current position
  const { x, y, z } = piece.userData.currentPosition;
  
  // Apply transformation based on the move
  let newPosition = { x, y, z };
  
  if (isDouble) {
    // For double moves, we just need to flip the coordinates
    switch (face) {
      case 'U':
      case 'D':
        newPosition.x = -x;
        newPosition.z = -z;
        break;
      case 'R':
      case 'L':
        newPosition.y = -y;
        newPosition.z = -z;
        break;
      case 'F':
      case 'B':
        newPosition.x = -x;
        newPosition.y = -y;
        break;
    }
  } else {
    // For single moves, we rotate the coordinates
    switch (face) {
      case 'U':
        if (isPrime) {
          newPosition.x = -z;
          newPosition.z = x;
        } else {
          newPosition.x = z;
          newPosition.z = -x;
        }
        break;
      case 'D':
        if (isPrime) {
          newPosition.x = z;
          newPosition.z = -x;
        } else {
          newPosition.x = -z;
          newPosition.z = x;
        }
        break;
      case 'R':
        if (isPrime) {
          newPosition.y = -z;
          newPosition.z = y;
        } else {
          newPosition.y = z;
          newPosition.z = -y;
        }
        break;
      case 'L':
        if (isPrime) {
          newPosition.y = z;
          newPosition.z = -y;
        } else {
          newPosition.y = -z;
          newPosition.z = y;
        }
        break;
      case 'F':
        if (isPrime) {
          newPosition.x = -y;
          newPosition.y = x;
        } else {
          newPosition.x = y;
          newPosition.y = -x;
        }
        break;
      case 'B':
        if (isPrime) {
          newPosition.x = y;
          newPosition.y = -x;
        } else {
          newPosition.x = -y;
          newPosition.y = x;
        }
        break;
    }
  }
  
  // Update the piece's position data
  piece.userData.currentPosition = newPosition;
};
  