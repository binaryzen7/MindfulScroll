// MindfulScroll - Popup Settings Script
// Manages blocked sites list with checkbox-based UI

// Default sites mapping (checkbox ID -> domain)
const DEFAULT_SITES = {
  'site-instagram': 'instagram.com',
  'site-twitter': 'twitter.com',
  'site-x': 'x.com',
  'site-youtube': 'youtube.com',
  'site-facebook': 'facebook.com'
};

// DOM Elements
const siteList = document.getElementById('site-list');
const newSiteInput = document.getElementById('new-site');
const addSiteBtn = document.getElementById('add-site-btn');
const saveBtn = document.getElementById('save-btn');

// Track custom sites added by user
let customSites = [];

// Timer elements
const timerSection = document.getElementById('timer-section');
const timeSpentEl = document.getElementById('time-spent');
const timeUntilEl = document.getElementById('time-until');

// Initialize on load
document.addEventListener('DOMContentLoaded', async () => {
  await loadSettings();
  // Update timer immediately and then every second
  updateTimerDisplay();
  setInterval(updateTimerDisplay, 1000);
});

// Load settings from storage
async function loadSettings() {
  const result = await chrome.storage.local.get(['blockList', 'warningDelay']);
  const blockList = result.blockList || Object.values(DEFAULT_SITES);
  const warningDelay = result.warningDelay || 10;

  // Update default site checkboxes
  for (const [checkboxId, domain] of Object.entries(DEFAULT_SITES)) {
    const checkbox = document.getElementById(checkboxId);
    if (checkbox) {
      checkbox.checked = blockList.includes(domain);
    }
  }

  // Load custom sites (sites not in defaults)
  customSites = blockList.filter(site => !Object.values(DEFAULT_SITES).includes(site));
  
  // Render custom sites
  customSites.forEach(site => addCustomSiteToList(site));
  
  // Load warning delay
  const warningDelayInput = document.getElementById('warning-delay');
  if (warningDelayInput) {
    warningDelayInput.value = warningDelay;
  }
}

// Add custom site to the list UI
function addCustomSiteToList(domain) {
  const li = document.createElement('li');
  li.className = 'site-item custom-site';
  li.dataset.domain = domain;
  li.innerHTML = `
    <label class="terminal-checkbox">
      <input type="checkbox" checked>
      <span class="checkbox-visual"></span>
      <span class="site-name">${escapeHtml(domain)}</span>
    </label>
    <button class="remove-btn" title="Remove">[X]</button>
  `;
  
  // Add remove handler
  li.querySelector('.remove-btn').addEventListener('click', () => {
    li.remove();
    customSites = customSites.filter(s => s !== domain);
  });
  
  siteList.appendChild(li);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Clean domain input
function cleanDomain(input) {
  let domain = input.trim().toLowerCase();
  // Remove protocol
  domain = domain.replace(/^(https?:\/\/)?(www\.)?/, '');
  // Remove path
  domain = domain.split('/')[0];
  return domain;
}

// Validate domain format
function isValidDomain(domain) {
  const pattern = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/;
  return pattern.test(domain);
}

// Handle Add Site button
function handleAddSite() {
  const domain = cleanDomain(newSiteInput.value);
  
  if (!domain) return;
  
  if (!isValidDomain(domain)) {
    newSiteInput.value = '';
    newSiteInput.placeholder = 'Invalid domain!';
    setTimeout(() => {
      newSiteInput.placeholder = 'domain.com';
    }, 2000);
    return;
  }
  
  // Check if already exists
  const allDomains = [...Object.values(DEFAULT_SITES), ...customSites];
  if (allDomains.includes(domain)) {
    newSiteInput.value = '';
    newSiteInput.placeholder = 'Already added!';
    setTimeout(() => {
      newSiteInput.placeholder = 'domain.com';
    }, 2000);
    return;
  }
  
  customSites.push(domain);
  addCustomSiteToList(domain);
  newSiteInput.value = '';
}

// Handle Save button
async function handleSave() {
  const blockList = [];
  
  // Collect checked default sites
  for (const [checkboxId, domain] of Object.entries(DEFAULT_SITES)) {
    const checkbox = document.getElementById(checkboxId);
    if (checkbox && checkbox.checked) {
      blockList.push(domain);
    }
  }
  
  // Collect checked custom sites
  document.querySelectorAll('.custom-site').forEach(li => {
    const checkbox = li.querySelector('input[type="checkbox"]');
    if (checkbox && checkbox.checked) {
      blockList.push(li.dataset.domain);
    }
  });
  
  // Get warning delay
  const warningDelayInput = document.getElementById('warning-delay');
  const warningDelay = parseInt(warningDelayInput?.value) || 10;
  
  // Save to storage
  await chrome.storage.local.set({ 
    blockList,
    warningDelay 
  });
  
  // Flash animation
  saveBtn.classList.add('flash');
  setTimeout(() => {
    saveBtn.classList.remove('flash');
  }, 300);
  
  // Notify content scripts to reload settings
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.id) {
      chrome.tabs.sendMessage(tab.id, { type: 'RELOAD_SETTINGS' }).catch(() => {});
    }
  } catch (e) {
    // Ignore errors
  }
}

// Event Listeners
addSiteBtn.addEventListener('click', handleAddSite);

newSiteInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    handleAddSite();
  }
});

saveBtn.addEventListener('click', handleSave);

// Update timer display
async function updateTimerDisplay() {
  try {
    // Get active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.url || !tab.url.startsWith('http')) {
      if (timerSection) timerSection.style.display = 'none';
      return;
    }
    
    // Check if current site is in block list
    const hostname = new URL(tab.url).hostname;
    const result = await chrome.storage.local.get('blockList');
    const blockList = result.blockList || Object.values(DEFAULT_SITES);
    const isBlocked = blockList.some(site => hostname.includes(site));
    
    if (!isBlocked) {
      if (timerSection) timerSection.style.display = 'none';
      return;
    }
    
    // Try to get timer state from content script
    let timerState = null;
    try {
      const response = await chrome.tabs.sendMessage(tab.id, { type: 'GET_TIMER_STATE' });
      if (response) {
        timerState = response;
      }
    } catch (e) {
      // Content script may not be ready - try storage as fallback
      const storageResult = await chrome.storage.local.get('timerState');
      timerState = storageResult.timerState;
    }
    
    // Get warning delay for default calculation
    const settings = await chrome.storage.local.get('warningDelay');
    const warningDelay = settings.warningDelay || 10;
    
    // If still no state, show default values
    if (!timerState) {
      timerState = {
        timeSpent: 0,
        timeUntilOverlay: warningDelay,
        isBlocked: true
      };
    }
    
    // Show timer section
    if (timerSection) {
      timerSection.style.display = 'block';
    }
    
    // Format and display times
    if (timeSpentEl) timeSpentEl.textContent = formatTime(timerState.timeSpent || 0);
    if (timeUntilEl) timeUntilEl.textContent = formatTime(timerState.timeUntilOverlay || 0);
    
  } catch (e) {
    console.error('Error updating timer display:', e);
    if (timerSection) timerSection.style.display = 'none';
  }
}

// Format seconds to MM:SS
function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
