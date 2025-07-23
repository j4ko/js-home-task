# TV OS Automation Project

Professional TestCafe automation framework for testing TV OS functionality at https://app.titanos.tv/

## 🎯 Overview

This project simulates TV remote control navigation to test app deletion functionality in a TV operating system interface. It demonstrates professional automation practices with keyboard navigation (simulating TV remote controls) rather than mouse interactions.

## ✨ Key Features

- **TV Remote Simulation**: Navigate using arrow keys to mimic actual TV remote controls
- **Long Press Enter**: Activate delete mode using proper long press simulation
- **App Management**: Test deletion of favorite apps with protection system awareness
- **Professional Architecture**: Page Object Model with comprehensive error handling
- **Detailed Reporting**: HTML reports with screenshots and step-by-step logging

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- Chrome browser

### Installation
```bash
# Clone or download the project
cd js-home-task

# Install dependencies
npm install
```

### Running Tests
```bash
# Run all tests with HTML reporting
npm test

# Run specific test file
npx testcafe chrome tests/delete-second-element.test.js

# Run with different browsers
npx testcafe firefox tests/
npx testcafe safari tests/
```

## 🔧 Technical Implementation

### Core Functionality
The main test demonstrates a complete TV remote simulation workflow:

1. **Initial State Verification**: Detect all favorite apps and verify structure
2. **TV Navigation**: Use right arrow to navigate to the second app
3. **Delete Mode Activation**: Long press Enter to activate delete mode
4. **Delete Navigation**: Use down arrow to reach delete button
5. **Confirmation**: Press Enter to confirm deletion
6. **Result Verification**: Validate the deletion outcome

### Key Technical Solutions

#### Long Press Enter Implementation
```javascript
// Simulate long press using keyDown + wait + keyUp
await t.dispatchEvent('#favourite-apps', 'keydown', {
    key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true
});
await t.wait(2000); // Critical 2-second hold
await t.dispatchEvent('#favourite-apps', 'keyup', {
    key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true
});
```

#### TV Remote Navigation
```javascript
// Establish focus on the container
await t.click('#favourite-apps');

// Navigate using arrow keys (TV remote simulation)
await t.pressKey('right');  // Move to next app
await t.pressKey('down');   // Navigate to delete button
await t.pressKey('enter');  // Confirm selection
```

## 📁 Project Structure

```
js-home-task/
├── config/
│   └── testcafe.config.js           # TestCafe configuration
├── pages/
│   ├── base-page.js                 # Base page object class
│   └── home-page.js                 # Home page with TV navigation
├── tests/
│   └── delete-second-element.test.js # Main TV remote simulation test
├── utils/
│   └── test-helpers.js              # Utility functions
├── reports/                         # Generated HTML reports
├── screenshots/                     # Test execution screenshots
├── package.json                     # Dependencies and scripts
├── README.md                        # This file
└── PROJECT_SUMMARY.md               # Detailed project summary
```

## 📊 Test Results

### Latest Execution
- **Apps Detected**: 16 favorite apps
- **Target App**: "Couchplay Games" (second element)
- **Navigation**: ✅ TV remote simulation working
- **Delete Mode**: ✅ Successfully activated with overlay
- **Protection System**: ✅ Properly handled app protection

### Generated Artifacts
- **HTML Report**: `reports/test-results.html` - Comprehensive test report
- **Screenshots**: `screenshots/tv-os-automation-test-result.png` - Visual evidence
- **Console Logs**: Detailed step-by-step execution information

## 🔍 Key Discoveries

### Working Delete Sequence
The successful deletion flow requires this exact sequence:
1. Navigate to target app using `right arrow`
2. Activate delete mode with `long press Enter` (2-second hold)
3. Navigate to delete button using `down arrow`
4. Confirm deletion with `Enter`

### App Protection System
- The TV OS implements app-level protection (e.g., "Watch TV" may be protected)
- Protected apps won't be deleted but the UI flow works correctly
- Delete mode activation works regardless of individual app protection

### DOM Structure
- **Container**: `#favourite-apps` - Main focus container
- **App Titles**: `._itemTitle_10v6y_138` - Individual app elements
- **Delete Buttons**: `[data-testid="editmode-remove-app"]` - Delete controls
- **Overlay**: `._overlay_15ypj_1` - Delete mode overlay

## 🛠 Configuration

### TestCafe Settings
```javascript
module.exports = {
    browsers: ['chrome'],
    src: ['tests/'],
    reporter: ['spec', 'html:reports/test-results.html'],
    screenshots: {
        mode: 'on',
        path: 'screenshots/'
    }
};
```

### Scripts
```json
{
    "test": "testcafe chrome tests/ --reporter spec,html:reports/test-results.html",
    "test:headless": "testcafe chrome:headless tests/",
    "test:firefox": "testcafe firefox tests/"
}
```

## 🧪 Extending the Tests

### Adding New Tests
1. Create new test files in the `tests/` directory
2. Use the `HomePage` class for consistent navigation
3. Follow the established logging patterns for debugging

### Customizing Navigation
```javascript
// Example: Navigate to third element
await homePage.navigateToElement(2); // 0-based index

// Example: Test different apps
const appIndex = 3; // Fourth app
await t.pressKey('right right right'); // Navigate to fourth position
```

## 📋 Best Practices Implemented

- **Page Object Model**: Encapsulated functionality in page classes
- **Comprehensive Logging**: Step-by-step execution tracking
- **Error Handling**: Graceful handling of protected apps
- **Visual Evidence**: Screenshots for test verification
- **Maintainable Code**: Clean, documented, and reusable structure

## 🎉 Success Criteria Met

✅ **TV Remote Simulation**: Full keyboard navigation implementation  
✅ **Long Press Functionality**: Working long press Enter detection  
✅ **Delete Flow**: Complete app deletion workflow  
✅ **Professional Structure**: Industry-standard test architecture  
✅ **Comprehensive Testing**: Detailed verification and reporting  

## 📞 Support

For questions about this automation project:
- Review the detailed logs in the console output
- Check the HTML report in `reports/test-results.html`
- Examine screenshots in the `screenshots/` directory
- Read the comprehensive `PROJECT_SUMMARY.md` for technical details

---

**Project Status**: ✅ Complete and Fully Functional
3. **Search Categories**: Verify opening categories from the search page
4. **Channels Page Access**: Verify channels page functionality

## Prerequisites

- Node.js (v14.0.0 or higher)
- npm or yarn
- Modern web browser (Chrome, Firefox)

## Installation

1. Clone this repository
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

**Important**: Before running the tests, you need to configure the application URL.

1. Open `config/test-config.js`
2. Replace the placeholder URL with the actual application URL:
   ```javascript
   baseUrl: 'https://app.titanos.tv/' // Replace with your target URL
   ```

## Running Tests

### All Tests
```bash
npm test                    # Run all tests in Chrome with reports
npm run test:headless       # Run all tests in headless Chrome
npm run test:firefox        # Run all tests in Firefox
```

### Single Test
```bash
npm run test:single         # Run only the first test case
```

### Debug Mode
```bash
npm run test:debug          # Run tests with debug mode on failures
```

## Reports

Test results are automatically generated in:
- Console output (spec reporter)
- HTML report: `reports/test-results.html`

## Project Structure

```
├── config/
│   └── test-config.js          # Test configuration and constants
├── pages/
│   ├── base-page.js            # Base page with common functionality
│   ├── home-page.js            # Home page object model
│   ├── apps-page.js            # Apps page object model
│   ├── search-page.js          # Search page object model
│   └── channels-page.js        # Channels page object model
├── tests/
│   ├── 01-delete-favorite-apps.test.js
│   ├── 02-add-app-to-favorites.test.js
│   ├── 03-open-search-category.test.js
│   └── 04-channels-page-access.test.js
├── utils/
│   └── remote-control.js       # Remote control simulation utilities
├── reports/                    # Test execution reports
└── README.md
```

## Development Guidelines

- Follow POM pattern for all page interactions
- Use meaningful selector strategies
- Implement proper wait mechanisms
- Add detailed logging for debugging
- Maintain consistent coding standards

## Remote Control Navigation

The tests simulate TV remote control behavior:
- **Arrow Keys**: Navigation between elements
- **Enter Key**: Selection/activation
- **Long Press**: Simulated through key hold duration

## Contributing

1. Follow the established POM pattern
2. Add comprehensive test documentation
3. Ensure cross-browser compatibility
4. Include proper error handling and assertions

## Support

For issues or questions, please refer to the test documentation or contact the QA team.