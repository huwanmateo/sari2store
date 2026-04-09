#!/bin/bash

# Stop all running servers

echo "🛑 Stopping Grocery E-Store servers..."

# Kill processes on port 5000 (backend)
if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "  Stopping backend (port 5000)..."
    kill -9 $(lsof -t -i:5000) 2>/dev/null
fi

# Kill processes on port 5173 (frontend)
if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "  Stopping frontend (port 5173)..."
    kill -9 $(lsof -t -i:5173) 2>/dev/null
fi

echo "✅ All servers stopped"
