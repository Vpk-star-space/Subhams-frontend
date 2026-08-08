import React, { useState, useEffect } from 'react';

const InstallPopup = () => {
  const [isInstallable, setIsInstallable] = useState(false);

  // 🌟 Dynamic State to check if already installed (Bulletproof for Chrome & Safari)
  const [isInstalled, setIsInstalled] = useState(() => {
    if (typeof window === 'undefined') return false;
    const isStandalone = window.matchMedia('(display-mode: standalone), (display-mode: fullscreen), (display-mode: minimal-ui)').matches;
    const isIOS = window.navigator.standalone === true;
    const isSaved = localStorage.getItem('pmms_installed') === 'true';
    return isStandalone || isIOS || isSaved;
  });

  // 1. Capture the Install Event Safely (No more setTimeout loops!)
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault(); // Prevents Chrome's automatic error logs
      window.deferredInstallPrompt = e; 
      setIsInstallable(true); // Triggers our beautiful top banner
    };

    const handleAppInstalled = () => {
      setIsInstalled(true); 
      localStorage.setItem('pmms_installed', 'true'); // Saves forever
      window.deferredInstallPrompt = null;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // 2. THE INSTALL BUTTON CLICK
  const handleInstallClick = async () => {
    const promptEvent = window.deferredInstallPrompt; 
    
    if (!promptEvent) return;
    
    promptEvent.prompt(); // Safely triggers the official Google Install UI
    const { outcome } = await promptEvent.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstallable(false);
      setIsInstalled(true); 
      localStorage.setItem('pmms_installed', 'true'); // Lock it in forever
    }
    window.deferredInstallPrompt = null; 
  };

  // 3. THE NATIVE SHARE LOGIC
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Subhams PMMS',
          text: 'Check out the Subhams Personal Money Management System (PMMS). Secure architecture engineered for financial tracking.',
          url: window.location.origin, 
        });
      } catch (err) { console.log('Share failed', err); }
    } else {
      alert("Copy this link to share: " + window.location.origin);
    }
  };

  return (
    <>
      <style>
        {`
          /* Share Button Liquid Glow */
          @keyframes liquidGlow {
            0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
            70% { box-shadow: 0 0 0 15px rgba(16, 185, 129, 0); }
            100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
          }
          /* Share Icon Gentle Bounce */
          @keyframes iconFloat {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-3px) scale(1.1); }
          }
          /* Banner Slide Down */
          @keyframes bannerSlideDown {
            0% { transform: translateY(-100%); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
        `}
      </style>
      
      {/* ↗️ 1. LIQUID GLASS SHARE BUTTON */}
      <div style={{ 
        position: 'fixed', 
        bottom: '95px', 
        right: '25px',  
        zIndex: 9997 
      }}>
        <button 
          onClick={handleShare} 
          title="Share Subhams PMMS"
          style={{
            padding: '12px 20px', 
            borderRadius: '30px', 
            background: 'rgba(255, 255, 255, 0.8)', 
            backdropFilter: 'blur(12px)', 
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(16, 185, 129, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px', 
            cursor: 'pointer',
            color: '#0f172a', 
            fontWeight: '700',
            fontSize: '14px',
            animation: 'liquidGlow 2.5s infinite', 
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)'
          }}
        >
          <span style={{ 
            fontSize: '18px', 
            animation: 'iconFloat 2s infinite ease-in-out',
            display: 'inline-block' 
          }}>
            ↗️
          </span>
        </button>
      </div>

      {/* 📲 2. THE PREMIUM TOP-BANNER INSTALL (Sleek, No blocking) */}
      {isInstallable && !isInstalled && (
        <div style={{
            background: 'linear-gradient(90deg, #0f172a, #065f46)', // PMMS Secure Dark Green Theme
            color: 'white',
            padding: '12px 15px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            boxSizing: 'border-box',
            zIndex: 99999, // Keeps it above the navbar
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            animation: 'bannerSlideDown 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '28px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>💰</span>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '15px', fontWeight: '900', letterSpacing: '0.5px' }}>Install PMMS Vault</span>
                    <span style={{ fontSize: '11px', color: '#a7f3d0', fontWeight: '600' }}>Secure • Fast • App Access</span>
                </div>
            </div>
            <button 
                onClick={handleInstallClick}
                style={{
                    background: 'linear-gradient(135deg, #facc15, #f59e0b)', // PMMS Gold Button
                    color: '#713f12',
                    border: 'none',
                    padding: '8px 18px',
                    borderRadius: '20px',
                    fontWeight: '900',
                    fontSize: '12px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 10px rgba(245, 158, 11, 0.4)',
                    transition: 'transform 0.2s'
                }}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
                INSTALL APP
            </button>
        </div>
      )}
    </>
  );
};

export default InstallPopup;