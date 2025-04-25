// src/components/authentication/authentication.jsx
import React, { useState, useContext } from 'react';
import Lottie from 'lottie-react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/store';
import ani1 from '../../animations/login.json';
import './authentication.css';

const AuthPage = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '',password2: '',department: '',
  institution: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { dispatch } = useContext(AppContext);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  // Validate form fields
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

    if (isRegistering) {
      if (!formData.password2) {
        newErrors.password2 = 'Please confirm your password';
      } else if (formData.password !== formData.password2) {
        newErrors.password2 = 'Passwords do not match';
      }
    
      if (!formData.name) {
        newErrors.name = 'Name is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) return;
  
    if (isRegistering) {
      // Registration API
      const response = await fetch("http://127.0.0.1:8000/api/auth/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          password: formData.password,
          password2: formData.password2,
          department: formData.department,
          institution: formData.institution
        })
      });
  
      const data = await response.json();
      console.log("Register response:", data);
  
      if (response.ok) {
        localStorage.setItem("token", data.access);
        dispatch({ type: 'LOGIN_SUCCESS', payload: data.user });
        navigate('/home');
      } else {
        alert(data.error || JSON.stringify(data));
      }
  
    } else {
      // Login API
      const response = await fetch("http://127.0.0.1:8000/api/auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });
  
      const data = await response.json();
      console.log("Login response:", data);
      console.log("Login status:", response.status);

  
      if (response.ok) {
        localStorage.setItem("token", data.access);
        dispatch({ type: 'LOGIN_SUCCESS', payload: data.user });
        navigate('/home');
      } else {
        alert(data.error || JSON.stringify(data));
      }
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
            <>
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
        
            <div>
              <input
                type="text"
                name="department"
                placeholder="Department"
                value={formData.department}
                onChange={handleChange}
                className="input-field"
              />
            </div>
        
            <div>
              <input
                type="text"
                name="institution"
                placeholder="Institution"
                value={formData.institution}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </>
            
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
          {isRegistering && (
  <div>
    <input
      type="password"
      name="password2"
      placeholder="Confirm Password"
      value={formData.password2}
      onChange={handleChange}
      className={`input-field ${errors.password2 ? 'error' : ''}`}
    />
    {errors.password2 && <p className="error-message">{errors.password2}</p>}
  </div>
)}

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
