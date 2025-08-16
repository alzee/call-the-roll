#!/bin/bash

echo "🚀 Starting Call the Roll Application..."

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please activate nvm first:"
    echo "   source ~/.bashrc"
    echo "   nvm use node"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Start backend server
echo "🔧 Starting backend server..."
cd backend
nohup node server.js > ../backend.log 2>&1 &
BACKEND_PID=$!
echo "✅ Backend started (PID: $BACKEND_PID)"

# Wait a moment for backend to start
sleep 2

# Start frontend server
echo "🎨 Starting frontend server..."
cd ../frontend
nohup npm start > ../frontend.log 2>&1 &
FRONTEND_PID=$!
echo "✅ Frontend started (PID: $FRONTEND_PID)"

echo ""
echo "🎉 Application is starting up!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:5000"
echo "📱 Open your browser and go to: http://localhost:3000"
echo ""
echo "📋 To stop the servers, run:"
echo "   pkill -f 'node server.js'"
echo "   pkill -f 'react-scripts start'"
echo ""
echo "📄 Logs are saved in:"
echo "   backend.log"
echo "   frontend.log"
