// src/components/InstallPrompt.jsx
import { useState, useEffect } from 'react';
import { checkInstallable, installPWA } from '../pwa';

const InstallPrompt = () => {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  
  useEffect(() => {
    // Check if the app is installable
    checkInstallable(setInstallPrompt);
    
    // Show banner if installable and not on iOS (iOS has its own Add to Home Screen)
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (installPrompt && !isIOS) {
      setShowBanner(true);
    }
  }, [installPrompt]);
  
  const handleInstall = async () => {
    const installed = await installPWA(installPrompt);
    if (installed) {
      setShowBanner(false);
      setInstallPrompt(null);
    }
  };
  
  const handleClose = () => {
    setShowBanner(false);
  };
  
  if (!showBanner) return null;
  
  return (
    <div className="install-banner">
      <div className="banner-text">
        <div className="banner-title">Install this app</div>
        <div className="banner-desc">
          Add it to your home screen for quick access and offline use
        </div>
      </div>
      <div className="banner-actions">
        <button 
          onClick={handleInstall}
          className="btn btn-primary btn-sm"
        >
          Install
        </button>
        <button 
          onClick={handleClose} 
          className="banner-close"
          aria-label="Close"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default InstallPrompt;