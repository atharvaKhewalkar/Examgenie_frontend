import React, { useState } from 'react';
import Sidebar from '../sidebar/sidebar';
import { questionService } from '../../services/api'; // update if using a different service
import './UploadSyllabus.css'; // reuse the same CSS

const UploadSyllabus = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [subjectName, setSubjectName] = useState('');
  const [subjectCode, setSubjectCode] = useState('');
  const [year, setYear] = useState('');
  const [department, setDepartment] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadHistory, setUploadHistory] = useState([]);

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
    if (!selectedFile || !subjectName || !year || !department) {
      setUploadStatus('Please fill all required fields and select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('subjectName', subjectName);
    formData.append('subjectCode', subjectCode);
    formData.append('year', year);
    formData.append('department', department);

    try {
      setIsUploading(true);
      await questionService.uploadSyllabus(formData); 
      await new Promise((res) => setTimeout(res, 1000)); // Simulated delay
      setUploadStatus('File uploaded successfully!');

      const newUpload = {
        id: Date.now(),
        filename: selectedFile.name,
        date: new Date().toISOString().split('T')[0],
      };
      setUploadHistory([newUpload, ...uploadHistory]);

      setSelectedFile(null);
      setSubjectName('');
      setSubjectCode('');
      setYear('');
      setDepartment('');
    } catch (error) {
      setUploadStatus(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <div className="upload-container">
          <h1>Upload Syllabus</h1>

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
              <label htmlFor="year">Year</label>
              <input
                type="text"
                id="year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="e.g. 2024"
              />
            </div>

            <div className="input-group">
              <label htmlFor="department">Department</label>
              <select
                id="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                <option value="">Select Department</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Electrical">Electrical</option>
                <option value="Civil">Civil</option>
                <option value="Electronics">Electronics</option>
                <option value="Chemical">Chemical</option>
                <option value="Robotics">Robotics</option>
              </select>
            </div>
          </div>

          <div className="upload-box">
            <label htmlFor="file-upload" className="upload-label">
              <span className="plus-icon">+</span>
              {selectedFile ? <p>{selectedFile.name}</p> : <p>Click to Upload</p>}
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

export default UploadSyllabus;
