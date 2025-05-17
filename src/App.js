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
import UploadSyllabus from './components/uploadsyllabus/UploadSyllabus';
// Import Settings component when created

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<AuthForm />} />
          <Route path="/home" element={
       
              <Homepage />
           
          } />a
          <Route path="/generatepaper" element={
            
              <GeneratePaper />
           
          } />
          <Route path="/viewArchives" element={
            
              <ViewArchives />
         
          } />
          <Route path="/uploadquestionpaper" element={
          
              <UploadQuestionPaper />
         
          } />
          <Route path="/profile" element={
           
              <Profile />
            
          } />
          <Route path="/settings" element={
           
              <Settings />
           
          } />
          <Route path="/uploadsyllabus" element={
          
              <UploadSyllabus />
          
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;