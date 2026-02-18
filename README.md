# Element Selector Extension

A lightweight Chrome extension designed to simplify the process of identifying and selecting web elements. This tool is perfect for developers, testers, and automation engineers who need to quickly extract element selectors (specifically class names) for web scraping, testing frameworks, or other automation tasks.

## Features

- **🔍 Visual Highlighting**: Instantly highlights elements on the webpage as you hover over them, giving you immediate visual feedback.
- **🏷️ Custom Identifiers**: Assign unique identifiers to elements before selecting them, making it easy to map business logic to DOM elements.
- **💾 Automatic Class Extraction**: When you click an element, the extension automatically simplifies the selection process by capturing the element's class names.
- **📦 Local Storage Support**: Saves your selected element data (identifier + class names) locally, ensuring you don't lose your work during a session.
- **🚀 Mass Scraping Ready**: Designed to help you quickly identify patterns and selectors needed to mass scrape websites efficiently.

## Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Kulchandra-199/element-selector-extension.git
    cd element-selector-extension
    ```

2.  **Load into Chrome:**
    -   Open Google Chrome and navigate to `chrome://extensions/`.
    -   Toggle **Developer mode** in the top right corner.
    -   Click the **Load unpacked** button.
    -   Select the directory where you cloned this repository.

## Usage

1.  **Open the Popup**: Click the extension icon in your browser toolbar.
2.  **Start Selection**:
    -   Enter a descriptive **Identifier** (e.g., "submit-button", "price-tag") in the input field.
    -   Click **Enable Highlight**.
3.  **Select Element**:
    -   Move your mouse over the webpage. You will see elements highlighted as you hover.
    -   Click on the specific element you want to target.
4.  **Saved!**: The extension will save the mapping of your identifier to the element's class names. You can verify this in the extension's storage or via console logs (depending on current implementation details).

## Use Cases

-   **Web Scraping**: Quickly gather selectors for tools like Puppeteer, Playwright, or Beautiful Soup.
-   **Test Automation**: Identify stable selectors for your Selenium or Cypress tests.
-   **Development**: Rapidly inspect and reference DOM elements during frontend development.

## To-Dos

-   [ ] Add export functionality (JSON/CSV) for selected elements.
-   [ ] Implement a more advanced selector generation strategy (e.g., ID > Class > XPath).
-   [ ] Add a UI to view and manage saved selectors directly in the popup.


## Tech Stack

-   **Manifest V3**: Built using the latest Chrome Extension standards.
-   **JavaScript (Vanilla)**: Lightweight and fast without heavy framework dependencies.
-   **HTML/CSS**: Simple and clean user interface.

## License

MIT
