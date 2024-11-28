let isHighlightMode = false;
let highlightedElement = null;

// Function to create the tooltip element
function createTooltip(element) {
    document.querySelectorAll('.element-highlighter-tooltip').forEach(el => el.remove());
    const tooltip = document.createElement('div');
    tooltip.className = 'element-highlighter-tooltip';
    const classes = Array.from(element.classList);
    const classText = classes.length > 0 ? `Classes: ${classes.join(', ')}` : 'No classes';
    tooltip.innerHTML = `<div><strong>Tag:</strong> ${element.tagName}</div><div>${classText}</div>`;
    const rect = element.getBoundingClientRect();
    tooltip.style.position = 'fixed';
    tooltip.style.top = `${rect.bottom + 5}px`;
    tooltip.style.left = `${rect.left}px`;
    tooltip.style.zIndex = '10000';
    tooltip.style.background = 'rgba(50, 50, 50, 0.9)';
    tooltip.style.color = '#fff';
    tooltip.style.padding = '8px';
    tooltip.style.borderRadius = '6px';
    tooltip.style.fontSize = '12px';
    tooltip.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
    document.body.appendChild(tooltip);
}

// Handle mouse movement
function handleMouseMove(e) {
    if (!isHighlightMode) return;
    if (highlightedElement) highlightedElement.classList.remove('element-highlighter-hover');
    highlightedElement = e.target;
    highlightedElement.classList.add('element-highlighter-hover');
    createTooltip(highlightedElement);
}

// Toggle highlight mode
function toggleHighlight() {
    isHighlightMode = !isHighlightMode;
    if (isHighlightMode) {
        document.addEventListener('mousemove', handleMouseMove);
    } else {
        document.removeEventListener('mousemove', handleMouseMove);
        if (highlightedElement) highlightedElement.classList.remove('element-highlighter-hover');
        document.querySelectorAll('.element-highlighter-tooltip').forEach(el => el.remove());
        highlightedElement = null;
    }
    // Notify popup about the state
    chrome.runtime.sendMessage({ action: "updateState", isHighlightMode });
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "toggleHighlight") toggleHighlight();
});
