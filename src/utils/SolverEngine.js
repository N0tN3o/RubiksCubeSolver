// src/utils/solverEngine.js
import Cube from 'cubejs';
import { DEFAULT_CUBE_STATE } from '../config/cubeConfig';

// Convert our app's cube representation to the format expected by cubejs
const convertToSolverFormat = (cubeState) => {
  // CubeJS format uses: URFDLB (Up, Right, Front, Down, Left, Back)
  // Each face is represented in reading order: Left-to-right, top-to-bottom
  
  // Color mapping from our app to cubejs
  const colorToFacelet = {
    'white': 'U',
    'red': 'R',
    'green': 'F',
    'yellow': 'D',
    'orange': 'L',
    'blue': 'B'
  };
  
  // Create a string with 54 characters (9 per face) in URFDLB order
  let facelets = '';
  
  // Add faces in cubejs expected order
  const orderedFaces = ['up', 'right', 'front', 'down', 'left', 'back'];
  
  for (const face of orderedFaces) {
    for (const color of cubeState[face]) {
      facelets += colorToFacelet[color];
    }
  }
  
  return facelets;
};

// Validate if the cube state is valid
const validateCubeState = (cubeState) => {
  // Check if we have exactly:
  // - 9 of each color
  // - Each center piece matches expected color
  
  const centerIndices = {
    'up': 4,    // White center
    'right': 4, // Red center
    'front': 4, // Green center
    'down': 4,  // Yellow center
    'left': 4,  // Orange center
    'back': 4   // Blue center
  };
  
  // Check center pieces
  const expectedCenters = {
    'up': 'white',
    'right': 'red',
    'front': 'green',
    'down': 'yellow',
    'left': 'orange',
    'back': 'blue'
  };
  
  for (const [face, centerIndex] of Object.entries(centerIndices)) {
    if (cubeState[face][centerIndex] !== expectedCenters[face]) {
      throw new Error(`Invalid cube: ${face} center piece must be ${expectedCenters[face]}`);
    }
  }
  
  // Count colors
  const colorCount = {
    'white': 0,
    'red': 0,
    'green': 0,
    'yellow': 0,
    'orange': 0,
    'blue': 0
  };
  
  for (const face of Object.keys(cubeState)) {
    for (const color of cubeState[face]) {
      colorCount[color]++;
    }
  }
  
  // Check if we have exactly 9 of each color
  for (const [color, count] of Object.entries(colorCount)) {
    if (count !== 9) {
      throw new Error(`Invalid cube: expected 9 ${color} pieces, but found ${count}`);
    }
  }
  
  return true;
};

// Apply a move to the cube state
export const applyMove = (cubeState, move) => {
  try {
    // Convert to CubeJS format
    const facelets = convertToSolverFormat(cubeState);
    
    // Initialize and create the cube
    let cube = Cube.fromString(facelets);
    
    // Apply the move
    cube = cube.move(move);
    
    // Convert back to our format
    return convertFromSolverFormat(cube.asString());
  } catch (error) {
    console.error("Error applying move:", error);
    return cubeState;
  }
};

// Convert from CubeJS format back to our app's format
const convertFromSolverFormat = (facelets) => {
  // CubeJS format uses: URFDLB (Up, Right, Front, Down, Left, Back)
  // Map facelet letters to colors
  const faceletToColor = {
    'U': 'white',
    'R': 'red',
    'F': 'green',
    'D': 'yellow',
    'L': 'orange',
    'B': 'blue'
  };
  
  // Create a new cube state object
  const cubeState = {
    up: [],
    right: [],
    front: [],
    down: [],
    left: [],
    back: []
  };
  
  // Map of face indices in the string
  const faceIndices = {
    up: 0,
    right: 9,
    front: 18,
    down: 27,
    left: 36,
    back: 45
  };
  
  // Populate each face
  for (const [face, startIndex] of Object.entries(faceIndices)) {
    for (let i = 0; i < 9; i++) {
      const facelet = facelets[startIndex + i];
      cubeState[face].push(faceletToColor[facelet]);
    }
  }
  
  return cubeState;
};

// Solve the cube
export const solveCube = (cubeState = DEFAULT_CUBE_STATE) => {
  try {
    // First validate the cube state
    validateCubeState(cubeState);
    
    // Convert our app's cube representation to cubejs format
    const facelets = convertToSolverFormat(cubeState);
    
    // Initialize and solve the cube
    Cube.initSolver();
    const cube = Cube.fromString(facelets);
    
    // Get solution
    const solution = cube.solve();
    
    // Convert solution to array of moves
    return solution.split(' ').filter(move => move.length > 0);
    
  } catch (error) {
    console.error("Error solving cube:", error);
    throw new Error("Failed to solve cube. Please check the cube configuration.");
  }
};

// Generate a random scramble
export const generateScramble = (moves = 20) => {
  const possibleMoves = ['U', "U'", 'U2', 'D', "D'", 'D2', 'R', "R'", 'R2', 'L', "L'", 'L2', 'F', "F'", 'F2', 'B', "B'", 'B2'];
  const scramble = [];
  
  let lastFace = null;
  
  for (let i = 0; i < moves; i++) {
    let moveIndex;
    let move;
    let face;
    
    // Avoid moves on the same face consecutively
    do {
      moveIndex = Math.floor(Math.random() * possibleMoves.length);
      move = possibleMoves[moveIndex];
      face = move.charAt(0);
    } while (face === lastFace);
    
    scramble.push(move);
    lastFace = face;
  }
  
  return scramble;
};

// Apply a scramble to a solved cube
export const applyScramble = (scramble, initialCubeState = DEFAULT_CUBE_STATE) => {
  let cubeState = { ...initialCubeState };
  
  for (const move of scramble) {
    cubeState = applyMove(cubeState, move);
  }
  
  return cubeState;
};