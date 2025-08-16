# Call the Roll - Attendance Management System

A modern web application for managing student attendance with Excel import functionality.

## Features

- 📊 **Excel Import**: Import student rosters from Excel files (.xlsx, .xls, .csv)
- 🎯 **Random Call**: Click a button to randomly select a student to call on
- 📈 **Call Tracking**: Track which students have been called and reset history
- 🎨 **Modern UI**: Beautiful, responsive interface with visual feedback

## Expected Excel Format

Your Excel file should have the following columns (column names are flexible):
- **Name** (or Full Name, FullName, Student Name)
- **Position** (or Student ID, StudentID, ID, Student Number)
- **Department** (or Email, Email Address) - optional

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the backend server:
   ```bash
   npm start
   ```
   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

   The backend will run on `http://localhost:5000`

### Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```

   The frontend will run on `http://localhost:3000`

## Usage

1. **Import Roster**: Upload an Excel file with student information
2. **Call the Roll**: Click the "Call the Roll" button to randomly select a student
3. **Track Calls**: See which students have been called and how many remain
4. **Reset History**: Reset the call history to start fresh

## API Endpoints

- `POST /api/import-roster` - Import roster from Excel file
- `GET /api/roster` - Get current roster
- `GET /api/random-call` - Get a random student to call on
- `POST /api/reset-random-call` - Reset random call history
- `DELETE /api/roster` - Clear current roster

## Technologies Used

- **Backend**: Node.js, Express.js, Multer, XLSX
- **Frontend**: React.js, Axios, React Dropzone, React Icons
- **Styling**: CSS3 with modern design patterns

## License

MIT License
