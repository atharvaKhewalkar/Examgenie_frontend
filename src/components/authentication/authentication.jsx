// src/components/authentication/authentication.jsx
import React, { useState, useContext } from 'react';
import Lottie from 'lottie-react'; 
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/store';
import ani1 from '../../animations/login.json';
import './authentication.css';

const AuthPage = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { dispatch } = useContext(AppContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user types
    if (errors[name]) {
      setErrors({...errors, [name]: ''});
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (isRegistering && !formData.name) {
      newErrors.name = 'Name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // For now, simulate successful login/registration
      // In a real app, you would call your API here
      
      // Mock user data
      const userData = {
        id: 1,
        name: formData.name || 'Atharva Khewalkar',
        email: formData.email,
        department: 'Information Technology',
        preferences: {
          defaultDifficulty: 'medium',
          defaultQuestionType: 'multiple-choice',
          darkMode: false
        }
      };
      
      // Store in context
      dispatch({ type: 'LOGIN_SUCCESS', payload: userData });
      
      // Mock token (in real app, this would come from your backend)
      localStorage.setItem('token', 'mock-jwt-token');
      
      // Navigate to dashboard
      navigate('/home');
    }
  };

  return (
    <div className="auth-container">
      <div className="animation-container">
        <Lottie animationData={ani1} loop={true} />
      </div>
      <div className={`form-container ${isRegistering ? 'register' : 'login'}`}>
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2 className="form-title">{isRegistering ? 'Create Account' : 'Sign in to Website'}</h2>

          {isRegistering && (
            <div>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className={`input-field ${errors.name ? 'error' : ''}`}
              />
              {errors.name && <p className="error-message">{errors.name}</p>}
            </div>
          )}

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className={`input-field ${errors.email ? 'error' : ''}`}
            />
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={`input-field ${errors.password ? 'error' : ''}`}
            />
            {errors.password && <p className="error-message">{errors.password}</p>}
          </div>

          <button type="submit" className="submit-button">
            {isRegistering ? 'Sign Up' : 'Sign In'}
          </button>

          <div className="switch-form">
            {isRegistering ? (
              <span onClick={() => setIsRegistering(false)} className="form-toggle">
                Already have an account? Sign in
              </span>
            ) : (
              <span onClick={() => setIsRegistering(true)} className="form-toggle">
                Don't have an account? Register
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;