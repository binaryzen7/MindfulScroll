# Changelog

All notable changes to MindfulScroll will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-XX

### Added
- Initial release of MindfulScroll Chrome Extension
- Site blocking and tracking functionality
- Configurable warning timer (default: 10 seconds for testing)
- System lockdown overlay with 10 psychological warning messages
- Intent-based unlock system with friction mechanism (minimum 5 characters)
- Terminal/hacker-themed UI design
- Extension popup with settings interface
- Real-time timer display in popup
- In-page intent timer (top-left corner, semi-transparent)
- Custom site management (add/remove domains)
- Primary action: Close tab button (green, prominent)
- Secondary action: Unlock with intent (transparent, requires input)
- Smart navigation handling (continues tracking on same-domain navigation)
- Persistent settings storage
- Default blocked sites: Instagram, Twitter, X.com, YouTube, Facebook

### Features
- **10 Warning Messages:**
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

- **UI Components:**
  - Terminal-style popup interface
  - Blinking cursor animation
  - Checkbox-based site management
  - Flash animation on save
  - Compact, transparent timer overlay
  - Full-screen lockdown overlay

- **Timer Features:**
  - Configurable delay (1-60 seconds)
  - Real-time countdown
  - Intent-based unlock duration (1-60 minutes)
  - State persistence across page navigation
  - Automatic overlay on timer expiration

### Technical
- Manifest V3 compliance
- Chrome Storage API for persistence
- Content script injection
- Background service worker
- Message passing between components
- Cross-domain navigation detection
- SPA (Single Page Application) support

### Documentation
- README.md with installation and usage instructions
- PRODUCT_SPECIFICATION.md with detailed feature documentation
- CONTRIBUTING.md with contribution guidelines
- CHANGELOG.md for version history
- LICENSE file (MIT)

---

## [Unreleased]

### Planned
- Daily/weekly time limits
- Statistics and analytics dashboard
- Custom warning messages
- Multiple unlock duration presets
- Pause/resume functionality
- Export/import settings
- Whitelist specific pages
- Schedule-based blocking
- Browser compatibility improvements
- Performance optimizations

---

## Version History Format

- **Added** for new features
- **Changed** for changes in existing functionality
- **Deprecated** for soon-to-be removed features
- **Removed** for now removed features
- **Fixed** for any bug fixes
- **Security** for vulnerability fixes

---

[1.0.0]: https://github.com/yourusername/MindfulScroll/releases/tag/v1.0.0

