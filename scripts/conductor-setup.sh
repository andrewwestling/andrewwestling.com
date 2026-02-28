#!/usr/bin/env bash
set -euo pipefail

# Conductor workspace setup script
# Runs automatically when Conductor creates a new worktree.

# Link Vercel project (non-interactive)
vercel link --yes --project prj_b376unVYNMOlq8BhwPWIYHPr6bMS

# Pull env vars
vercel env pull next-js/.env.local
echo "Pulled environment variables"

# Install dependencies
cd tailwind && npm install
cd ../next-js && npm install
