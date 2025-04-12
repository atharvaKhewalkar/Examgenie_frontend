// src/components/uploadqpr/uploadqpr.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from '../sidebar/sidebar';
import { questionService } from '../../services/api';
import './uploadqpr.css';

const UploadQuestionPaper = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [subjectName, setSubjectName] = useState('');
  const [subjectCode, setSubjectCode] = useState('');
  const [categorized, setCategorized] = useState(false);
  const [examType, setExamType] = useState('insem');
  const [uploadHistory, setUploadHistory] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch upload history when component mounts
  useEffect(() => {
    // For now, use mock data
    // In a real app, you would fetch from your API
    const mockHistory = [
      { id: 1, filename: 'Math_101_Spring.pdf', date: '2024-10-01' },
      { id: 2, filename: 'Chemistry_202_Spring.docx', date: '2024-09-25' },
      { id: 3, filename: 'History_202_Fall.txt', date: '2024-09-15' },
    ];
    setUploadHistory(mockHistory);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      if (allowedTypes.includes(file.type)) {
        setSelectedFile(file);
        setUploadStatus(null); 
      } else {
        setUploadStatus('Invalid file type. Please upload a PDF, Word, or TXT file.');
      }
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      setUploadStatus('Please select a file to upload.');
      return;
    }

    if (!subjectName) {
      setUploadStatus('Please enter a subject name.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('subjectName', subjectName);
    formData.append('subjectCode', subjectCode);
    formData.append('categorized', categorized ? 'Categorized' : 'Uncategorized');
    formData.append('examType', examType);

    try {
      setIsUploading(true);
      
      // In development, simulate API call success
      // In production, uncomment the next line to make the actual API call
      // const response = await questionService.uploadQuestionBank(formData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUploadStatus('File uploaded successfully!');
      
      // Update the upload history with the new file
      const newUpload = {
        id: Date.now(),
        filename: selectedFile.name,
        date: new Date().toISOString().split('T')[0]
      };
      setUploadHistory([newUpload, ...uploadHistory]);
      
      // Reset form
      setSelectedFile(null);
      
    } catch (error) {
      setUploadStatus(`Upload failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleToggleCategorized = () => {
    setCategorized(!categorized);
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="main-content">
        <div className="upload-container">
          <h1>Upload Question Bank</h1>

          {/* Subject Input Fields */}
          <div className="subject-inputs">
            <div className="input-group">
              <label htmlFor="subject-name">Subject Name</label>
              <input
                type="text"
                id="subject-name"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                placeholder="Enter Subject Name"
              />
            </div>

            <div className="input-group">
              <label htmlFor="subject-code">Subject Code (Optional)</label>
              <input
                type="text"
                id="subject-code"
                value={subjectCode}
                onChange={(e) => setSubjectCode(e.target.value)}
                placeholder="Enter Subject Code"
              />
            </div>
            <div className="input-group">
              <label htmlFor="exam-type">Examination Type</label>
              <select 
                id="exam-type" 
                value={examType} 
                onChange={(e) => setExamType(e.target.value)}
              >
                <option value="insem">Insem</option>
                <option value="endsem">Endsem</option>
                <option value="unittest">Unit Test</option>
                <option value="practicetest">Practice Test</option>
                <option value="prelims">Prelims</option>
              </select>
            </div>
          </div>

          {/* Categorized/Uncategorized Toggle */}
          <div className="toggle-container">
            <label className="toggle-label">Categorized</label>
            <label className="switch">
              <input type="checkbox" checked={categorized} onChange={handleToggleCategorized} />
              <span className="slider"></span>
            </label>
            <label className="toggle-label">Uncategorized</label>
          </div>
          
          {/* Upload Box */}
          <div className="upload-box">
            <label htmlFor="file-upload" className="upload-label">
              <span className="plus-icon">+</span>
              {selectedFile ? (
                <p>{selectedFile.name}</p>
              ) : (
                <p>Click to Upload</p>
              )}
            </label>
            <input
              type="file"
              id="file-upload"
              onChange={handleFileChange}
              className="upload-input"
              accept=".pdf, .docx, .txt"
            />
          </div>

          {uploadStatus && (
            <p className={`upload-status ${uploadStatus.includes('success') ? 'success' : ''}`}>
              {uploadStatus}
            </p>
          )}
          
          {selectedFile && (
            <button 
              className="upload-btn" 
              onClick={handleFileUpload}
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Upload File'}
            </button>
          )}

          {/* Displaying Upload History */}
          <div className="upload-history">
            <h2>Upload History</h2>
            <ul className="history-list">
              {uploadHistory.map((item) => (
                <li key={item.id} className="history-item">
                  <span className="history-filename">{item.filename}</span>
                  <span className="history-date">{item.date}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadQuestionPaper;