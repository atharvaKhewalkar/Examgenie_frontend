import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthForm from './components/authentication/authentication'; // Assuming AuthForm is the login page

import './App.css';
import Homepage from './pages/pagehome/homepage';
import GeneratePaper from './components/generateppr/gen';
import ViewArchives from './components/archives/viewarchives';
import UploadQuestionPaper from './components/uploadqpr/uploadqpr';
import Profile from './components/profile/prof';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
         
          <Route path="/" element={<AuthForm />} />
          <Route path="/home" element={<Homepage/>} />
          <Route path="/generatepaper" element={<GeneratePaper/>} />
          <Route path="/viewArchives" element={<ViewArchives/>} />
          <Route path="/uploadquestionpaper" element={<UploadQuestionPaper/>} />
          <Route path="/profile" element={<Profile/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
