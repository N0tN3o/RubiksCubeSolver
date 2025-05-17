// src/components/Home.jsx
import { useState, useEffect } from 'react';
import Cube from './Cube';
import SolutionSteps from './SolutionSteps';
import ThreeDCube from './ThreeDCube';
import { solveCube, applyMove } from '../utils/SolverEngine';
import { DEFAULT_CUBE_STATE, getStoredConfig, MOVE_DESCRIPTIONS } from '../config/cubeConfig';

const Home = () => {
  // Get stored config or use defaults
  const config = getStoredConfig();
  
  // State for cube configuration
  const [cubeState, setCubeState] = useState(config.defaultState || DEFAULT_CUBE_STATE);
  
  // Solution and UI states
  const [solution, setSolution] = useState([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [solving, setSolving] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('3d'); // '2d' or '3d'
  const [isAnimating, setIsAnimating] = useState(false);
  const [showNotation, setShowNotation] = useState(false);

  // Reset solution when cube state changes
  useEffect(() => {
    setSolution([]);
    setCurrentStep(-1);
    setError(null);
  }, [cubeState]);

  const handleFaceChange = (face, index, color) => {
    setCubeState(prev => ({
      ...prev,
      [face]: prev[face].map((c, i) => i === index ? color : c)
    }));
  };

  const handleSolve = () => {
    try {
      setSolving(true);
      setError(null);
      
      // Get solution using the solver engine
      const solutionMoves = solveCube(cubeState);
      setSolution(solutionMoves);
      setCurrentStep(-1);
    } catch (err) {
      setError("Invalid cube configuration. Please check your inputs.");
      console.error(err);
    } finally {
      setSolving(false);
    }
  };

  // Reset cube state
  const handleReset = () => {
    setCubeState(config.defaultState || DEFAULT_CUBE_STATE);
    setSolution([]);
    setCurrentStep(-1);
    setError(null);
  };
  
  const checkIfCubeSolved = () => {
    try {
      return isCubeSolved(cubeState);
    } catch (error) {
      console.error("Error checking if cube is solved:", error);
      return false;
    }
  };

  const handleStepChange = (step) => {
    if (isAnimating && step > currentStep) return;
    setCurrentStep(step);
    setIsAnimating(true);
  };
  
  const handleRotationComplete = () => {
    setIsAnimating(false);
  };

  const toggleViewMode = () => {
    setViewMode(prev => prev === '2d' ? '3d' : '2d');
  };

  const startAnimation = () => {
    if (solution.length === 0 || isAnimating) return;
    
    // Start animation from beginning or current point
    const startStep = currentStep < 0 ? 0 : currentStep + 1;
    if (startStep >= solution.length) {
      setCurrentStep(-1);
      return;
    }
    
    setCurrentStep(startStep);
    setIsAnimating(true);
  };

  return (
    <div className="home-container">
      <div className="card">
        <div className="flex flex-wrap items-center justify-between mb-4">
          <h2 className="card-title">Rubik's Cube Solver</h2>
          
          <button
            onClick={toggleViewMode}
            className="btn btn-sm btn-outline"
            aria-label={`Switch to ${viewMode === '2d' ? '3D' : '2D'} view`}
          >
            {viewMode === '2d' ? 'Switch to 3D View' : 'Switch to 2D View'}
          </button>
        </div>
        
        {viewMode === '3d' ? (
          <div className="mb-6">
            <ThreeDCube 
              cubeState={cubeState} 
              currentStep={currentStep}
              solutionSteps={solution}
              onRotationComplete={handleRotationComplete}
            />
          </div>
        ) : (
          <Cube cubeState={cubeState} onFaceChange={handleFaceChange} />
        )}
        
        <div className="flex flex-wrap gap-4 justify-center mt-6">
          <button 
            onClick={handleSolve}
            disabled={solving}
            className="btn btn-primary"
          >
            {solving ? 'Solving...' : 'Solve Cube'}
          </button>
          
          {solution.length > 0 && (
            <button 
              onClick={startAnimation}
              disabled={isAnimating}
              className="btn btn-primary"
            >
              {currentStep >= 0 && currentStep < solution.length - 1 
                ? 'Continue Animation' 
                : 'Start Animation'}
            </button>
          )}
          
          <button 
            onClick={handleReset}
            className="btn btn-secondary"
          >
            Reset Cube
          </button>
        </div>
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
            <div className="font-medium">Error</div>
            <div>{error}</div>
          </div>
        )}
      </div>
      
      {solution.length > 0 && (
        <div className="card">
          <h2 className="card-title">Solution</h2>
          <SolutionSteps 
            steps={solution} 
            currentStep={currentStep} 
            onStepChange={handleStepChange} 
          />
        </div>
      )}
      
      <div className="card mt-4">
        <h2 className="card-title">Cube Notation</h2>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-gray-700">
          <div><strong>U</strong>: Upper face clockwise</div>
          <div><strong>U'</strong>: Upper face counter-clockwise</div>
          <div><strong>D</strong>: Down face clockwise</div>
          <div><strong>D'</strong>: Down face counter-clockwise</div>
          <div><strong>R</strong>: Right face clockwise</div>
          <div><strong>R'</strong>: Right face counter-clockwise</div>
          <div><strong>L</strong>: Left face clockwise</div>
          <div><strong>L'</strong>: Left face counter-clockwise</div>
          <div><strong>F</strong>: Front face clockwise</div>
          <div><strong>F'</strong>: Front face counter-clockwise</div>
          <div><strong>B</strong>: Back face clockwise</div>
          <div><strong>B'</strong>: Back face counter-clockwise</div>
        </div>
      </div>
      
      {viewMode === '3d' && (
        <div className="card">
          <h2 className="card-title">Edit Cube</h2>
          <p className="text-gray-600 mb-4">
            Switch to 2D view to edit the cube state, or use the rotation controls below the 3D cube.
          </p>
          
          <div className="flex justify-center gap-2 flex-wrap">
            {['U', "U'", 'R', "R'", 'F', "F'", 'D', "D'", 'L', "L'", 'B', "B'"].map(move => (
              <button
                key={move}
                className="move-btn"
                onClick={() => {
                  // Apply the move to the cube state
                  const newCubeState = applyMove(cubeState, move);
                  setCubeState(newCubeState);
                }}
              >
                {move}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;