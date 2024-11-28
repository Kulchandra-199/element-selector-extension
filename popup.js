const highlightBtn = document.getElementById('highlightBtn');
const stateDisplay = document.getElementById('state');

// Update the state in the popup
function updateState(isHighlightMode) {
    stateDisplay.textContent = isHighlightMode
        ? 'Highlight Mode: ON'
        : 'Highlight Mode: OFF';
    highlightBtn.textContent = isHighlightMode
        ? 'Disable Highlight Mode'
        : 'Enable Highlight Mode';
}

// Request the current state when popup loads
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "getState" }, (response) => {
        if (response && response.isHighlightMode !== undefined) {
            updateState(response.isHighlightMode);
        } else {
            stateDisplay.textContent = 'Highlight Mode: Unknown';
        }
    });
});

// Toggle highlight mode when button is clicked
highlightBtn.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "toggleHighlight" });
    });
});

// Listen for state updates from content script
chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "updateState") {
        updateState(message.isHighlightMode);
    }
});
