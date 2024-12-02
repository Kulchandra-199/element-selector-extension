chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fetchData") {
    // Example API call
    fetch(request.url, { method: "GET" })
      .then((response) => response.json())
      .then((data) => sendResponse({ success: true, data }))
      .catch((error) => sendResponse({ success: false, error: error.message }));

    // Keep the listener alive for async responses
    return true;
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "enableHighlight") {
    chrome.tabs.sendMessage(sender.tab.id, {
      action: "enableHighlight",
      identifier: request.identifier,
    });
    sendResponse({ success: true });
  }
});
