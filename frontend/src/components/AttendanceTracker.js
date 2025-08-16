import React, { useState } from 'react';
import { FiCheck, FiX, FiSave, FiEdit3, FiShuffle, FiRotateCcw } from 'react-icons/fi';

const AttendanceTracker = ({ roster, onAttendanceUpdate, onSaveAttendance, loading }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [classInfo, setClassInfo] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isCalling, setIsCalling] = useState(false);

  const handleToggleAttendance = (studentId, currentStatus) => {
    onAttendanceUpdate(studentId, !currentStatus, '');
  };

  const handleNotesChange = (studentId, notes) => {
    const student = roster.find(s => s.id === studentId);
    onAttendanceUpdate(studentId, student.isPresent, notes);
  };

  const handleSave = async () => {
    if (!date || !classInfo.trim()) {
      alert('Please fill in both date and class information');
      return;
    }
    
    await onSaveAttendance(date, classInfo.trim());
    setShowSaveForm(false);
    setClassInfo('');
  };

  const handleRandomCall = async () => {
    if (roster.length === 0) {
      alert('No students in roster to call on');
      return;
    }

    setIsCalling(true);
    try {
      const response = await fetch('/api/random-call');
      const result = await response.json();
      
      if (response.ok) {
        setSelectedStudent(result.student);
        // Highlight the selected student briefly
        setTimeout(() => {
          setSelectedStudent(null);
        }, 3000);
      } else {
        alert(result.error);
      }
    } catch (error) {
      alert('Error calling random student');
    } finally {
      setIsCalling(false);
    }
  };

  const handleResetRandomCall = async () => {
    try {
      await fetch('/api/reset-random-call', { method: 'POST' });
      setSelectedStudent(null);
    } catch (error) {
      alert('Error resetting random call history');
    }
  };

  const presentCount = roster.filter(student => student.isPresent).length;
  const absentCount = roster.filter(student => !student.isPresent).length;

  return (
    <div className="card">
      <h2>📝 Take Attendance</h2>
      
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div>
          <strong>Present:</strong> {presentCount} | <strong>Absent:</strong> {absentCount}
        </div>
        <button
          className="btn btn-success"
          onClick={() => setShowSaveForm(true)}
          disabled={loading}
        >
          <FiSave style={{ marginRight: '0.5rem' }} />
          Save Attendance
        </button>
        <button
          className="btn"
          onClick={handleRandomCall}
          disabled={isCalling || roster.length === 0}
          style={{ background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)' }}
        >
          <FiShuffle style={{ marginRight: '0.5rem' }} />
          {isCalling ? 'Calling...' : 'Call the Roll'}
        </button>
        <button
          className="btn btn-secondary"
          onClick={handleResetRandomCall}
          disabled={roster.length === 0}
        >
          <FiRotateCcw style={{ marginRight: '0.5rem' }} />
          Reset Call History
        </button>
      </div>

      {selectedStudent && (
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '1rem',
          borderRadius: '10px',
          textAlign: 'center',
          marginBottom: '1rem',
          animation: 'pulse 2s infinite'
        }}>
          <h3 style={{ margin: '0', fontSize: '1.5rem' }}>
            🎯 Calling on: {selectedStudent.firstName} {selectedStudent.lastName}
          </h3>
          <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9 }}>
            Student ID: {selectedStudent.studentId}
          </p>
        </div>
      )}

      {showSaveForm && (
        <div style={{ 
          background: '#f8f9fa', 
          padding: '1rem', 
          borderRadius: '6px', 
          marginBottom: '1rem' 
        }}>
          <h3>Save Attendance Record</h3>
          <div className="form-group">
            <label>Date:</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Class Information (e.g., "Math 101 - Section A"):</label>
            <input
              type="text"
              value={classInfo}
              onChange={(e) => setClassInfo(e.target.value)}
              placeholder="Enter class name and section"
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-success" onClick={handleSave} disabled={loading}>
              {loading ? 'Saving...' : 'Save Record'}
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={() => setShowSaveForm(false)}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="student-list">
        {roster.map((student) => (
          <div 
            key={student.id} 
            className="student-card"
            style={{
              border: selectedStudent && selectedStudent.id === student.id 
                ? '3px solid #667eea' 
                : '1px solid #e9ecef',
              background: selectedStudent && selectedStudent.id === student.id 
                ? 'linear-gradient(135deg, #f8f9ff 0%, #e8f2ff 100%)' 
                : 'white',
              transform: selectedStudent && selectedStudent.id === student.id 
                ? 'scale(1.02)' 
                : 'scale(1)',
              transition: 'all 0.3s ease'
            }}
          >
            <div className="student-info">
              <div className="student-name">
                {student.firstName} {student.lastName}
              </div>
              <div className="student-details">
                ID: {student.studentId}
                {student.email && ` • ${student.email}`}
              </div>
            </div>
            
            <div className="attendance-controls">
              <div className="attendance-toggle">
                <span style={{ fontSize: '0.9rem', color: '#6c757d' }}>
                  {student.isPresent ? 'Present' : 'Absent'}
                </span>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={student.isPresent}
                    onChange={() => handleToggleAttendance(student.id, student.isPresent)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiEdit3 size={16} style={{ color: '#6c757d' }} />
                <input
                  type="text"
                  placeholder="Notes (optional)"
                  value={student.notes || ''}
                  onChange={(e) => handleNotesChange(student.id, e.target.value)}
                  style={{
                    padding: '0.25rem 0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '0.9rem',
                    width: '150px'
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {roster.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#6c757d' }}>
          No students in roster. Please import a roster first.
        </div>
      )}
    </div>
  );
};

export default AttendanceTracker;
