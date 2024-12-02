let isHighlightMode = false;
let highlightedElement = null;
let currentIdentifier = null;

let selectedElements = {};

// (async function () {
//   // Function to fetch data from the endpoint
//   async function fetchData() {
//     try {
//       const response = await fetch("http://localhost:3000/posts"); // Replace with your API URL
//       if (!response.ok)
//         throw new Error(`HTTP error! status: ${response.status}`);

//       const data = await response.json();
//       console.log("Fetched data:", data);

//       // Process the fetched data
//       processWebsites(data);
//     } catch (error) {
//       console.error("Failed to fetch website data:", error);
//     }
//   }

//   // Function to process the list of websites
//   function processWebsites(data) {
//     // Example: Log website names and IDs
//     data.forEach((site) => {
//       console.log(`Website: ${site.name}, ID: ${site.id}`);
//     });

//     // You can also store the data in `chrome.storage` for later use
//     chrome.storage.local.set({ websites: data }, () => {
//       console.log("Website data saved locally.");
//     });
//   }

//   // Check if the content script is running in the main frame
//   if (window === window.top) {
//     console.log("Page loaded:", window.location.href);
//     await fetchData(); // Fetch the data when the page loads
//   }
// })();

function createTooltip(element, identifier) {
  // Remove existing tooltips
  document
    .querySelectorAll(".ext-element-highlighter-tooltip")
    .forEach((el) => el.remove());

  // Create a host element for Shadow DOM
  const tooltipHost = document.createElement("div");
  tooltipHost.className = "ext-element-highlighter-tooltip";

  // Attach Shadow DOM
  const shadow = tooltipHost.attachShadow({ mode: "open" });
  const tooltipContent = document.createElement("div");
  tooltipContent.textContent = identifier
    ? `Identifier: ${identifier}`
    : `Tag: ${element.tagName}`;

  shadow.appendChild(tooltipContent);
  document.body.appendChild(tooltipHost);

  const rect = element.getBoundingClientRect();
  tooltipHost.style.position = "fixed";
  tooltipHost.style.top = `${rect.bottom + 5}px`;
  tooltipHost.style.left = `${rect.left}px`;
}

// Handle mouse movement
function handleMouseMove(e) {
  if (!isHighlightMode) return;
  if (highlightedElement)
    highlightedElement.classList.remove("ext-element-highlighter-hover");
  highlightedElement = e.target;
  highlightedElement.classList.add("ext-element-highlighter-hover");
  createTooltip(highlightedElement, currentIdentifier);
}

// Remove dynamically added styles and tooltips
function cleanUp() {
  document
    .querySelectorAll(".ext-element-highlighter-hover")
    .forEach((el) => el.classList.remove("ext-element-highlighter-hover"));
  document
    .querySelectorAll(".ext-element-highlighter-tooltip")
    .forEach((el) => el.remove());
}

// Toggle highlight mode
function toggleHighlight(identifier) {
  isHighlightMode = !isHighlightMode;
  if (isHighlightMode) {
    document.addEventListener("mousemove", handleMouseMove);

    document.addEventListener("click", (e) => {
      if (!isHighlightMode || !highlightedElement) return;

      if (identifier) {
        saveElementData(identifier, highlightedElement);
        isHighlightMode = false;
        highlightedElement.classList.remove("ext-element-highlighter-hover");
        document
          .querySelectorAll(".ext-element-highlighter-tooltip")
          .forEach((el) => el.remove());

        alert(
          `Saved ${identifier} with classes: ${selectedElements[identifier]}`
        );
      }
    });
  } else {
    document.removeEventListener("mousemove", handleMouseMove);
    cleanUp(); // Ensure all styles and elements are removed
  }
  // document.addEventListener("click", handleElementSelection);
  chrome.runtime.sendMessage({ action: "updateState", isHighlightMode });
}

function saveElementData(identifier, element) {
  const classes = Array.from(element.classList).join(" ");
  selectedElements[identifier] = classes;

  // Store in chrome.storage.local
  chrome.storage.local.set({ selectedElements }, () => {
    console.log(`Saved: ${identifier} => ${classes}`);
  });
}

// document.addEventListener("click", (e) => {
//   if (!isHighlightMode || !highlightedElement) return;

//   const identifier = prompt("Enter identifier for this element:");
//   if (identifier) {
//     saveElementData(identifier, highlightedElement);
//     alert(`Saved ${identifier} with classes: ${selectedElements[identifier]}`);
//   }
// });

// function handleElementSelection(event, identifier) {
//   event.preventDefault();
//   const element = event.target;
//   const classes = Array.from(element.classList).join(" ");
//   // chrome.runtime.sendMessage({
//   //   action: "saveElement",
//   //   identifier: identifier,
//   //   classes,
//   // });
// }

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "enableHighlight") {
    currentIdentifier = request.identifier;
    // document.removeEventListener("click", handleElementSelection());
    toggleHighlight(currentIdentifier);
  }
});

// // Listen for messages from popup
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.action === "toggleHighlight") toggleHighlight();
// });
