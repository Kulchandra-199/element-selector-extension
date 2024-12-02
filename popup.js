let websites = [];
let selectedWebsite = null;
let isHighlightMode = false;

// DOM Elements
const mainScreen = document.getElementById("mainScreen");
const addNewScreen = document.getElementById("addNewScreen");
const identifierSection = document.getElementById("identifierSection");
const websiteList = document.getElementById("websites");
const addNewBtn = document.getElementById("addNewBtn");
const cancelBtn = document.getElementById("cancelBtn");
const addNewForm = document.getElementById("addNewForm");
const identifierList = document.getElementById("identifierList");
const identifierHeading = document.getElementById("identifierHeading");
const addIdentifierBtn = document.getElementById("addIdentifierBtn");
const identifierInput = document.getElementById("identifierInput");
const backBtn = document.getElementById("backBtn");
const highlightBtn = document.getElementById("highlightBtn");
const startBtn = document.getElementById("startBtn");
const test = document.getElementById("test");
const current = document.getElementById("current");
const addCurrentBtn = document.getElementById("addCurrentBtn");

// ****************************
// Initialization and State Updates
// ****************************

function initializeWebsites() {
  chrome.storage.local.get("websites", (result) => {
    websites = result.websites || [];
    renderWebsites();
  });
}

function saveWebsites() {
  chrome.storage.local.set({ websites }, () => {
    if (selectedWebsite) {
      renderIdentifiers();
    } else {
      renderWebsites();
    }
  });
}

function renderWebsites() {
  websiteList.innerHTML = "";
  websites.forEach((website) => {
    const li = document.createElement("li");
    li.className =
      "flex items-center justify-between bg-gray-700 p-3 rounded-lg";
    li.innerHTML = `
      <span class="text-gray-200">${website.name} <span class="text-sm text-gray-400">(${website.url})</span></span>
      <button class="edit-btn bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded transition duration-300 ease-in-out flex items-center" data-id="${website.id}">
        <i data-feather="edit" class="mr-1"></i> Edit
      </button>
    `;
    websiteList.appendChild(li);

    li.querySelector(".edit-btn").addEventListener("click", () => {
      showIdentifierSection(website);
    });
  });
}

function showIdentifierSection(website) {
  selectedWebsite = website;
  identifierHeading.textContent = `"Manage Identifiers for: ${website.name}"`;

  renderIdentifiers();
  mainScreen.classList.add("hidden");
  identifierSection.classList.remove("hidden");
}
function renderIdentifiers() {
  identifierList.innerHTML = "";
  (selectedWebsite.identifiers || []).forEach((identifier, index) => {
    const li = document.createElement("li");
    li.className =
      "flex items-center justify-between bg-gray-700 p-3 rounded-lg";
    li.innerHTML = `
      <span class="text-gray-200">${
        identifier.name || "Unnamed Identifier"
      }</span>
      <div class=" flex space-x-2">
        <button class="select-btn bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-3 rounded transition duration-300 ease-in-out flex items-center">
          <i data-feather="check" class="mr-1"></i> Select
        </button>
        <button class="delete-btn bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded transition duration-300 ease-in-out flex items-center">
          <i data-feather="trash-2" class="mr-1"></i> Delete
        </button>
      </div>
    `;

    identifierList.appendChild(li);

    li.querySelector(".select-btn").addEventListener("click", () => {
      enableHighlightMode(identifier.name);
    });

    li.querySelector(".delete-btn").addEventListener("click", () => {
      selectedWebsite.identifiers.splice(index, 1);
      saveWebsites();
      renderIdentifiers();
    });
  });
}

// ****************************
// Highlight Mode and Selector Integration
// ****************************

function enableHighlightMode(identifier) {
  isHighlightMode = true;
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: "enableHighlight",
      identifier,
    });
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "saveElement") {
    const { identifier, classes } = request;
    const targetIdentifier = selectedWebsite.identifiers.find(
      (id) => id.name === identifier
    );
    if (targetIdentifier) {
      targetIdentifier.classes = classes;
      saveWebsites();
    }
  }
});

// ****************************
// Navigation and State Management
// ****************************

document.addEventListener("DOMContentLoaded", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    if (currentTab) {
      const currentUrl = currentTab.url;

      // Extract and format the website name
      const websiteName = getWebsiteName(currentUrl);
      document.getElementById("current").textContent = websiteName;
    }
  });
});

addCurrentBtn.addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    if (currentTab) {
      const currentUrl = currentTab.url;

      // Extract and format the website name
      const websiteName = getWebsiteName(currentUrl);
      document.getElementById("current").textContent = websiteName;
      const newWebsite = {
        id: Date.now(),
        name: websiteName,
        url: currentTab.url,
        identifiers: [],
      };
      websites.push(newWebsite);
      saveWebsites();
      addNewForm.reset();
      mainScreen.classList.remove("hidden");
      addNewScreen.classList.add("hidden");
    }
  });
});

// Function to extract the string before ".com" or similar domain extensions
function getWebsiteName(url) {
  try {
    const hostname = new URL(url).hostname; // Extract hostname (e.g., "www.amazon.com")

    // Match and extract the part before ".com", ".org", ".net", etc.
    const match = hostname.match(
      /([^.]+)\.(com|org|net|io|gov|edu|co\.uk|in|us|au)$/i
    );
    if (match) {
      return capitalize(match[1]); // Return the matched string before ".com"
    }

    // Fallback for cases where no match is found
    return "Unknown";
  } catch (error) {
    console.error("Error extracting website name:", error);
    return "Unknown";
  }
}

// Helper function to capitalize the first letter of a string
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

cancelBtn.addEventListener("click", () => {
  mainScreen.classList.remove("hidden");
  addNewScreen.classList.add("hidden");
});

backBtn.addEventListener("click", () => {
  mainScreen.classList.remove("hidden");
  identifierSection.classList.add("hidden");
});

addNewBtn.addEventListener("click", () => {
  // Show the Add New Website screen
  mainScreen.classList.add("hidden");
  addNewScreen.classList.remove("hidden");
});

cancelBtn.addEventListener("click", () => {
  // Cancel and return to the main screen
  mainScreen.classList.remove("hidden");
  addNewScreen.classList.add("hidden");
});

addNewForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const websiteName = document.getElementById("websiteName").value.trim();
  const websiteUrl = document.getElementById("websiteUrl").value.trim();

  if (websiteName && websiteUrl) {
    const newWebsite = {
      id: Date.now(),
      name: websiteName,
      url: websiteUrl,
      identifiers: [],
    };
    websites.push(newWebsite);
    saveWebsites();
    addNewForm.reset();
    mainScreen.classList.remove("hidden");
    addNewScreen.classList.add("hidden");
  }
});

// ****************************
// Identifier Management
// ****************************

addIdentifierBtn.addEventListener("click", () => {
  if (!identifierInput.value.trim()) {
    alert("Identifier cannot be empty!");
    return;
  }
  selectedWebsite.identifiers = selectedWebsite.identifiers || [];
  selectedWebsite.identifiers.push({ name: identifierInput.value.trim() });
  identifierInput.value = "";
  saveWebsites();
});

// ****************************
// Start API Integration
// ****************************

test.addEventListener("click", (e) => {
  // chrome.storage.local.get("websites", (result) => {
  //   console.log("Sending data to API:", result.websites);
  //   // Example API call

  // });
  e.preventDefault();
  chrome.runtime.sendMessage(
    {
      action: "fetchData",
      url: "https://jsonplaceholder.typicode.com/posts/1",
    },
    (response) => {
      if (response.success) {
        console.log("Data:", response.data);
      } else {
        console.error("Error:", response.error);
      }
    }
  );
});

// ****************************
// Initialization
// ****************************

initializeWebsites();
