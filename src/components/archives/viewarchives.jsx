// src/components/archives/viewarchives.jsx
import React, { useState, useEffect, useContext } from 'react';
import Sidebar from '../sidebar/sidebar';
import { AppContext } from '../../context/store';
import './viewarchives.css';

const ViewArchives = () => {
  const { state } = useContext(AppContext);
  const [papers, setPapers] = useState([]);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [filterTopic, setFilterTopic] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');

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
    const topicMatch = filterTopic === 'all' || paper.topic === filterTopic;
    const difficultyMatch = filterDifficulty === 'all' || paper.difficulty === filterDifficulty;
    return topicMatch && difficultyMatch;
  });

  // Get unique topics and difficulties for filters
  const topics = ['all', ...new Set(papers.map(paper => paper.topic))];
  const difficulties = ['all', ...new Set(papers.map(paper => paper.difficulty))];

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
              <label htmlFor="topic-filter">Filter by Topic:</label>
              <select 
                id="topic-filter" 
                value={filterTopic} 
                onChange={(e) => setFilterTopic(e.target.value)}
              >
                {topics.map(topic => (
                  <option key={topic} value={topic}>
                    {topic === 'all' ? 'All Topics' : topic.charAt(0).toUpperCase() + topic.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label htmlFor="difficulty-filter">Filter by Difficulty:</label>
              <select 
                id="difficulty-filter" 
                value={filterDifficulty} 
                onChange={(e) => setFilterDifficulty(e.target.value)}
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty === 'all' ? 'All Difficulties' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
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
                <p><strong>Topic:</strong> {selectedPaper.topic}</p>
                <p><strong>Type:</strong> {selectedPaper.type}</p>
                <p><strong>Difficulty:</strong> {selectedPaper.difficulty}</p>
                <p><strong>Questions:</strong> {selectedPaper.questionCount || 'N/A'}</p>
                <p><strong>Total Marks:</strong> {selectedPaper.totalMarks || 'N/A'}</p>
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
                    <p>Topic: {paper.topic}</p>
                    <p>Type: {paper.type}</p>
                    <p>Difficulty: {paper.difficulty}</p>
                    <p>Generated on: {new Date(paper.timestamp).toLocaleDateString()}</p>
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