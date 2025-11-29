// MindfulScroll - Content Script
// Handles site blocking, lockdown overlay, and intent-based unlock system

// ============================================
// Configuration
// ============================================
let LOCKDOWN_DELAY_MS = 10 * 1000; // Default: 10 seconds (will be loaded from storage)
const MIN_INTENT_LENGTH = 5; // Minimum characters to enable unlock

// ============================================
// Warning Messages
// ============================================
const WARNING_MESSAGES = [
  {
    heading: 'NEUROCHEMICAL DECEPTION',
    headline: 'You are chasing a ghost.',
    body: 'Your brain is currently stuck in a "Reward Prediction Error" loop. It releases dopamine in anticipation of the next post, not the enjoyment of it. You aren\'t scrolling because you are having fun; you are scrolling because your brain believes the next swipe holds the answer. It is a lie.',
    exitStrategy: 'Close your eyes. Realize the craving is for the possibility of reward, not the reward itself. Break the loop.'
  },
  {
    heading: 'SENSORY ADAPTATION',
    headline: 'You are numbing your ability to feel joy.',
    body: 'By flooding your receptors with high-speed, high-contrast stimuli, you are raising your "pleasure baseline." This process, called downregulation, makes the rest of reality—sunsets, conversation, slow work—feel painfully boring by comparison. You are engineering your own depression.',
    exitStrategy: 'Stare at a blank wall for 30 seconds. Reset your baseline sensitivity. Embrace the boredom to heal.'
  },
  {
    heading: 'INFORMATION OBESITY',
    headline: 'You are choking on data.',
    body: 'The human brain is an organ, not a hard drive. It requires silence to metabolize information into wisdom. Right now, you are force-feeding your mind more inputs than it can process, resulting in "Continuous Partial Attention." The fog you feel is mental indigestion.',
    exitStrategy: 'Stop the intake. Close this tab. Do not consume another pixel until you have processed the last 10 minutes.'
  },
  {
    heading: 'CREATIVE ATROPHY',
    headline: 'You are paving over your own thoughts.',
    body: 'Boredom is the trigger for the "Default Mode Network"—the brain state responsible for creativity, long-term planning, and self-reflection. By scrolling the second you feel a lull, you are suppressing your internal monologue with external noise. You are trading your own insights for someone else\'s content.',
    exitStrategy: 'Be bored. Sit there and let your mind wander inward, not outward.'
  },
  {
    heading: 'PHYSIOLOGICAL STRESS',
    headline: 'Your body thinks it is in danger.',
    body: 'Perform a somatic check: Is your jaw clenched? Is your breath shallow? Are your eyes straining? Rapid visual processing triggers a low-level "Fight or Flight" response. You are flooding your bloodstream with cortisol while sitting perfectly still. This is not relaxation; it is physical stress.',
    exitStrategy: 'Exhale fully. Drop your shoulders. The threat is the device. Put it down.'
  },
  {
    heading: 'VOLITION HIJACK',
    headline: 'Who is in control right now?',
    body: 'Your Prefrontal Cortex (the CEO of your brain) has gone offline. You are currently operating on basal ganglia loops—habitual, automatic, and unconscious. You are not choosing to look at this; you are reacting to cues designed by behavioral psychologists to exploit your lack of agency.',
    exitStrategy: 'Prove you have free will. Close the app, not because you "should," but because you say so.'
  },
  {
    heading: 'TIME BLINDNESS',
    headline: 'You are losing contact with reality.',
    body: 'The flow state of infinite scroll creates a dissociation from temporal reality. You are deleting hours of your finite biological lifespan in a state of semi-consciousness. This is time you cannot refund. You are trading your youth for blue light.',
    exitStrategy: 'Say the current time out loud. Acknowledge the cost. Stop the bleeding.'
  },
  {
    heading: 'SOCIAL ISOLATION',
    headline: 'You are lonelier than when you started.',
    body: 'The brain interprets watching faces as social connection, but without eye contact and reciprocity, it is "empty calories." You are stimulating the social centers of your brain without actually connecting, leaving you with a profound sense of isolation and inadequacy.',
    exitStrategy: 'Text a real friend "Hey, want to talk?" or speak to a human in the room. Real connection requires risk.'
  },
  {
    heading: 'ATTENTION DEGRADATION',
    headline: 'You are training your brain to be distracted.',
    body: 'Neurons that fire together, wire together. Every time you give in to the urge to switch tasks, you physically strengthen the neural pathways for distraction. You are training yourself to be incapable of deep work. You are becoming functionally illiterate to long-form thought.',
    exitStrategy: 'Resist the urge. Do one thing, slowly, for 5 minutes. Re-train your focus.'
  },
  {
    heading: 'EXISTENTIAL WAKE-UP',
    headline: 'End the simulation.',
    body: 'You have dissociated. You are a biological consciousness trapped in a digital feedback loop. Look at your hand. Look at the room around you. You exist in the physical world, not in this feed. Return to the surface.',
    exitStrategy: 'CLOSE THE TAB. Stand up. Move your physical body immediately.'
  }
];

// Get random warning message
function getRandomMessage() {
  return WARNING_MESSAGES[Math.floor(Math.random() * WARNING_MESSAGES.length)];
}

// ============================================
// State
// ============================================
let trackingTimer = null;
let unlockTimer = null;
let remainingSeconds = 0;
let currentIntent = '';
let isBlocked = false;
let trackingStartTime = null;
let timeSpentSeconds = 0;
let state = 'idle'; // 'tracking', 'locked', 'unlocked'
let currentDomain = null; // Track current domain to prevent restart on navigation

// ============================================
// Initialization
// ============================================
async function init() {
  try {
    const hostname = window.location.hostname;
    const domain = hostname.replace(/^www\./, ''); // Remove www. prefix for comparison
    
    console.log('[MindfulScroll] Initializing on:', hostname);
    
    // Get settings from storage
    const result = await chrome.storage.local.get(['blockList', 'warningDelay']);
    const blockList = result.blockList || [
      'instagram.com',
      'twitter.com',
      'x.com',
      'youtube.com',
      'facebook.com'
    ];
    
    console.log('[MindfulScroll] Block list:', blockList);
    
    // Load warning delay (default 10 seconds)
    LOCKDOWN_DELAY_MS = (result.warningDelay || 10) * 1000;
    console.log('[MindfulScroll] Warning delay set to:', LOCKDOWN_DELAY_MS / 1000, 'seconds');
    
    // Check if current site is in block list
    isBlocked = blockList.some(site => hostname.includes(site));
    console.log('[MindfulScroll] Site is blocked:', isBlocked, 'for hostname:', hostname);
    
    // If we're on the same domain and already tracking/unlocked, don't restart
    if (currentDomain === domain && (state === 'tracking' || state === 'unlocked')) {
      console.log('[MindfulScroll] Same domain, already tracking/unlocked. Not restarting.');
      return;
    }
    
    // If domain changed or we're starting fresh
    if (isBlocked) {
      // If we were on a different domain, reset state
      if (currentDomain !== domain) {
        console.log('[MindfulScroll] Domain changed from', currentDomain, 'to', domain, '- resetting state');
        currentDomain = domain;
        // Reset tracking if domain changed
        if (trackingTimer) {
          clearTimeout(trackingTimer);
          trackingTimer = null;
        }
        if (unlockTimer) {
          clearInterval(unlockTimer);
          unlockTimer = null;
        }
        state = 'idle';
        trackingStartTime = null;
        timeSpentSeconds = 0;
      }
      
      // Only start tracking if we're not already in a locked state
      if (state === 'idle' || state === 'tracking') {
        console.log('[MindfulScroll] Starting tracking...');
        startTracking();
      } else if (state === 'unlocked') {
        console.log('[MindfulScroll] Already unlocked, continuing countdown...');
        // Don't restart, just continue
      }
    } else {
      console.log('[MindfulScroll] Site not in block list, skipping tracking');
      currentDomain = null;
    }
  } catch (error) {
    console.error('[MindfulScroll] Error in init:', error);
  }
}

// Set up message listener for popup (set up once, outside init)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_TIMER_STATE') {
    sendResponse(getTimerState());
    return true;
  }
  if (message.type === 'RELOAD_SETTINGS') {
    // Reload settings and restart tracking if needed
    init().then(() => {
      sendResponse({ success: true });
    });
    return true;
  }
});

// Get current timer state for popup
function getTimerState() {
  const now = Date.now();
  let elapsed = 0;
  let timeUntilOverlay = 0;
  
  if (state === 'tracking' && trackingStartTime) {
    const currentElapsed = Math.floor((now - trackingStartTime) / 1000);
    elapsed = currentElapsed + timeSpentSeconds;
    timeUntilOverlay = Math.max(0, (LOCKDOWN_DELAY_MS / 1000) - currentElapsed);
  } else if (state === 'unlocked') {
    elapsed = timeSpentSeconds;
    timeUntilOverlay = Math.max(0, remainingSeconds);
  } else if (state === 'locked') {
    elapsed = timeSpentSeconds;
    timeUntilOverlay = 0;
  } else {
    elapsed = timeSpentSeconds;
    timeUntilOverlay = 0;
  }
  
  return {
    state,
    timeSpent: Math.floor(elapsed),
    timeUntilOverlay: Math.floor(timeUntilOverlay),
    intent: currentIntent,
    isBlocked
  };
}

// ============================================
// Tracking Timer (5 minutes)
// ============================================
function startTracking() {
  // Clear any existing timer
  if (trackingTimer) {
    clearTimeout(trackingTimer);
  }
  
  state = 'tracking';
  trackingStartTime = Date.now();
  timeSpentSeconds = 0;
  
  // Update state every second for popup
  const updateInterval = setInterval(() => {
    if (state === 'tracking') {
      updateTimerState();
    } else {
      clearInterval(updateInterval);
    }
  }, 1000);
  
  // Initial state update
  updateTimerState();
  
  trackingTimer = setTimeout(() => {
    console.log('[MindfulScroll] Timer expired! Showing overlay...');
    clearInterval(updateInterval);
    if (document.body) {
      showLockdownOverlay();
    } else {
      console.error('[MindfulScroll] document.body not available!');
    }
  }, LOCKDOWN_DELAY_MS);
  
  console.log(`[MindfulScroll] Tracking started. Overlay will appear in ${LOCKDOWN_DELAY_MS / 1000} seconds`);
  console.log(`[MindfulScroll] Timer ID:`, trackingTimer);
  console.log(`[MindfulScroll] Current time:`, new Date().toISOString());
  console.log(`[MindfulScroll] Overlay will appear at:`, new Date(Date.now() + LOCKDOWN_DELAY_MS).toISOString());
}

// Update timer state in storage
function updateTimerState() {
  const timerState = getTimerState();
  chrome.storage.local.set({ timerState });
}

// ============================================
// Lockdown Overlay
// ============================================
function showLockdownOverlay() {
  console.log('[MindfulScroll] showLockdownOverlay called');
  
  // Update state
  if (trackingStartTime) {
    timeSpentSeconds += Math.floor((Date.now() - trackingStartTime) / 1000);
    trackingStartTime = null;
  }
  state = 'locked';
  updateTimerState();
  
  // Remove any existing overlay or timer
  removeOverlay();
  removeTimer();
  
  // Get random warning message
  const message = getRandomMessage();
  
  console.log('[MindfulScroll] Creating overlay element...');
  const overlay = document.createElement('div');
  overlay.className = 'mindful-lockdown-overlay';
  overlay.id = 'mindful-overlay';
  overlay.innerHTML = `
    <div class="lockdown-container">
      <div class="lockdown-header">
        <h1 class="lockdown-title">SYSTEM LOCKDOWN</h1>
      </div>
      <div class="lockdown-message-content">
        <h2 class="lockdown-heading">${escapeHtml(message.heading)}</h2>
        <h3 class="lockdown-headline">${escapeHtml(message.headline)}</h3>
        <p class="lockdown-body">${escapeHtml(message.body)}</p>
        <div class="lockdown-exit-strategy">
          <strong>The Exit Strategy:</strong> ${escapeHtml(message.exitStrategy)}
        </div>
      </div>
      <div class="lockdown-actions">
        <button class="lockdown-btn lockdown-btn-primary" id="close-tab-btn">[CLOSE TAB]</button>
        <div class="lockdown-form">
          <input 
            class="lockdown-input" 
            id="intent-input" 
            type="text"
            placeholder="Why do you need access?" 
            autocomplete="off"
          />
          <div class="time-input-wrapper">
            <input 
              class="lockdown-input" 
              id="time-input" 
              type="number" 
              min="1" 
              max="60" 
              value="5"
              placeholder="Minutes"
            />
            <span class="time-input-label">minutes</span>
          </div>
          <button class="lockdown-btn lockdown-btn-secondary" id="unlock-btn" disabled>[UNLOCK] <span class="unlock-subtext">- (Use with Intent)</span></button>
        </div>
      </div>
      <p class="lockdown-info">Min ${MIN_INTENT_LENGTH} characters required to unlock</p>
    </div>
  `;
  
  if (!document.body) {
    console.error('[MindfulScroll] Cannot append overlay - document.body is null!');
    return;
  }
  
  document.body.appendChild(overlay);
  console.log('[MindfulScroll] Overlay appended to body');
  
  // Setup friction and unlock logic
  setupUnlockFriction();
  
  // Setup close tab button
  const closeTabBtn = document.getElementById('close-tab-btn');
  if (closeTabBtn) {
    closeTabBtn.addEventListener('click', handleCloseTab);
  }
  
  console.log('[MindfulScroll] Overlay setup complete');
}

// Handle close tab
function handleCloseTab() {
  chrome.runtime.sendMessage({ type: 'CLOSE_TAB' }).catch(() => {
    // Fallback if message fails - try to close via window.close
    window.close();
  });
}

// ============================================
// Friction Logic (>4 characters to enable)
// ============================================
function setupUnlockFriction() {
  const intentInput = document.getElementById('intent-input');
  const unlockBtn = document.getElementById('unlock-btn');
  
  if (!intentInput || !unlockBtn) return;
  
  // Focus input
  intentInput.focus();
  
  // Enable/disable button based on input length
  intentInput.addEventListener('input', () => {
    const length = intentInput.value.trim().length;
    unlockBtn.disabled = length < MIN_INTENT_LENGTH;
  });
  
  // Handle unlock button click
  unlockBtn.addEventListener('click', handleUnlock);
  
  // Handle Enter key
  intentInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !unlockBtn.disabled) {
      handleUnlock();
    }
  });
}

// ============================================
// Unlock Handler
// ============================================
function handleUnlock() {
  const intentInput = document.getElementById('intent-input');
  const timeInput = document.getElementById('time-input');
  
  if (!intentInput) return;
  
  const intent = intentInput.value.trim();
  const minutes = parseInt(timeInput?.value) || 5;
  
  // Validate intent length again
  if (intent.length < MIN_INTENT_LENGTH) return;
  
  // Store intent and calculate seconds
  currentIntent = intent;
  remainingSeconds = minutes * 60;
  state = 'unlocked';
  
  // Remove overlay
  removeOverlay();
  
  // Show intent timer
  showIntentTimer();
  
  // Start countdown
  startUnlockCountdown();
  
  // Update state
  updateTimerState();
}

// ============================================
// Intent Timer (Top-Left Corner)
// ============================================
function showIntentTimer() {
  // Remove any existing timer
  removeTimer();
  
  const timer = document.createElement('div');
  timer.className = 'mindful-intent-timer';
  timer.id = 'mindful-timer';
  timer.innerHTML = `
    <div class="timer-row">
      <span class="timer-label">Intent:</span>
      <span class="timer-value" id="timer-intent">${escapeHtml(currentIntent)}</span>
    </div>
    <div class="timer-row">
      <span class="timer-label">Time:</span>
      <span class="timer-value" id="timer-countdown">${formatTime(remainingSeconds)}</span>
    </div>
  `;
  
  document.body.appendChild(timer);
}

// ============================================
// Countdown Logic
// ============================================
function startUnlockCountdown() {
  // Clear any existing timer
  if (unlockTimer) {
    clearInterval(unlockTimer);
  }
  
  unlockTimer = setInterval(() => {
    remainingSeconds--;
    updateTimerDisplay();
    updateTimerState(); // Update for popup
    
    if (remainingSeconds <= 0) {
      clearInterval(unlockTimer);
      unlockTimer = null;
      removeTimer();
      // When unlock timer expires, show overlay again (only if still on blocked site)
      if (isBlocked) {
        console.log('[MindfulScroll] Unlock time expired, showing overlay again');
        showLockdownOverlay();
      }
    }
  }, 1000);
}

// Update the timer display
function updateTimerDisplay() {
  const countdownEl = document.getElementById('timer-countdown');
  if (countdownEl) {
    countdownEl.textContent = formatTime(remainingSeconds);
  }
}

// ============================================
// Utility Functions
// ============================================

// Format seconds to MM:SS
function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Remove overlay
function removeOverlay() {
  const overlay = document.getElementById('mindful-overlay');
  if (overlay) {
    overlay.remove();
  }
}

// Remove timer
function removeTimer() {
  const timer = document.getElementById('mindful-timer');
  if (timer) {
    timer.remove();
  }
  if (unlockTimer) {
    clearInterval(unlockTimer);
    unlockTimer = null;
  }
}

// ============================================
// Start
// ============================================
console.log('[MindfulScroll] Content script loaded. Document ready state:', document.readyState);

// Run init immediately (content scripts run at document_idle, so DOM should be ready)
// But also wait a bit to ensure page is fully loaded
setTimeout(() => {
  console.log('[MindfulScroll] Running init...');
  init();
}, 100);

// Also handle page navigation (SPA sites) - but don't restart tracking on same domain
let lastUrl = location.href;
let lastHostname = location.hostname;

new MutationObserver(() => {
  const url = location.href;
  const hostname = location.hostname;
  
  // Only re-initialize if hostname changed (different domain)
  // For same-domain navigation (like viewing stories), don't restart tracking
  if (url !== lastUrl && hostname !== lastHostname) {
    lastUrl = url;
    lastHostname = hostname;
    console.log('[MindfulScroll] Domain changed, re-initializing...');
    // Re-check if site is blocked on navigation to different domain
    setTimeout(init, 100);
  } else if (url !== lastUrl) {
    // URL changed but same domain - just update lastUrl, don't restart
    lastUrl = url;
    console.log('[MindfulScroll] URL changed within same domain, not restarting tracking');
  }
}).observe(document, { subtree: true, childList: true });
