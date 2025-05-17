// src/App.jsx
import { useState, useEffect } from 'react';
import Home from './components/Home';
import InstallPrompt from './components/InstallPrompt';
import { registerServiceWorker } from './pwa';
import './App.css';

function App() {
  // State to track active tab
  const [activeTab, setActiveTab] = useState('solver');
  
  // State to track if the app is online
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Register PWA service worker
    registerServiceWorker();
    
    // Handle online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Rubik's Cube Solver</h1>
        
        {/* Online/Offline indicator */}
        <div className="text-center mb-4">
          <span className={`status-badge ${isOnline ? 'status-badge-online' : 'status-badge-offline'}`}>
            <span 
              className="status-indicator" 
              style={{ backgroundColor: isOnline ? '#10b981' : '#ef4444' }}
            ></span>
            {isOnline ? 'Online' : 'Offline Mode'}
          </span>
        </div>
        
        {/* Navigation tabs */}
        <nav className="app-nav">
          <button
            className={`nav-tab ${activeTab === 'solver' ? 'active' : ''}`}
            onClick={() => setActiveTab('solver')}
          >
            Cube Solver
          </button>
          
          <button
            className={`nav-tab ${activeTab === 'guide' ? 'active' : ''}`}
            onClick={() => setActiveTab('guide')}
          >
            How to Use
          </button>
          
          <button
            className={`nav-tab ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            About
          </button>
        </nav>
      </header>
      
      {/* Content based on active tab */}
      {activeTab === 'solver' && <Home />}
      
      {activeTab === 'guide' && (
        <div className="card">
          <h2 className="card-title">How to Use</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-lg">Step 1: Input Your Cube</h3>
              <p className="text-gray-600">
                Use the 2D cube layout to input the current state of your Rubik's cube. 
                Click on any tile and select a color from the color palette.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-lg">Step 2: Solve</h3>
              <p className="text-gray-600">
                Once you've entered the complete cube state, click the "Solve Cube" 
                button to generate the solution.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-lg">Step 3: Follow the Solution</h3>
              <p className="text-gray-600">
                The solution will be displayed as a sequence of moves. You can follow along
                in the 3D view to see the moves being applied, or click through the steps
                at your own pace.
              </p>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <h4 className="font-medium text-blue-800 mb-2">Tips for Accurate Input</h4>
              <ul className="space-y-2 text-blue-700">
                <li><strong>Center pieces:</strong> These determine the color of each face and cannot be moved.</li>
                <li><strong>Orientation matters:</strong> Hold your cube with white on top and green in front.</li>
                <li><strong>Check your work:</strong> Ensure you've entered all 54 tiles correctly.</li>
                <li><strong>Use 3D View:</strong> Switch to 3D view to visualize your cube and the solution.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'about' && (
        <div className="card">
          <h2 className="card-title">About This App</h2>
          
          <p className="mb-4">
            This Rubik's Cube Solver is a Progressive Web App (PWA) built with React, 
            Vite, and Tailwind CSS. It can help you solve any valid Rubik's cube configuration.
          </p>
          
          <h3 className="font-medium text-lg mt-6 mb-2">Features</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>Works offline - install as a PWA</li>
            <li>Responsive design for all devices</li>
            <li>Interactive 3D cube visualization</li>
            <li>Intuitive visual interface</li>
            <li>Fast and efficient solving algorithm</li>
            <li>Step-by-step solution guide</li>
          </ul>
          
          <h3 className="font-medium text-lg mt-6 mb-2">Technology</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>React for the user interface</li>
            <li>Three.js for 3D visualization</li>
            <li>CubeJS for the solving algorithm</li>
            <li>Vite and SWC for fast builds</li>
            <li>PWA capabilities for offline use</li>
            <li>Tailwind CSS for styling</li>
          </ul>
          
          <p className="mt-6 text-sm text-gray-500">
            Built with ❤️ using modern web technologies.
          </p>
        </div>
      )}
      
      <footer className="app-footer">
        <p>
          Rubik's Cube Solver PWA - Made with React & Vite
        </p>
        <p className="mt-2">
          <button 
            className="footer-link"
            onClick={() => window.open('https://github.com/yourusername/rubiks-solver-pwa', '_blank')}
          >
            View Source Code
          </button>
        </p>
      </footer>
      
      {/* PWA Installation Prompt */}
      <InstallPrompt />
    </div>
  );
}

export default App;