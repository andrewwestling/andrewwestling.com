#!/usr/bin/env bash
set -euo pipefail

# Pull Vercel Development values only for local Conductor workspaces. The
# project ID avoids requiring a linked `.vercel` directory in each worktree.
if [[ "${CONDUCTOR_IS_LOCAL:-0}" == "1" ]]; then
  npx --yes vercel@59.14.0 env pull next-js/.env.local \
    --project prj_b376unVYNMOlq8BhwPWIYHPr6bMS \
    --environment development \
    --yes
fi

cd tailwind
npm ci
cd ../next-js
npm ci
