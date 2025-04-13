// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthForm from './components/authentication/authentication';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
import Homepage from './pages/pagehome/homepage';
import GeneratePaper from './components/generateppr/gen';
import ViewArchives from './components/archives/viewarchives';
import UploadQuestionPaper from './components/uploadqpr/uploadqpr';
import Profile from './components/profile/prof';
import Settings from './components/settings/Settings';
import QuestionPaperEditor from './components/QuestionPaperEditor/QuestionPaperEditor'
// Import Settings component when created

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<AuthForm />} />
          <Route path="/home" element={
            <ProtectedRoute>
              <Homepage />
            </ProtectedRoute>
          } />a
          <Route path="/generatepaper" element={
            <ProtectedRoute>
              <GeneratePaper />
            </ProtectedRoute>
          } />
          <Route path="/viewArchives" element={
            <ProtectedRoute>
              <ViewArchives />
            </ProtectedRoute>
          } />
          <Route path="/uploadquestionpaper" element={
            <ProtectedRoute>
              <UploadQuestionPaper />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          <Route path="/edit-question-paper" element={
            <ProtectedRoute>
              <QuestionPaperEditor />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;