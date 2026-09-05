#!/bin/bash
set -e

# Ensure we run from the directory containing this script,
# so it works regardless of whether the deploy root is backend/
# or the repo root above it.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Install public backend dependencies only
pip install -r requirements-public.txt

# Start the public backend
# App Service Python Blessed Images expose port 8000 by default
uvicorn --host 0.0.0.0 --port 8000 main_public:app
