#!/usr/bin/env bash
set -euo pipefail

# Conductor workspace setup script
# Runs automatically when Conductor creates a new worktree.

# Link Railway project to development environment
railway link -p fa10f431-ff3b-4537-bb11-f0af87d4c146 -e 3baeea23-5fe8-4e50-b343-9e73d24aa706

# Pull development env vars
railway variables -k > next-js/.env.local
echo "Pulled development environment variables"

# Install dependencies
cd tailwind && npm install
cd ../next-js && npm install
