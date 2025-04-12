// src/components/generateppr/gen.jsx
import React, { useState, useContext } from 'react';
import Sidebar from '../sidebar/sidebar';
import { questionService } from '../../services/api';
import { AppContext } from '../../context/store';
import './gen.css';

const GeneratePaper = () => {
  const { state, dispatch } = useContext(AppContext);
  const [formData, setFormData] = useState({
    questionType: state.user?.preferences?.defaultQuestionType || 'multiple-choice',
    topic: 'math',
    numQuestions: 10,
    difficulty: state.user?.preferences?.defaultDifficulty || 'medium',
    includeHints: false,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPaper, setGeneratedPaper] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      setIsGenerating(true);
      
      // In development, simulate API call success
      // In production, uncomment the next line to make the actual API call
      // const response = await questionService.generatePaper(formData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock response data
      const mockQuestions = Array(parseInt(formData.numQuestions)).fill().map((_, i) => ({
        id: i + 1,
        text: `Sample ${formData.topic} question ${i + 1} (${formData.difficulty} difficulty)`,
        options: formData.questionType === 'multiple-choice' ? [
          'Option A',
          'Option B',
          'Option C',
          'Option D'
        ] : null,
        answer: formData.questionType === 'multiple-choice' ? 'A' : 'Sample answer',
        hint: formData.includeHints ? `Hint for question ${i + 1}` : null,
        difficulty: formData.difficulty,
        marks: formData.difficulty === 'easy' ? 2 : formData.difficulty === 'medium' ? 3 : 5
      }));
      
      const mockPaper = {
        id: Date.now(),
        title: `${formData.topic.charAt(0).toUpperCase() + formData.topic.slice(1)} Paper`,
        topic: formData.topic,
        questionType: formData.questionType,
        difficulty: formData.difficulty,
        includeHints: formData.includeHints,
        questions: mockQuestions,
        totalMarks: mockQuestions.reduce((sum, q) => sum + q.marks, 0),
        createdAt: new Date().toISOString()
      };
      
      setGeneratedPaper(mockPaper);
      
      // Store in localStorage for archives
      const savedPapers = JSON.parse(localStorage.getItem('generatedPapers')) || [];
      const newPaperForArchive = {
        id: mockPaper.id,
        title: mockPaper.title,
        topic: mockPaper.topic,
        type: mockPaper.questionType,
        difficulty: mockPaper.difficulty,
        timestamp: Date.now(),
        totalMarks: mockPaper.totalMarks,
        questionCount: mockPaper.questions.length
      };
      localStorage.setItem('generatedPapers', JSON.stringify([newPaperForArchive, ...savedPapers]));
      
      // Add to global state
      dispatch({ type: 'ADD_PAPER', payload: mockPaper });
      
    } catch (error) {
      console.error('Error generating paper:', error);
      setError('Failed to generate paper. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      
      <div className="main-content">
        <div className='genhead'>
          <h1>Generate Question Paper</h1>
        </div>
        <div className="generate-paper-container">
          {!generatedPaper ? (
            <form onSubmit={handleSubmit} className="generate-paper-form">
              {/* Question Type Selector */}
              <div className="form-group">
                <label htmlFor="questionType">Select Question Type:</label>
                <select 
                  id="questionType" 
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
                <label htmlFor="numQuestions">Number of Questions:</label>
                <input 
                  type="number" 
                  id="numQuestions" 
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

              {error && <div className="error-message">{error}</div>}

              {/* Generate Paper Button */}
              <div className="form-group2">
                <button 
                  type="submit" 
                  className="generate-button"
                  disabled={isGenerating}
                >
                  {isGenerating ? 'Generating...' : 'Generate Paper'}
                </button>
              </div>
            </form>
          ) : (
            <div className="paper-preview">
              <h2>{generatedPaper.title}</h2>
              <div className="paper-metadata">
                <p><strong>Topic:</strong> {generatedPaper.topic}</p>
                <p><strong>Difficulty:</strong> {generatedPaper.difficulty}</p>
                <p><strong>Questions:</strong> {generatedPaper.questions.length}</p>
                <p><strong>Total Marks:</strong> {generatedPaper.totalMarks}</p>
              </div>
              
              <div className="questions-list">
                {generatedPaper.questions.map((question, index) => (
                  <div key={index} className="question-item">
                    <h3>Question {index + 1} ({question.marks} marks)</h3>
                    <p>{question.text}</p>
                    
                    {question.options && (
                      <div className="options">
                        {question.options.map((option, optIndex) => (
                          <div key={optIndex} className="option">
                            <span>{String.fromCharCode(65 + optIndex)}.</span> {option}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {generatedPaper.includeHints && question.hint && (
                      <div className="hint">
                        <p><strong>Hint:</strong> {question.hint}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="paper-actions">
                <button 
                  className="generate-button"
                  onClick={() => setGeneratedPaper(null)}
                >
                  Generate Another Paper
                </button>
                <button 
                  className="download-button"
                  onClick={() => alert('PDF download functionality will be implemented with backend integration')}
                >
                  Download PDF
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeneratePaper;