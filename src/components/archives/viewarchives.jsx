import React, { useState, useEffect } from 'react';
import Sidebar from '../sidebar/sidebar';
import './viewarchives.css'; // Make sure to add necessary styles

const ViewArchives = () => {
  const [papers, setPapers] = useState([]);

  useEffect(() => {
    // Fetch previously generated papers from localStorage (or a database in production)
    const savedPapers = JSON.parse(localStorage.getItem('generatedPapers')) || [];
    setPapers(savedPapers);
  }, []);

  const handleDelete = (index) => {
    // Delete a paper from the list (both UI and localStorage)
    const updatedPapers = papers.filter((_, i) => i !== index);
    setPapers(updatedPapers);
    localStorage.setItem('generatedPapers', JSON.stringify(updatedPapers));
  };

  return (
    <div className="dashboard-container">
      <Sidebar /> {/* Sidebar */}

      <div className="main-content">
        <div className="archives-container">
            <div className="archiveshead">
            <h1>View Archives</h1>
            </div>
       

          <div className="archives-list">
            {papers.length === 0 ? (
              <p>No papers found in the archive.</p>
            ) : (
              papers.map((paper, index) => (
                <div className="paper-card" key={index}>
                  <div className="paper-header">
                    <h3>{paper.title}</h3>
                    <button 
                      className="delete-btn" 
                      onClick={() => handleDelete(index)}
                    >
                      Delete
                    </button>
                  </div>
                  <p>Topic: {paper.topic}</p>
                  <p>Type: {paper.type}</p>
                  <p>Generated on: {new Date(paper.timestamp).toLocaleDateString()}</p>
                  <button className="view-btn">View Paper</button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewArchives;
