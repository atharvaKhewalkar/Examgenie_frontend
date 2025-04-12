// src/components/settings/Settings.jsx
import React, { useState, useContext } from 'react';
import Sidebar from '../sidebar/sidebar';
import { AppContext } from '../../context/store';
import { userService } from '../../services/api';
import './Settings.css';

const Settings = () => {
  const { state, dispatch } = useContext(AppContext);
  const [formData, setFormData] = useState({
    name: state.user?.name || '',
    email: state.user?.email || '',
    department: state.user?.department || '',
    defaultDifficulty: state.user?.preferences?.defaultDifficulty || 'medium',
    defaultQuestionType: state.user?.preferences?.defaultQuestionType || 'multiple-choice',
    darkMode: state.user?.preferences?.darkMode || false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveMessage(null);
    
    try {
      setIsSaving(true);
      
      // In development, simulate API call success
      // In production, uncomment these lines to make the actual API calls
      // await userService.updateProfile({
      //   name: formData.name,
      //   department: formData.department
      // });
      // await userService.updatePreferences({
      //   defaultDifficulty: formData.defaultDifficulty,
      //   defaultQuestionType: formData.defaultQuestionType,
      //   darkMode: formData.darkMode
      // });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update context
      dispatch({
        type: 'UPDATE_USER_PREFERENCES',
        payload: {
          ...state.user,
          name: formData.name,
          department: formData.department,
          preferences: {
            defaultDifficulty: formData.defaultDifficulty,
            defaultQuestionType: formData.defaultQuestionType,
            darkMode: formData.darkMode,
          }
        }
      });
      
      setSaveMessage({ type: 'success', text: 'Settings saved successfully!' });
      
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <div className="settings-header">
          <h1>Settings</h1>
        </div>
        
        <div className="settings-container">
          <form onSubmit={handleSubmit}>
            <div className="settings-section">
              <h2>Profile Settings</h2>
              
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input 
                  type="text" 
                  id="name"
                  name="name" 
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email"
                  name="email" 
                  value={formData.email}
                  onChange={handleChange}
                  disabled
                />
                <small>Email cannot be changed</small>
              </div>
              
              <div className="form-group">
                <label htmlFor="department">Department</label>
                <input 
                  type="text" 
                  id="department"
                  name="department" 
                  value={formData.department}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="settings-section">
              <h2>Default Preferences</h2>
              
              <div className="form-group">
                <label htmlFor="defaultDifficulty">Default Difficulty</label>
                <select 
                  id="defaultDifficulty"
                  name="defaultDifficulty"
                  value={formData.defaultDifficulty}
                  onChange={handleChange}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="defaultQuestionType">Default Question Type</label>
                <select 
                  id="defaultQuestionType"
                  name="defaultQuestionType"
                  value={formData.defaultQuestionType}
                  onChange={handleChange}
                >
                  <option value="multiple-choice">Multiple Choice</option>
                  <option value="short-answer">Short Answer</option>
                  <option value="true-false">True/False</option>
                </select>
              </div>
              
              <div className="form-group checkbox-group">
                <label htmlFor="darkMode">
                  <input 
                    type="checkbox" 
                    id="darkMode"
                    name="darkMode"
                    checked={formData.darkMode}
                    onChange={handleChange}
                  />
                  Dark Mode (Coming Soon)
                </label>
              </div>
            </div>
            
            {saveMessage && (
              <div className={`save-message ${saveMessage.type}`}>
                {saveMessage.text}
              </div>
            )}
            
            <button 
              type="submit" 
              className="save-button"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;