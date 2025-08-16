const express = require('express');
const cors = require('cors');
const multer = require('multer');
const XLSX = require('xlsx');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// In-memory storage (replace with database in production)
let roster = [];

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only Excel and CSV files are allowed!'), false);
    }
  }
});

// Create uploads directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Routes

// Import roster from Excel file
app.post('/api/import-roster', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

        // Process the data and extract student information
    const students = data.map((row, index) => {
      // Handle different possible column names
      const name = row['姓名'] || row['Name'] || row['Full Name'] || row['FullName'] || row['Student Name'] || '';
      const position = row['职位'] || row['Position'] || row['Student ID'] || row['StudentID'] || row['ID'] || row['Student Number'] || '';
      const department = row['部门'] || row['Department'] || row['Email'] || row['Email Address'] || '';
      
      return {
        id: uuidv4(),
        name: name.toString().trim(),
        position: position.toString().trim(),
        department: department.toString().trim(),
        hasBeenCalled: false
      };
    }).filter(student => student.name); // Filter out empty rows

    roster = students;

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    res.json({ 
      message: 'Roster imported successfully', 
      count: students.length,
      students: students 
    });

  } catch (error) {
    console.error('Error importing roster:', error);
    res.status(500).json({ error: 'Error processing file' });
  }
});

// Get current roster
app.get('/api/roster', (req, res) => {
  res.json(roster);
});



// Clear roster
app.delete('/api/roster', (req, res) => {
  roster = [];
  res.json({ message: 'Roster cleared' });
});

// Random call the roll
app.get('/api/random-call', (req, res) => {
  if (roster.length === 0) {
    return res.status(404).json({ error: 'No students in roster' });
  }
  
  // Filter out students who have already been called (optional feature)
  const availableStudents = roster.filter(student => !student.hasBeenCalled);
  
  // If all students have been called, reset the flag
  if (availableStudents.length === 0) {
    roster.forEach(student => student.hasBeenCalled = false);
    availableStudents.push(...roster);
  }
  
  // Randomly select a student
  const randomIndex = Math.floor(Math.random() * availableStudents.length);
  const selectedStudent = availableStudents[randomIndex];
  
  // Mark this student as called
  selectedStudent.hasBeenCalled = true;
  
  res.json({
    student: selectedStudent,
    message: `Calling on ${selectedStudent.name}`,
    remainingStudents: availableStudents.length - 1
  });
});

// Reset random call history
app.post('/api/reset-random-call', (req, res) => {
  roster.forEach(student => student.hasBeenCalled = false);
  res.json({ message: 'Random call history reset' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
