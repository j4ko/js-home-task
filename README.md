# TV OS Automation Project

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)
- Modern browser (Chrome recommended, Firefox and Safari also supported)



### Installation
```bash
# Clone this repository or download the code
git clone https://github.com/j4ko/js-home-task.git
cd js-home-task

# Install dependencies (including TestCafe as a dev dependency)
npm install
```

#### Install TestCafe (if not already installed)

You can install TestCafe either globally or locally:

- **Global installation** (TestCafe available system-wide):
  ```bash
  npm install -g testcafe
  ```
- **Local installation** (recommended for CI and project isolation):
  ```bash
  npm install --save-dev testcafe
  ```

> If you use this repository's `package.json`, TestCafe is already listed as a dev dependency, so `npm install` is usually enough.


### Running tests
```bash
# Run all tests in Chrome with HTML report
npm run test:all


> **Note:** HTML reports are automatically generated in `reports/test-results.html` after each run.


### Configuration (optional)
If you need to change the application URL under test:
1. Open the file `.testcaferc.json` in the project root.
2. Edit the `baseUrl` value to match your environment:
   ```json
   {
     "browsers": "chrome",
     "baseUrl": "", // Change to your target URL
     "skipJsErrors": true
   }
   ```

---

## 🛠️ Portability notes

- The project is cross-platform (Windows, macOS, Linux).
- You only need Node.js and a compatible browser installed.
- All commands work on any OS with a standard terminal.
- No extra configuration or environment variables required.

---
> **Note:** HTML reports are automatically generated in `reports/test-results.html` after each run.


---

