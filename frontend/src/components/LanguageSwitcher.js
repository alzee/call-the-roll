import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { FiGlobe } from 'react-icons/fi';

const LanguageSwitcher = () => {
  const { language, setLanguage, t } = useLanguage();

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
  };

  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      right: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      background: 'rgba(255, 255, 255, 0.9)',
      padding: '10px 15px',
      borderRadius: '25px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(10px)'
    }}>
      <FiGlobe size={16} style={{ color: '#667eea' }} />
      <span style={{ fontSize: '0.9rem', color: '#333', fontWeight: '500' }}>
        {t('language')}:
      </span>
      <button
        onClick={() => handleLanguageChange('en')}
        style={{
          background: language === 'en' ? '#667eea' : 'transparent',
          color: language === 'en' ? 'white' : '#667eea',
          border: `1px solid ${language === 'en' ? '#667eea' : '#ddd'}`,
          padding: '5px 10px',
          borderRadius: '15px',
          cursor: 'pointer',
          fontSize: '0.8rem',
          fontWeight: '500',
          transition: 'all 0.3s ease'
        }}
      >
        {t('english')}
      </button>
      <button
        onClick={() => handleLanguageChange('zh')}
        style={{
          background: language === 'zh' ? '#667eea' : 'transparent',
          color: language === 'zh' ? 'white' : '#667eea',
          border: `1px solid ${language === 'zh' ? '#667eea' : '#ddd'}`,
          padding: '5px 10px',
          borderRadius: '15px',
          cursor: 'pointer',
          fontSize: '0.8rem',
          fontWeight: '500',
          transition: 'all 0.3s ease'
        }}
      >
        {t('chinese')}
      </button>
    </div>
  );
};

export default LanguageSwitcher;
