#!/bin/sh
set -e

# Check BASE_URL is set
if [ -z "$BASE_URL" ]; then
  echo "ERROR: BASE_URL environment variable not set."
  exit 1
fi

# Inject baseUrl into .testcaferc.json (overwriting any previous value)
if [ -f .testcaferc.json ]; then
  jq --arg url "$BASE_URL" '.baseUrl = $url' .testcaferc.json > tmpfile && mv tmpfile .testcaferc.json
else
  echo '{"baseUrl": "'$BASE_URL'"}' > .testcaferc.json
fi

# Ensure reports directory exists and is writable
mkdir -p /reports
chmod 777 /reports

# Run tests (output report to /reports)
npm run test:all
