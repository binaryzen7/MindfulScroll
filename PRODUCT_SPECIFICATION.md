# MindfulScroll - Product Specification

## Product Overview

**MindfulScroll** is a Chrome Extension (Manifest V3) designed to combat doomscrolling and promote mindful internet usage. The extension interrupts users after a configurable time period on social media and other distracting websites, requiring them to state their intent before continuing to browse.

**Version:** 1.0.0  
**Platform:** Chrome Browser (Manifest V3)  
**Design Aesthetic:** Hacker/Terminal theme with pure black backgrounds, monospace fonts, and green accent colors

---

## Core Features

### 1. Site Blocking & Tracking

- **Default Blocked Sites:**
  - Instagram (instagram.com)
  - Twitter (twitter.com)
  - X.com (x.com)
  - YouTube (youtube.com)
  - Facebook (facebook.com)

- **Custom Site Management:**
  - Users can add custom domains to the block list
  - Checkbox-based interface for enabling/disabling sites
  - Persistent storage of block list preferences

- **Smart Domain Detection:**
  - Tracks time spent on blocked domains
  - Continues tracking across same-domain navigation (e.g., viewing stories, profiles)
  - Only resets tracking when navigating to a different domain

### 2. Configurable Warning Timer

- **Default:** 10 seconds (configurable for testing)
- **Production Default:** 5 minutes (300 seconds)
- **Range:** 1-60 seconds (configurable in popup)
- **User Control:** Adjustable via extension popup settings

### 3. System Lockdown Overlay

When the timer expires, a full-screen overlay appears with:

- **Random Warning Messages:** 10 different psychological warnings including:
  1. Neurochemical Deception
  2. Sensory Adaptation
  3. Information Obesity
  4. Creative Atrophy
  5. Physiological Stress
  6. Volition Hijack
  7. Time Blindness
  8. Social Isolation
  9. Attention Degradation
  10. Existential Wake-Up

- **Message Structure:**
  - Heading (e.g., "NEUROCHEMICAL DECEPTION")
  - Headline (e.g., "You are chasing a ghost.")
  - Body text explaining the psychological impact
  - Exit Strategy with actionable advice

- **Visual Design:**
  - Pure black background (#000000)
  - Red alert title ("SYSTEM LOCKDOWN")
  - Monospace font (Fira Code, JetBrains Mono, Consolas)
  - Terminal/hacker aesthetic

### 4. Intent-Based Unlock System

- **Friction Mechanism:**
  - Unlock button is disabled by default
  - Requires minimum 5 characters in intent field
  - Forces user to consciously state their reason

- **Unlock Process:**
  1. User types their intent (minimum 5 characters)
  2. User specifies time needed (1-60 minutes, default: 5)
  3. Unlock button becomes enabled
  4. User clicks to unlock

- **Intent Timer Display:**
  - Shows user's stated intent
  - Countdown timer for remaining time
  - Positioned at top-left corner
  - Semi-transparent overlay (60% opacity)
  - Compact size to minimize screen obstruction
  - Non-intrusive (pointer-events: none)

### 5. Primary Action: Close Tab

- **Green Primary Button:** "[CLOSE TAB]"
  - Prominent green background
  - Primary call-to-action
  - Closes the current browser tab

- **Secondary Action:** "[UNLOCK] - (Use with Intent)"
  - Transparent with green border
  - Secondary option
  - Requires intent input

### 6. Extension Popup Interface

**Terminal-Style Settings Menu:**

- **Header:** `[MINDFULSCROLL]_` with blinking cursor
- **Status Section:** (Shows when on blocked site)
  - Time on site (elapsed time)
  - Time to overlay (countdown)
- **Target Protocols Section:**
  - Checkboxes for default sites
  - Custom site input field
  - Add/Remove functionality
- **Warning Delay Configuration:**
  - Number input (1-60 seconds)
  - Default: 10 seconds
- **Save System Button:**
  - Flash animation on click
  - Saves all settings to storage

### 7. Real-Time Timer Display

- **In-Page Timer (Top-Left):**
  - Shows intent and countdown
  - Compact, transparent overlay
  - Updates every second
  - Non-blocking (allows clicks through)

- **Popup Timer:**
  - Displays when extension icon is clicked
  - Shows time spent on current site
  - Shows time remaining until overlay
  - Updates every second

---

## Technical Specifications

### Architecture

- **Manifest Version:** 3
- **Permissions:**
  - `storage` - For saving user preferences
  - `activeTab` - For accessing current tab
  - `scripting` - For dynamic content injection
- **Host Permissions:** `<all_urls>` (supports custom sites)

### Files Structure

```
MindfulScroll/
├── manifest.json       # Extension configuration
├── background.js       # Service worker (default settings)
├── content.js          # Main logic (tracking, overlay, timer)
├── popup.html          # Settings interface
├── popup.js            # Settings logic
├── popup.css           # Popup styling (terminal theme)
└── styles.css          # In-page styles (overlay, timer)
```

### State Management

**Tracking States:**
- `idle` - Not tracking
- `tracking` - Timer running (5 minutes or configured delay)
- `locked` - Overlay displayed
- `unlocked` - User granted time with intent

**Storage:**
- `blockList` - Array of blocked domains
- `warningDelay` - Timer delay in seconds
- `timerState` - Current timer state (for popup display)

### Timer Logic

1. **Initial Tracking:**
   - Starts when user visits blocked site
   - Counts down from configured delay
   - Updates state every second

2. **Overlay Trigger:**
   - Appears when timer reaches zero
   - Blocks entire page
   - Requires user action

3. **Unlock Period:**
   - User-specified duration (1-60 minutes)
   - Shows intent timer in corner
   - Counts down remaining time

4. **Loop Behavior:**
   - When unlock time expires, overlay reappears
   - User must state new intent to continue
   - Process repeats

---

## User Interface Elements

### Overlay Components

1. **Header:**
   - "SYSTEM LOCKDOWN" title (red, uppercase)
   - No icon (minimal design)

2. **Message Content:**
   - Random warning message
   - Heading (red, uppercase)
   - Headline (white, bold)
   - Body text (grey)
   - Exit Strategy box (green accent)

3. **Action Buttons:**
   - Primary: "[CLOSE TAB]" (green background)
   - Secondary: "[UNLOCK] - (Use with Intent)" (transparent)

4. **Unlock Form:**
   - Intent input field
   - Time input (with "minutes" label)
   - Unlock button (disabled until 5+ characters)

### Popup Components

1. **Status Section:**
   - Time on site
   - Time to overlay
   - Only visible on blocked sites

2. **Site Management:**
   - Checkboxes for default sites
   - Custom site input
   - Add/Remove buttons

3. **Settings:**
   - Warning delay input
   - Save button

### Timer Display

- **Position:** Top-left corner
- **Size:** Compact (11px font, minimal padding)
- **Background:** 60% black opacity
- **Border:** Subtle white border (20% opacity)
- **Content:**
  - "INTENT: [user's reason]"
  - "TIME: [MM:SS]"

---

## Configuration Options

### User-Configurable Settings

1. **Block List:**
   - Enable/disable default sites
   - Add custom domains
   - Remove custom sites

2. **Warning Delay:**
   - Range: 1-60 seconds
   - Default: 10 seconds (testing)
   - Production: 5 minutes (300 seconds)

3. **Unlock Duration:**
   - Range: 1-60 minutes
   - Default: 5 minutes
   - Set per unlock request

---

## Behavioral Features

### Navigation Handling

- **Same-Domain Navigation:**
  - Tracking continues uninterrupted
  - Timer does not reset
  - Overlay only appears when timer expires

- **Cross-Domain Navigation:**
  - Tracking resets
  - New timer starts if site is blocked

### Tab Management

- **Close Tab Functionality:**
  - Primary action in overlay
  - Closes current tab via background script
  - Encourages user to break scrolling habit

### Persistence

- **Settings Persistence:**
  - Block list saved to `chrome.storage.local`
  - Warning delay saved to `chrome.storage.local`
  - Survives browser restarts

- **Timer Persistence:**
  - Timer state saved every second
  - Popup can display current state
  - Resets on domain change

---

## Design Philosophy

### Aesthetic

- **Terminal/Hacker Theme:**
  - Pure black backgrounds (#000000)
  - Matrix green accents (#00ff41)
  - Monospace fonts
  - Minimal borders
  - No shadows or gradients

### User Experience

- **Friction Over Force:**
  - Requires conscious intent to continue
  - Makes user aware of their behavior
  - Provides psychological insights

- **Non-Intrusive When Unlocked:**
  - Small, transparent timer
  - Doesn't block content
  - Minimal visual footprint

- **Clear Hierarchy:**
  - Primary action (Close Tab) is prominent
  - Secondary action (Unlock) requires effort
  - Encourages mindful decision-making

---

## Future Enhancements (Potential)

- Daily/weekly time limits
- Statistics and analytics
- Custom warning messages
- Multiple unlock duration presets
- Pause/resume functionality
- Export/import settings
- Whitelist specific pages
- Schedule-based blocking

---

## Technical Notes

### Browser Compatibility

- **Chrome:** Full support (Manifest V3)
- **Edge:** Full support (Chromium-based)
- **Other Chromium browsers:** Should work with Manifest V3 support

### Performance

- **Lightweight:** Minimal resource usage
- **Efficient:** Updates timer state every second
- **Non-blocking:** Timer overlay allows clicks through

### Security & Privacy

- **Local Storage Only:** All data stored locally
- **No External Requests:** No data sent to servers
- **No Tracking:** Extension doesn't track user behavior beyond local timer

---

## Version History

**v1.0.0** (Current)
- Initial release
- Core blocking functionality
- Intent-based unlock system
- 10 warning messages
- Configurable timer
- Terminal-themed UI

---

## Support & Documentation

For issues, feature requests, or contributions, refer to the project repository.

**Key Files:**
- `content.js` - Main extension logic
- `popup.js` - Settings interface logic
- `styles.css` - Overlay and timer styling
- `popup.css` - Settings popup styling

