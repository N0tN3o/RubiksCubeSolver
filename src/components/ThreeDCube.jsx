// src/components/ThreeDCube.jsx
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { createCubePieces, animateCubeMove } from '../utils/threejsUtils';
import { THREEJS_CONFIG } from '../config/cubeConfig';

const ThreeDCube = ({ 
  cubeState, 
  currentStep = -1, 
  solutionSteps = [], 
  onRotationComplete,
  config = THREEJS_CONFIG
}) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const piecesRef = useRef([]);
  const animatingRef = useRef(false);
  
  // State to track if the component is mounted
  const [isMounted, setIsMounted] = useState(false);

  // Function to reset camera position and orientation
  const handleResetOrientation = () => {
    if (!cameraRef.current || !controlsRef.current) return;
    
    // Reset camera position
    cameraRef.current.position.set(
      config.cameraPosition.x,
      config.cameraPosition.y,
      config.cameraPosition.z
    );
    
    // Reset controls target
    controlsRef.current.target.set(0, 0, 0);
    controlsRef.current.update();
  };

  useEffect(() => {
    const mountElement = mountRef.current;
    if (!mountElement) return;
    
    // Set up scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(config.backgroundColor);
    sceneRef.current = scene;
    
    // Set up camera
    const camera = new THREE.PerspectiveCamera(
      config.cameraFov,
      mountElement.clientWidth / mountElement.clientHeight,
      0.1,
      1000
    );
    camera.position.set(
      config.cameraPosition.x,
      config.cameraPosition.y,
      config.cameraPosition.z
    );
    cameraRef.current = camera;
    
    // Set up renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountElement.clientWidth, mountElement.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountElement.innerHTML = '';
    mountElement.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Set up lighting
    const ambientLight = new THREE.AmbientLight(
      config.ambientLightColor,
      config.ambientLightIntensity
    );
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(
      config.directionalLightColor,
      config.directionalLightIntensity
    );
    directionalLight.position.set(
      config.directionalLightPosition.x,
      config.directionalLightPosition.y,
      config.directionalLightPosition.z
    );
    scene.add(directionalLight);
    
    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.7;
    controls.minDistance = 4; // Minimum zoom distance
    controls.maxDistance = 15; // Maximum zoom distance
    controlsRef.current = controls;
    
    // Add cube pieces
    const pieces = createCubePieces(cubeState, config);
    pieces.forEach(piece => scene.add(piece));
    piecesRef.current = pieces;
    
    // Animation loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!mountRef.current) return;
      
      controls.update();
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current || !camera || !renderer) return;
      
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    setIsMounted(true);
    
    // Cleanup function
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      
      // Clean up Three.js resources
      if (renderer) {
        if (mountElement) {
          try {
            mountElement.removeChild(renderer.domElement);
          } catch (e) {
            console.log('Element already removed:', e);
          }
        }
        renderer.dispose();
      }
      
      if (pieces.length > 0) {
        pieces.forEach(piece => {
          if (piece.geometry) piece.geometry.dispose();
          if (piece.material) {
            if (Array.isArray(piece.material)) {
              piece.material.forEach(mat => mat.dispose());
            } else {
              piece.material.dispose();
            }
          }
        });
      }
      
      if (controls) controls.dispose();
      
      setIsMounted(false);
    };
  }, [cubeState, config]); // Added cubeState and config to dependency array
  
  // Update cube when cubeState changes
  useEffect(() => {
    if (!isMounted || !sceneRef.current) return;
    
    // Remove old pieces
    piecesRef.current.forEach(piece => {
      if (piece.parent) {
        piece.parent.remove(piece);
      }
      if (piece.geometry) piece.geometry.dispose();
      if (piece.material) {
        if (Array.isArray(piece.material)) {
          piece.material.forEach(mat => mat.dispose());
        } else {
          piece.material.dispose();
        }
      }
    });
    
    // Create new pieces
    const pieces = createCubePieces(cubeState, config);
    pieces.forEach(piece => sceneRef.current.add(piece));
    piecesRef.current = pieces;
    
  }, [cubeState, isMounted, config]); // Add config to dependency array
  
  // Execute animation when current step changes
  useEffect(() => {
    if (!isMounted || currentStep < 0 || currentStep >= solutionSteps.length || animatingRef.current) return;
    
    const move = solutionSteps[currentStep];
    animatingRef.current = true;
    
    animateCubeMove(piecesRef.current, move, () => {
      animatingRef.current = false;
      if (onRotationComplete) {
        onRotationComplete(currentStep);
      }
    }, config);
    
  }, [currentStep, solutionSteps, isMounted, onRotationComplete, config]); // Add config to dependency array
  
  // Add manual rotation controls
  const handleRotate = (move) => {
    if (animatingRef.current) return;
    
    animatingRef.current = true;
    animateCubeMove(piecesRef.current, move, () => {
      animatingRef.current = false;
    }, config);
  };
  
  return (
    <div className="cube-3d-wrapper">
      <div className="relative">
        <button 
          className="control-btn reset-btn absolute top-2 right-2 z-10"
          onClick={handleResetOrientation}
          aria-label="Reset cube orientation"
          title="Reset View"
        >
          ↻
        </button>
        <div 
          ref={mountRef} 
          className="cube-3d-container"
        />
      </div>
      
      <div className="cube-controls">
        <button className="control-btn" onClick={() => handleRotate('U')} aria-label="Rotate upper face clockwise">U</button>
        <button className="control-btn" onClick={() => handleRotate("U'")} aria-label="Rotate upper face counter-clockwise">U'</button>
        <button className="control-btn" onClick={() => handleRotate('U2')} aria-label="Rotate upper face twice">U2</button>
        
        <button className="control-btn" onClick={() => handleRotate('D')} aria-label="Rotate down face clockwise">D</button>
        <button className="control-btn" onClick={() => handleRotate("D'")} aria-label="Rotate down face counter-clockwise">D'</button>
        <button className="control-btn" onClick={() => handleRotate('D2')} aria-label="Rotate down face twice">D2</button>
        
        <button className="control-btn" onClick={() => handleRotate('R')} aria-label="Rotate right face clockwise">R</button>
        <button className="control-btn" onClick={() => handleRotate("R'")} aria-label="Rotate right face counter-clockwise">R'</button>
        <button className="control-btn" onClick={() => handleRotate('R2')} aria-label="Rotate right face twice">R2</button>
        
        <button className="control-btn" onClick={() => handleRotate('L')} aria-label="Rotate left face clockwise">L</button>
        <button className="control-btn" onClick={() => handleRotate("L'")} aria-label="Rotate left face counter-clockwise">L'</button>
        <button className="control-btn" onClick={() => handleRotate('L2')} aria-label="Rotate left face twice">L2</button>
        
        <button className="control-btn" onClick={() => handleRotate('F')} aria-label="Rotate front face clockwise">F</button>
        <button className="control-btn" onClick={() => handleRotate("F'")} aria-label="Rotate front face counter-clockwise">F'</button>
        <button className="control-btn" onClick={() => handleRotate('F2')} aria-label="Rotate front face twice">F2</button>
        
        <button className="control-btn" onClick={() => handleRotate('B')} aria-label="Rotate back face clockwise">B</button>
        <button className="control-btn" onClick={() => handleRotate("B'")} aria-label="Rotate back face counter-clockwise">B'</button>
        <button className="control-btn" onClick={() => handleRotate('B2')} aria-label="Rotate back face twice">B2</button>
      </div>
    </div>
  );
};

export default ThreeDCube;