#!/bin/bash

# Melqo MVP - Quick Start Script
# This script starts the production server

echo "🎮 Melqo MVP - Starting Production Server..."
echo ""

# Check if build exists
if [ ! -d ".next" ]; then
    echo "⚠️  No build found. Running build first..."
    npm run build
    echo ""
fi

# Check if port 3000 is in use
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️  Port 3000 is already in use"
    echo "   Killing previous process..."
    pkill -f "next start" 2>/dev/null
    sleep 2
fi

# Get IP address
IP=$(hostname -I | awk '{print $1}')

echo "✅ Starting server..."
echo ""
echo "🌐 Local URL: http://localhost:3000"
echo "🌐 Network URL: http://${IP}:3000"
echo ""
echo "📧 Admin credentials:"
echo "   Email: admin@melqo.com"
echo "   Password: admin123"
echo ""
echo "⚠️  IMPORTANT: Change admin password after first login!"
echo ""
echo "Press Ctrl+C to stop the server"
echo "═══════════════════════════════════════"
echo ""

# Start production server
npm start
