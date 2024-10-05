#!/bin/bash

# Start the backend (FastAPI)
cd mhacks-backend/
echo "Starting the FastAPI backend..."
python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8080 &

# Start the frontend (React)
cd ../mhacks-frontend/frontend
echo "Starting the React frontend..."
npm run dev

# Return to the root directory
cd ../..