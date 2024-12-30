import React, { useState } from 'react';
import Lottie from 'lottie-react'; 
import { useNavigate } from 'react-router-dom';
import ani1 from '../../animations/login.json';
import './authentication.css';

const AuthPage = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData); // Handle form submission here
    navigate('/home');
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
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="input-field"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="input-field"
          />

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
