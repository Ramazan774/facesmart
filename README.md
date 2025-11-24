👤 Face Smart
A full-stack web application that detects faces in images using AI-powered facial recognition. Users can register, sign in, and submit image URLs to detect faces with visual bounding boxes.

✨ Features
User Authentication: Secure registration and login system
Face Detection: Detects and highlights faces in images using Face-API
Entry Tracking: Tracks the number of images submitted by each user
Responsive UI: Clean and modern interface built with React and Tachyons CSS

🛠️ Tech Stack
Frontend
React - UI library for building interactive interfaces
Tachyons CSS - Functional CSS for styling

Backend
Express.js - Node.js web application framework
PostgreSQL - Relational database for storing user data
Knex.js - SQL query builder for database operations
Face-API - Machine learning API for face detection

🚀 Getting Started
Prerequisites

Node.js (v14 or higher)
PostgreSQL database
Face-API key

Installation

Clone the repository

bashgit clone https://github.com/ramazan774/face-smart.git
cd face-smart

Install dependencies for both frontend and backend

bash# Install backend dependencies
cd facesmart_backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

Set up environment variables

Create a .env file in the backend directory:
envDATABASE_URL=postgresql://username:password@localhost:5432/facesmart
FACE_API_KEY=your_face_api_key
PORT=3001

Set up the database

bashcd facesmart_backend
# Run migrations
npx knex migrate:latest

Start the application

bash# Start backend server
cd facesmrt_backend
npm start

# Start frontend (in a new terminal)
cd frontend
npm start

Open http://localhost:3000 to view it in the browser

📊 Database Schema
users table: Stores user credentials and entry counts
Tracks user registration, login, and image submission history

🔒 Security
Passwords are hashed before storing in the database
User sessions are managed securely
Input validation on both frontend and backend

📚 Learning Outcomes

Full-stack application development
RESTful API design and implementation
Database design and SQL queries with Knex.js
Integration with third-party APIs
User authentication and authorization
