import React, { useState } from 'react';
import Sidebar from '../sidebar/sidebar';  // Assuming Sidebar component is correct
import './gen.css';  // Assuming you have a gen.css file for styling

const GeneratePaper = () => {
  const [formData, setFormData] = useState({
    questionType: 'multiple-choice',
    topic: 'math',
    numQuestions: 10,
    difficulty: 'medium',
    includeHints: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data submitted:', formData);
    // You can add API integration or further logic to generate the paper here
  };

  return (
    <div className="dashboard-container">
      <Sidebar /> {/* Sidebar component */}
      
      <div className="main-content">
        <div className='genhead'>
        <h1>Generate Question Paper</h1>
        </div>
        <div className="generate-paper-container">
          
          
          <form onSubmit={handleSubmit} className="generate-paper-form">
            {/* Question Type Selector */}
            <div className="form-group">
              <label htmlFor="question-type">Select Question Type:</label>
              <select 
                id="question-type" 
                name="questionType" 
                value={formData.questionType} 
                onChange={handleChange}
              >
                <option value="multiple-choice">Multiple Choice</option>
                <option value="short-answer">Short Answer</option>
                <option value="true-false">True/False</option>
              </select>
            </div>

            {/* Topic Selector */}
            <div className="form-group">
              <label htmlFor="topic">Select Topic:</label>
              <select 
                id="topic" 
                name="topic" 
                value={formData.topic} 
                onChange={handleChange}
              >
                <option value="math">Math</option>
                <option value="science">Science</option>
                <option value="history">History</option>
                <option value="literature">Literature</option>
              </select>
            </div>

            {/* Number of Questions */}
            <div className="form-group">
              <label htmlFor="num-questions">Number of Questions:</label>
              <input 
                type="number" 
                id="num-questions" 
                name="numQuestions" 
                value={formData.numQuestions} 
                min="1" 
                max="50" 
                onChange={handleChange}
              />
            </div>

            {/* Difficulty Level */}
            <div className="form-group">
              <label htmlFor="difficulty">Select Difficulty Level:</label>
              <select 
                id="difficulty" 
                name="difficulty" 
                value={formData.difficulty} 
                onChange={handleChange}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            {/* Include Hints */}
            <div className="form-group">
              <label>
                <input 
                  type="checkbox" 
                  name="includeHints" 
                  checked={formData.includeHints} 
                  onChange={handleChange}
                />
                Include Hints
              </label>
            </div>

            {/* Generate Paper Button */}
            <div className="form-group2">
              <button type="submit" className="generate-button">
                Generate Paper
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GeneratePaper;
