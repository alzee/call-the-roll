import React, { useState, useEffect } from 'react';
import { FiShuffle, FiRotateCcw, FiUsers } from 'react-icons/fi';

const CallTheRoll = ({ roster, onRosterUpdate }) => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isCalling, setIsCalling] = useState(false);

  // Sync roster state with backend when component mounts
  useEffect(() => {
    const fetchRoster = async () => {
      try {
        const response = await fetch('/api/roster');
        if (response.ok) {
          const backendRoster = await response.json();
          // Only update if the backend roster has different hasBeenCalled states
          const needsUpdate = backendRoster.some((backendStudent, index) => 
            backendStudent.hasBeenCalled !== roster[index]?.hasBeenCalled
          );
          if (needsUpdate) {
            onRosterUpdate(backendRoster);
          }
        }
      } catch (error) {
        console.error('Error fetching roster:', error);
      }
    };

    if (roster.length > 0) {
      fetchRoster();
    }
  }, [roster.length, onRosterUpdate]);

  const handleRandomCall = async () => {
    if (roster.length === 0) {
      alert('No people in roster to call on');
      return;
    }

    setIsCalling(true);
    try {
      const response = await fetch('/api/random-call');
      const result = await response.json();
      
      if (response.ok) {
        setSelectedStudent(result.student);
        
        // Update the roster with the called student
        const updatedRoster = roster.map(student => 
          student.id === result.student.id 
            ? { ...student, hasBeenCalled: true }
            : student
        );
        onRosterUpdate(updatedRoster);
        
        // Highlight the selected student briefly
        setTimeout(() => {
          setSelectedStudent(null);
        }, 5000); // Show for 5 seconds
      } else {
        alert(result.error);
      }
    } catch (error) {
      alert('Error calling random person');
    } finally {
      setIsCalling(false);
    }
  };

  const handleResetRandomCall = async () => {
    try {
      await fetch('/api/reset-random-call', { method: 'POST' });
      setSelectedStudent(null);
      
      // Update the roster to reset all hasBeenCalled flags
      const updatedRoster = roster.map(student => ({
        ...student,
        hasBeenCalled: false
      }));
      onRosterUpdate(updatedRoster);
    } catch (error) {
      alert('Error resetting random call history');
    }
  };

  return (
    <div className="card">
      <h2>
        <FiShuffle style={{ marginRight: '0.5rem' }} />
        Call the Roll
      </h2>
      
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <button
          className="btn"
          onClick={handleRandomCall}
          disabled={isCalling || roster.length === 0}
          style={{ 
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
            fontSize: '1.2rem',
            padding: '1rem 2rem',
            margin: '1rem'
          }}
        >
          <FiShuffle style={{ marginRight: '0.5rem' }} />
          {isCalling ? 'Calling...' : '🎯 Call the Roll'}
        </button>
        
        <button
          className="btn btn-secondary"
          onClick={handleResetRandomCall}
          disabled={roster.length === 0}
          style={{ margin: '1rem' }}
        >
          <FiRotateCcw style={{ marginRight: '0.5rem' }} />
          Reset Call History
        </button>
      </div>

      {selectedStudent && (
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '2rem',
          borderRadius: '15px',
          textAlign: 'center',
          marginBottom: '2rem',
          animation: 'pulse 2s infinite',
          boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
        }}>
          <h3 style={{ margin: '0', fontSize: '2rem', marginBottom: '1rem' }}>
            🎯 Calling on:
          </h3>
          <h2 style={{ margin: '0', fontSize: '2.5rem', fontWeight: 'bold' }}>
            {selectedStudent.name}
          </h2>
          <p style={{ margin: '1rem 0 0 0', opacity: 0.9, fontSize: '1.1rem' }}>
            {selectedStudent.position}
          </p>
          {selectedStudent.department && (
            <p style={{ margin: '0.5rem 0 0 0', opacity: 0.8 }}>
              {selectedStudent.department}
            </p>
          )}
        </div>
      )}

      <div className="student-list">
        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
          <FiUsers style={{ marginRight: '0.5rem' }} />
          Roster ({roster.length} people)
        </h3>
        
        {roster.map((student) => (
          <div 
            key={student.id} 
            className="student-card"
            style={{
              border: selectedStudent && selectedStudent.id === student.id 
                ? '3px solid #667eea' 
                : student.hasBeenCalled 
                  ? '2px solid #28a745' 
                  : '1px solid #e9ecef',
              background: selectedStudent && selectedStudent.id === student.id 
                ? 'linear-gradient(135deg, #f8f9ff 0%, #e8f2ff 100%)' 
                : student.hasBeenCalled 
                  ? 'linear-gradient(135deg, #f8fff8 0%, #e8ffe8 100%)' 
                  : 'white',
              transform: selectedStudent && selectedStudent.id === student.id 
                ? 'scale(1.02)' 
                : 'scale(1)',
              transition: 'all 0.3s ease',
              opacity: student.hasBeenCalled ? 0.7 : 1
            }}
          >
            <div className="student-info">
                                      <div className="student-name">
              {student.name}
              {student.hasBeenCalled && (
                <span style={{ 
                  marginLeft: '0.5rem', 
                  color: '#28a745', 
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}>
                  ✓ Called
                </span>
              )}
            </div>
            <div className="student-details">
              Position: {student.position}
              {student.department && ` • ${student.department}`}
            </div>
            </div>
          </div>
        ))}
      </div>

      {roster.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#6c757d' }}>
          No people in roster. Please import a roster first.
        </div>
      )}
    </div>
  );
};

export default CallTheRoll;
