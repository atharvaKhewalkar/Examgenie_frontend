// src/components/archives/viewarchives.jsx
import React, { useState, useEffect, useContext } from 'react';
import Sidebar from '../sidebar/sidebar';
import { AppContext } from '../../context/store';
import './viewarchives.css';

const ViewArchives = () => {
  const { state } = useContext(AppContext);
  const [papers, setPapers] = useState([]);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');

  useEffect(() => {
    // Fetch previously generated papers from localStorage
    const savedPapers = JSON.parse(localStorage.getItem('generatedPapers')) || [];
    setPapers(savedPapers);
  }, []);

  const handleDelete = (id) => {
    // Delete a paper from the list (both UI and localStorage)
    const updatedPapers = papers.filter(paper => paper.id !== id);
    setPapers(updatedPapers);
    localStorage.setItem('generatedPapers', JSON.stringify(updatedPapers));
    
    // If the deleted paper was selected, clear selection
    if (selectedPaper && selectedPaper.id === id) {
      setSelectedPaper(null);
    }
  };

  const handleViewPaper = (paper) => {
    setSelectedPaper(paper);
  };

  const filteredPapers = papers.filter(paper => {
    const subjectMatch = filterSubject === 'all' || paper.subjectName === filterSubject;
    const departmentMatch = filterDepartment === 'all' || paper.department === filterDepartment;
    return subjectMatch && departmentMatch;
  });

  // Get unique subjects and departments for filters
  const subjects = ['all', ...new Set(papers.map(paper => paper.subjectName))];
  const departments = ['all', ...new Set(papers.map(paper => paper.department))];

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="main-content">
        <div className="archives-container">
          <div className="archiveshead">
            <h1>View Archives</h1>
          </div>
          
          <div className="archives-filters">
            <div className="filter-group">
              <label htmlFor="subject-filter">Filter by Subject:</label>
              <select 
                id="subject-filter" 
                value={filterSubject} 
                onChange={(e) => setFilterSubject(e.target.value)}
              >
                {subjects.map(subject => (
                  <option key={subject} value={subject}>
                    {subject === 'all' ? 'All Subjects' : subject}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label htmlFor="department-filter">Filter by Department:</label>
              <select 
                id="department-filter" 
                value={filterDepartment} 
                onChange={(e) => setFilterDepartment(e.target.value)}
              >
                {departments.map(department => (
                  <option key={department} value={department}>
                    {department === 'all' ? 'All Departments' : department}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedPaper ? (
            <div className="paper-details">
              <div className="paper-details-header">
                <h2>{selectedPaper.title}</h2>
                <button 
                  className="back-btn"
                  onClick={() => setSelectedPaper(null)}
                >
                  Back to List
                </button>
              </div>
              
              <div className="paper-metadata">
                <p><strong>Subject:</strong> {selectedPaper.subjectName}</p>
                <p><strong>Department:</strong> {selectedPaper.department}</p>
                <p><strong>Topics:</strong> {selectedPaper.topics ? selectedPaper.topics.join(', ') : 'N/A'}</p>
                <p><strong>Questions:</strong> {selectedPaper.questionCount || 'N/A'}</p>
                <p><strong>Total Marks:</strong> {selectedPaper.totalMarks || 'N/A'}</p>
                <p><strong>Duration:</strong> {selectedPaper.duration ? `${selectedPaper.duration} minutes` : 'N/A'}</p>
                <p><strong>Generated on:</strong> {new Date(selectedPaper.timestamp).toLocaleDateString()}</p>
              </div>
              
              <div className="paper-actions">
                <button className="download-btn">Download PDF</button>
                <button 
                  className="delete-btn" 
                  onClick={() => handleDelete(selectedPaper.id)}
                >
                  Delete Paper
                </button>
              </div>
            </div>
          ) : (
            <div className="archives-list">
              {filteredPapers.length === 0 ? (
                <p className="no-papers">No papers found in the archive.</p>
              ) : (
                filteredPapers.map((paper) => (
                  <div className="paper-card" key={paper.id}>
                    <div className="paper-header">
                      <h3>{paper.title}</h3>
                      <button 
                        className="delete-btn" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(paper.id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                    <p><strong>Subject:</strong> {paper.subjectName}</p>
                    <p><strong>Department:</strong> {paper.department}</p>
                    <p><strong>Total Marks:</strong> {paper.totalMarks}</p>
                    <p><strong>Duration:</strong> {paper.duration} minutes</p>
                    <p><strong>Generated on:</strong> {new Date(paper.timestamp).toLocaleDateString()}</p>
                    <button 
                      className="view-btn"
                      onClick={() => handleViewPaper(paper)}
                    >
                      View Paper
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewArchives;