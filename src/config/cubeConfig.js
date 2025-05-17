// src/config/cubeConfig.js

// Default cube colors
export const DEFAULT_CUBE_COLORS = {
  white: '#ffffff',
  yellow: '#fcd34d',
  red: '#ef4444',
  orange: '#f97316',
  green: '#10b981',
  blue: '#3b82f6'
};

// Default cube face setup
export const DEFAULT_CUBE_STATE = {
  up: Array(9).fill('white'),
  right: Array(9).fill('red'),
  front: Array(9).fill('green'),
  down: Array(9).fill('yellow'),
  left: Array(9).fill('orange'),
  back: Array(9).fill('blue')
};

// Face order for display and processing
export const FACE_ORDER = ['up', 'right', 'front', 'down', 'left', 'back'];

// Readable face names
export const FACE_NAMES = {
  up: 'Top',
  right: 'Right',
  front: 'Front',
  down: 'Bottom', 
  left: 'Left',
  back: 'Back'
};

// Movement notations and descriptions
export const MOVE_DESCRIPTIONS = {
  "U": "Turn the upper (top) face clockwise",
  "U'": "Turn the upper (top) face counter-clockwise",
  "U2": "Turn the upper (top) face twice",
  "D": "Turn the bottom face clockwise",
  "D'": "Turn the bottom face counter-clockwise",
  "D2": "Turn the bottom face twice",
  "L": "Turn the left face clockwise", 
  "L'": "Turn the left face counter-clockwise",
  "L2": "Turn the left face twice",
  "R": "Turn the right face clockwise",
  "R'": "Turn the right face counter-clockwise",
  "R2": "Turn the right face twice",
  "F": "Turn the front face clockwise",
  "F'": "Turn the front face counter-clockwise",
  "F2": "Turn the front face twice",
  "B": "Turn the back face clockwise",
  "B'": "Turn the back face counter-clockwise",
  "B2": "Turn the back face twice"
};

// 3D visualization settings
export const THREEJS_CONFIG = {
  cameraPosition: { x: 0, y: 0, z: 7 },
  cameraFov: 45,
  rotationSpeed: 0.005,
  backgroundColor: 0xf3f4f6,
  ambientLightColor: 0xffffff,
  ambientLightIntensity: 0.6,
  directionalLightColor: 0xffffff,
  directionalLightIntensity: 0.8,
  directionalLightPosition: { x: 5, y: 5, z: 5 },
  cubeSize: 1,
  gap: 0.05,
  animationDuration: 500, // in ms
};

// PWA settings
export const PWA_CONFIG = {
  appName: "Rubik's Cube Solver",
  appShortName: "RubikSolver",
  appDescription: "A PWA to solve Rubik's cubes with interactive 3D visualization"
};

// Get stored config from localStorage or use defaults
export const getStoredConfig = () => {
  try {
    const storedConfig = localStorage.getItem('cubeConfig');
    if (storedConfig) {
      return JSON.parse(storedConfig);
    }
  } catch (error) {
    console.error('Error reading stored config:', error);
  }
  
  return {
    cubeColors: DEFAULT_CUBE_COLORS,
    defaultState: DEFAULT_CUBE_STATE,
    threejsConfig: THREEJS_CONFIG
  };
};

// Save config to localStorage
export const saveConfig = (config) => {
  try {
    localStorage.setItem('cubeConfig', JSON.stringify(config));
    return true;
  } catch (error) {
    console.error('Error saving config:', error);
    return false;
  }
};