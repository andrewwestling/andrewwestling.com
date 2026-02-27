#!/usr/bin/env bash
set -euo pipefail

# Conductor workspace setup script
# Runs automatically when Conductor creates a new worktree.

# Link Railway project (all flags to avoid interactive prompts)
railway link \
  -w 3493aa80-bb33-426b-bddb-172aa5c6d536 \
  -p fa10f431-ff3b-4537-bb11-f0af87d4c146 \
  -e 3baeea23-5fe8-4e50-b343-9e73d24aa706 \
  -s f3f6cd40-5e14-4b28-840d-933a0a28910f

# Pull env vars
railway variables -k > next-js/.env.local
echo "Pulled environment variables"

# Install dependencies
cd tailwind && npm install
cd ../next-js && npm install
