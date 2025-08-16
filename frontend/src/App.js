import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/index.css';
import RosterImport from './components/RosterImport';
import CallTheRoll from './components/CallTheRoll';

function App() {
  const [roster, setRoster] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch roster on component mount
  useEffect(() => {
    fetchRoster();
  }, []);

  const fetchRoster = async () => {
    try {
      const response = await axios.get('/api/roster');
      setRoster(response.data);
    } catch (error) {
      console.error('Error fetching roster:', error);
    }
  };



  const handleRosterImport = async (importedRoster) => {
    setRoster(importedRoster);
    setSuccess('Roster imported successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };



  const clearRoster = async () => {
    try {
      await axios.delete('/api/roster');
      setRoster([]);
      setSuccess('Roster cleared successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Error clearing roster');
      setTimeout(() => setError(''), 3000);
    }
  };



  return (
    <div className="container">
      <div className="header">
        <h1>🎯 Call the Roll</h1>
        <p>Random Person Selection System</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <RosterImport 
        onRosterImport={handleRosterImport}
        onClearRoster={clearRoster}
        rosterCount={roster.length}
      />

      {roster.length > 0 && (
        <div className="stats">
          <div className="stat-card">
            <div className="stat-number">{roster.length}</div>
            <div className="stat-label">Total People</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{roster.filter(s => s.hasBeenCalled).length}</div>
            <div className="stat-label">Called Today</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{roster.filter(s => !s.hasBeenCalled).length}</div>
            <div className="stat-label">Remaining</div>
          </div>
        </div>
      )}

      {roster.length > 0 && (
        <CallTheRoll roster={roster} />
      )}
    </div>
  );
}

export default App;
