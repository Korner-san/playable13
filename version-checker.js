// Version Checker Utility
// This can be included in any web project to check for updates

class VersionChecker {
  constructor(options = {}) {
    this.currentVersion = options.currentVersion || '1.0.0';
    this.checkInterval = options.checkInterval || 30000; // 30 seconds
    this.endpoint = options.endpoint || '/api/version';
    this.onUpdateAvailable = options.onUpdateAvailable || this.defaultUpdateHandler;
    this.isChecking = false;
  }

  // Get version from package.json or manifest
  async getCurrentVersion() {
    try {
      // For development, try to get from package.json
      const response = await fetch('/package.json');
      if (response.ok) {
        const packageJson = await response.json();
        return packageJson.version;
      }
    } catch (error) {
      console.warn('Could not fetch package.json, using fallback version');
    }
    
    // Fallback to configured version
    return this.currentVersion;
  }

  // Check for new version from server
  async checkForUpdates() {
    if (this.isChecking) return;
    
    this.isChecking = true;
    
    try {
      const response = await fetch(this.endpoint);
      
      if (response.ok) {
        const data = await response.json();
        const serverVersion = data.version;
        const currentVersion = await this.getCurrentVersion();
        
        if (this.isNewVersion(currentVersion, serverVersion)) {
          this.onUpdateAvailable({
            currentVersion,
            newVersion: serverVersion,
            updateUrl: data.updateUrl || window.location.href
          });
        }
      }
    } catch (error) {
      console.warn('Version check failed:', error.message);
    } finally {
      this.isChecking = false;
    }
  }

  // Compare version strings (basic semantic versioning)
  isNewVersion(current, server) {
    const currentParts = current.split('.').map(Number);
    const serverParts = server.split('.').map(Number);
    
    for (let i = 0; i < Math.max(currentParts.length, serverParts.length); i++) {
      const currentPart = currentParts[i] || 0;
      const serverPart = serverParts[i] || 0;
      
      if (serverPart > currentPart) return true;
      if (serverPart < currentPart) return false;
    }
    
    return false;
  }

  // Default update notification
  defaultUpdateHandler({ currentVersion, newVersion, updateUrl }) {
    const message = `New version available: ${newVersion} (current: ${currentVersion})`;
    
    if (confirm(`${message}\n\nWould you like to update now?`)) {
      window.location.reload();
    }
  }

  // Start automatic checking
  startChecking() {
    // Check immediately
    this.checkForUpdates();
    
    // Set up interval checking
    this.intervalId = setInterval(() => {
      this.checkForUpdates();
    }, this.checkInterval);
    
    console.log(`Version checking started (interval: ${this.checkInterval}ms)`);
  }

  // Stop automatic checking
  stopChecking() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('Version checking stopped');
    }
  }

  // Manual version check
  async manualCheck() {
    console.log('Performing manual version check...');
    await this.checkForUpdates();
  }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VersionChecker;
}

// Global access for script tags
if (typeof window !== 'undefined') {
  window.VersionChecker = VersionChecker;
}

// Example usage:
/*
const versionChecker = new VersionChecker({
  currentVersion: '1.0.0',
  checkInterval: 60000, // 1 minute
  endpoint: '/api/version',
  onUpdateAvailable: ({ currentVersion, newVersion }) => {
    // Custom update notification
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="position: fixed; top: 20px; right: 20px; background: #007bff; color: white; padding: 15px; border-radius: 5px; z-index: 9999;">
        <div>Update available: v${newVersion}</div>
        <button onclick="window.location.reload()">Update Now</button>
        <button onclick="this.parentElement.remove()">Later</button>
      </div>
    `;
    document.body.appendChild(notification);
  }
});

// Start checking for updates
versionChecker.startChecking();
*/ 