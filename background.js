// MindfulScroll - Background Service Worker
// Handles installation and default settings

const DEFAULT_BLOCK_LIST = [
  'instagram.com',
  'twitter.com',
  'x.com',
  'youtube.com',
  'facebook.com'
];

// Initialize default settings on install
chrome.runtime.onInstalled.addListener(async () => {
  const result = await chrome.storage.local.get('blockList');
  
  // Only set defaults if no block list exists
  if (!result.blockList) {
    await chrome.storage.local.set({ blockList: DEFAULT_BLOCK_LIST });
  }
});

// Handle close tab message
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'CLOSE_TAB' && sender.tab?.id) {
    chrome.tabs.remove(sender.tab.id);
    sendResponse({ success: true });
  }
  return true;
});
