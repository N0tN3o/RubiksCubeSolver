// src/components/SolutionSteps.jsx
import { useState, useEffect } from 'react';
import { MOVE_DESCRIPTIONS } from '../config/cubeConfig';

const SolutionSteps = ({ steps, currentStep = -1, onStepChange }) => {
  const [activeStep, setActiveStep] = useState(currentStep);
  
  // Sync with external currentStep when it changes
  useEffect(() => {
    setActiveStep(currentStep);
  }, [currentStep]);

  const handleStepClick = (index) => {
    setActiveStep(index);
    if (onStepChange) {
      onStepChange(index);
    }
  };

  const handleNext = () => {
    const nextStep = Math.min(steps.length - 1, activeStep + 1);
    setActiveStep(nextStep);
    if (onStepChange) {
      onStepChange(nextStep);
    }
  };

  const handlePrevious = () => {
    const prevStep = Math.max(-1, activeStep - 1);
    setActiveStep(prevStep);
    if (onStepChange) {
      onStepChange(prevStep);
    }
  };

  if (!steps || steps.length === 0) {
    return (
      <div className="p-4 bg-gray-50 rounded-md text-gray-500 text-center">
        No solution available. Try solving the cube first.
      </div>
    );
  }

  return (
    <div className="solution-container">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium">
            Solution: {steps.length} moves
          </h3>
          
          <div className="text-sm text-gray-500">
            Step {activeStep >= 0 ? activeStep + 1 : 0} of {steps.length}
          </div>
        </div>
        
        <div className="moves-list">
          {steps.map((move, index) => (
            <button
              key={`${move}-${index}`}
              className={`move-btn ${activeStep === index ? 'active' : ''}`}
              onClick={() => handleStepClick(index)}
              aria-label={`Move ${index + 1}: ${move}`}
              aria-pressed={activeStep === index}
            >
              {move}
            </button>
          ))}
        </div>
      </div>

      {activeStep >= 0 && (
        <div className="step-instruction">
          <div className="flex items-center justify-between">
            <span className="font-medium">Step {activeStep + 1}: {steps[activeStep]}</span>
            <span className="text-sm text-gray-500">({activeStep + 1} of {steps.length})</span>
          </div>
          <p className="text-gray-600 mt-1">
            {MOVE_DESCRIPTIONS[steps[activeStep]] || "Perform this move"}
          </p>
        </div>
      )}

      <div className="navigation-btns">
        <button
          onClick={handlePrevious}
          disabled={activeStep <= -1}
          className={`btn btn-outline ${activeStep <= -1 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Previous
        </button>
        
        <button
          onClick={handleNext}
          disabled={activeStep >= steps.length - 1}
          className={`btn btn-primary ${activeStep >= steps.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SolutionSteps;