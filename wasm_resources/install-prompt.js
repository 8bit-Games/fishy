// Fishy PWA Install Prompt
// Handles "Add to Home Screen" prompts and installation

(function() {
  'use strict';

  let deferredPrompt = null;
  let isInstalled = false;

  // Check if already installed
  if (window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true) {
    isInstalled = true;
    console.log('[Fishy Install] App is already installed');
  }

  // Listen for beforeinstallprompt event
  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('[Fishy Install] Install prompt available');

    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();

    // Stash the event so it can be triggered later
    deferredPrompt = e;

    // Show custom install button
    showInstallUI();
  });

  // Listen for app installed event
  window.addEventListener('appinstalled', (e) => {
    console.log('[Fishy Install] App installed successfully');
    isInstalled = true;
    hideInstallUI();

    // Track installation (analytics)
    trackInstallation();
  });

  function showInstallUI() {
    // Create install button if it doesn't exist
    let installButton = document.getElementById('install-button');

    if (!installButton && !isInstalled) {
      installButton = createInstallButton();
      document.body.appendChild(installButton);
    }

    if (installButton) {
      installButton.style.display = 'block';
    }
  }

  function hideInstallUI() {
    const installButton = document.getElementById('install-button');
    if (installButton) {
      installButton.style.display = 'none';
    }
  }

  function createInstallButton() {
    const button = document.createElement('button');
    button.id = 'install-button';
    button.className = 'pwa-install-button';
    button.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <polyline points="7 10 12 15 17 10" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <line x1="12" y1="15" x2="12" y2="3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span>Install Fishy</span>
    `;

    button.addEventListener('click', handleInstallClick);

    return button;
  }

  async function handleInstallClick() {
    if (!deferredPrompt) {
      console.log('[Fishy Install] No install prompt available');
      showManualInstructions();
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    console.log('[Fishy Install] User choice:', outcome);

    if (outcome === 'accepted') {
      console.log('[Fishy Install] User accepted installation');
    } else {
      console.log('[Fishy Install] User dismissed installation');
    }

    // Clear the deferred prompt
    deferredPrompt = null;

    // Hide the install button
    hideInstallUI();
  }

  function showManualInstructions() {
    // Show platform-specific instructions
    const platform = detectPlatform();
    let instructions = '';

    switch (platform) {
      case 'ios':
        instructions = `
          <div class="install-instructions">
            <h3>Install Fishy on iOS</h3>
            <ol>
              <li>Tap the Share button <svg width="16" height="16" viewBox="0 0 24 24"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg></li>
              <li>Scroll down and tap "Add to Home Screen"</li>
              <li>Tap "Add" to confirm</li>
            </ol>
          </div>
        `;
        break;

      case 'android':
        instructions = `
          <div class="install-instructions">
            <h3>Install Fishy on Android</h3>
            <ol>
              <li>Tap the menu button (⋮)</li>
              <li>Tap "Add to Home screen" or "Install app"</li>
              <li>Follow the prompts to install</li>
            </ol>
          </div>
        `;
        break;

      default:
        instructions = `
          <div class="install-instructions">
            <h3>Install Fishy</h3>
            <p>Look for the install icon in your browser's address bar or menu.</p>
          </div>
        `;
    }

    showModal(instructions);
  }

  function detectPlatform() {
    const ua = navigator.userAgent.toLowerCase();

    if (/iphone|ipad|ipod/.test(ua)) {
      return 'ios';
    } else if (/android/.test(ua)) {
      return 'android';
    } else {
      return 'desktop';
    }
  }

  function showModal(content) {
    const modal = document.createElement('div');
    modal.className = 'install-modal';
    modal.innerHTML = `
      <div class="install-modal-content">
        ${content}
        <button class="install-modal-close">Close</button>
      </div>
    `;

    modal.querySelector('.install-modal-close').addEventListener('click', () => {
      modal.remove();
    });

    document.body.appendChild(modal);
  }

  function trackInstallation() {
    // Send analytics event
    if (window.gtag) {
      window.gtag('event', 'pwa_install', {
        event_category: 'engagement',
        event_label: 'PWA Installation'
      });
    }

    // Could also send to custom analytics endpoint
    console.log('[Fishy Install] Installation tracked');
  }

  // Register service worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('[Fishy SW] Service Worker registered:', registration.scope);

          // Check for updates periodically
          setInterval(() => {
            registration.update();
          }, 60 * 60 * 1000); // Check every hour

          // Listen for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;

            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker available
                showUpdateNotification();
              }
            });
          });
        })
        .catch((error) => {
          console.error('[Fishy SW] Service Worker registration failed:', error);
        });
    });
  }

  function showUpdateNotification() {
    const notification = document.createElement('div');
    notification.className = 'update-notification';
    notification.innerHTML = `
      <div class="update-content">
        <p>A new version of Fishy is available!</p>
        <button class="update-button">Update Now</button>
        <button class="update-dismiss">Later</button>
      </div>
    `;

    notification.querySelector('.update-button').addEventListener('click', () => {
      // Tell the service worker to skip waiting
      navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });

      // Reload the page
      window.location.reload();
    });

    notification.querySelector('.update-dismiss').addEventListener('click', () => {
      notification.remove();
    });

    document.body.appendChild(notification);
  }

  // Expose API for manual control
  window.FishyInstall = {
    isInstalled: () => isInstalled,
    canInstall: () => deferredPrompt !== null,
    install: handleInstallClick,
    showInstructions: showManualInstructions
  };

  console.log('[Fishy Install] Install prompt handler loaded');
})();
