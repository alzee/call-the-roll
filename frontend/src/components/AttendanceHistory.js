import React from 'react';
import { FiDownload, FiCalendar, FiUsers } from 'react-icons/fi';

const AttendanceHistory = ({ attendanceRecords, onExportAttendance }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAttendanceStats = (record) => {
    const total = record.students.length;
    const present = record.students.filter(s => s.isPresent).length;
    const absent = total - present;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
    
    return { total, present, absent, percentage };
  };

  return (
    <div className="card">
      <h2>
        <FiCalendar style={{ marginRight: '0.5rem' }} />
        Attendance History
      </h2>
      
      {attendanceRecords.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#6c757d' }}>
          No attendance records yet. Take attendance to see history here.
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {attendanceRecords.map((record) => {
            const stats = getAttendanceStats(record);
            return (
              <div
                key={record.id}
                style={{
                  border: '1px solid #e9ecef',
                  borderRadius: '8px',
                  padding: '1rem',
                  background: 'white'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>
                      {record.classInfo}
                    </h3>
                    <p style={{ margin: '0', color: '#6c757d', fontSize: '0.9rem' }}>
                      <FiCalendar style={{ marginRight: '0.25rem' }} />
                      {formatDate(record.timestamp)}
                    </p>
                  </div>
                  
                  <button
                    className="btn"
                    onClick={() => onExportAttendance(record.id)}
                    style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                  >
                    <FiDownload style={{ marginRight: '0.5rem' }} />
                    Export
                  </button>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#667eea' }}>
                      {stats.total}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>Total</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#28a745' }}>
                      {stats.present}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>Present</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#dc3545' }}>
                      {stats.absent}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>Absent</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ffc107' }}>
                      {stats.percentage}%
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>Rate</div>
                  </div>
                </div>
                
                <details style={{ marginTop: '1rem' }}>
                  <summary style={{ cursor: 'pointer', color: '#667eea', fontWeight: '600' }}>
                    <FiUsers style={{ marginRight: '0.5rem' }} />
                    View Student Details
                  </summary>
                  <div style={{ marginTop: '0.5rem', maxHeight: '200px', overflowY: 'auto' }}>
                    {record.students.map((student, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '0.5rem',
                          borderBottom: '1px solid #f8f9fa',
                          fontSize: '0.9rem'
                        }}
                      >
                        <div>
                          <strong>{student.firstName} {student.lastName}</strong>
                          <div style={{ color: '#6c757d', fontSize: '0.8rem' }}>
                            ID: {student.studentId}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <span
                            style={{
                              padding: '0.25rem 0.5rem',
                              borderRadius: '4px',
                              fontSize: '0.8rem',
                              fontWeight: '600',
                              backgroundColor: student.isPresent ? '#d4edda' : '#f8d7da',
                              color: student.isPresent ? '#155724' : '#721c24'
                            }}
                          >
                            {student.isPresent ? 'Present' : 'Absent'}
                          </span>
                          {student.notes && (
                            <span style={{ color: '#6c757d', fontSize: '0.8rem' }}>
                              "{student.notes}"
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AttendanceHistory;
