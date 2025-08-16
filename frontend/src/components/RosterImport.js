import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { FiUpload, FiTrash2, FiUsers } from 'react-icons/fi';

const RosterImport = ({ onRosterImport, onClearRoster, rosterCount }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setUploading(true);
    setUploadError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/import-roster', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      onRosterImport(response.data.students);
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadError(
        error.response?.data?.error || 'Error uploading file. Please try again.'
      );
    } finally {
      setUploading(false);
    }
  }, [onRosterImport]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv']
    },
    multiple: false
  });

  return (
    <div className="card">
      <h2>
        <FiUsers style={{ marginRight: '0.5rem' }} />
        Import Roster
      </h2>
      
      {rosterCount > 0 && (
        <div style={{ marginBottom: '1rem', padding: '1rem', background: '#e9ecef', borderRadius: '6px' }}>
          <strong>Roster:</strong> {rosterCount} people ready for random selection
        </div>
      )}

      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'dragover' : ''}`}
      >
        <input {...getInputProps()} />
        <FiUpload size={48} style={{ marginBottom: '1rem', color: '#667eea' }} />
        <p>
          {isDragActive
            ? 'Drop the Excel file here...'
            : 'Drag & drop an Excel file here, or click to select'}
        </p>
        <p style={{ fontSize: '0.9rem', color: '#6c757d', marginTop: '0.5rem' }}>
          Supported formats: .xlsx, .xls, .csv
        </p>
        <p style={{ fontSize: '0.8rem', color: '#6c757d', marginTop: '0.5rem' }}>
          Expected columns: Name, Position, Department (optional)
        </p>
      </div>

      {uploading && (
        <div style={{ textAlign: 'center', padding: '1rem', color: '#6c757d' }}>
          Uploading and processing file...
        </div>
      )}

      {uploadError && (
        <div className="alert alert-error">
          {uploadError}
        </div>
      )}

      {rosterCount > 0 && (
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <button
            className="btn btn-danger"
            onClick={onClearRoster}
            style={{ marginLeft: '0.5rem' }}
          >
            <FiTrash2 style={{ marginRight: '0.5rem' }} />
            Clear Roster
          </button>
        </div>
      )}
    </div>
  );
};

export default RosterImport;
