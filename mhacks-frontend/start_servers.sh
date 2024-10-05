#!/bin/bash
# Kill any process currently running on port 8000 (Django's default port)
PID=$(lsof -ti:8000)
if [ -n "$PID" ]; then
  kill -9 $PID
  echo "Killed process running on port 8000"
fi

# Start the Django backend
cd backend
python manage.py runserver &
cd ..

# Start the Next.js frontend
cd frontend
npm run dev
