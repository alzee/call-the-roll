import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/index.css';
import RosterImport from './components/RosterImport';
import CallTheRoll from './components/CallTheRoll';
import LanguageSwitcher from './components/LanguageSwitcher';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';

function AppContent() {
  const [roster, setRoster] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { t } = useLanguage();

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
    setSuccess(t('rosterImported'));
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleRosterUpdate = (updatedRoster) => {
    setRoster(updatedRoster);
  };



  const clearRoster = async () => {
    try {
      await axios.delete('/api/roster');
      setRoster([]);
      setSuccess(t('rosterCleared'));
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(t('errorClearingRoster'));
      setTimeout(() => setError(''), 3000);
    }
  };



  return (
    <div className="container">
      <div className="header">
        <LanguageSwitcher />
        <h1>🎯 {t('title')}</h1>
        <p>{t('subtitle')}</p>
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
            <div className="stat-label">{t('totalPeople')}</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{roster.filter(s => s.hasBeenCalled).length}</div>
            <div className="stat-label">{t('calledToday')}</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{roster.filter(s => !s.hasBeenCalled).length}</div>
            <div className="stat-label">{t('remaining')}</div>
          </div>
        </div>
      )}

      {roster.length > 0 && (
        <CallTheRoll roster={roster} onRosterUpdate={handleRosterUpdate} />
      )}
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
