import { registerSW } from 'virtual:pwa-register';

// This is called when the page is loaded
export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    // Register the service worker
    const updateSW = registerSW({
      onNeedRefresh() {
        // Show a prompt to the user asking if they want to update
        if (confirm('New content available. Reload to update?')) {
          updateSW(true);
        }
      },
      onOfflineReady() {
        console.log('App ready to work offline');
        // You could show a toast notification here
      },
    });
    
    // Return the update function for use in components
    return updateSW;
  }
  
  return null;
};

// Check if the app can be installed
export const checkInstallable = (setInstallPrompt) => {
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later
    setInstallPrompt(e);
  });
};

// Install the PWA
export const installPWA = async (installPrompt) => {
  if (!installPrompt) return false;
  
  // Show the install prompt
  installPrompt.prompt();
  
  // Wait for the user to respond to the prompt
  const choiceResult = await installPrompt.userChoice;
  
  // User accepted the install prompt
  return choiceResult.outcome === 'accepted';
};