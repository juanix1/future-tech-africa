#!/data/data/com.termux/files/usr/bin/bash
set -e

cd ~/future-tech-africa

echo "STEP 1: Generating video scripts..."
node src/index.js

echo "STEP 2: Creating Kenyan voice-overs..."
python scripts/generate-voices.py

echo "STEP 3: Rendering cinematic videos..."
python scripts/render-videos.py

echo "STEP 4: Organizing finished videos..."
node scripts/organize-videos.js

echo "SUCCESS: Four videos processed and organized!"
