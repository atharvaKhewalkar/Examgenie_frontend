import React from 'react';
import { Link } from 'react-router-dom';
import './sidebar.css'; // Import the styles for the sidebar
import { FaHome, FaUpload, FaFileAlt, FaCog, FaUserCircle, FaHistory } from 'react-icons/fa'; // Importing icons

const Sidebar = () => {
  return (
    <div className="sidebar">
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <h2>Exam Genie</h2>
      </div>

      {/* Sidebar Links */}
      <ul className="sidebar-links">
        <li>
          <Link to="/home" className="sidebar-link">
            <FaHome className="sidebar-icon" /> Home
          </Link>
        </li>
        <li>
          <Link to="/uploadquestionpaper" className="sidebar-link">
            <FaUpload className="sidebar-icon" /> Upload Syllabus
          </Link>
        </li>
        <li>
          <Link to="/uploadsyllabus" className="sidebar-link">
            <FaUpload className="sidebar-icon" /> Upload Syllabus
          </Link>
        </li>
        <li>
          <Link to="/generatepaper" className="sidebar-link">
            <FaFileAlt className="sidebar-icon" /> Generate Paper
          </Link>
        </li>
        <li>
  <Link to="/viewArchives" className="sidebar-link">
    <FaHistory className="sidebar-icon" /> View Archives
  </Link>
</li>

        <li>
          <Link to="/settings" className="sidebar-link">
            <FaCog className="sidebar-icon" /> Settings
          </Link>
        </li>
      </ul>

      {/* Sidebar Footer (User Profile) */}
      <div className="sidebar-footer">
        <div className="user-profile">
          <FaUserCircle className="user-icon" />
          <Link to="/profile" className='link-no-underline'>
          <span className="user-name">Atharva Khewalkar</span>
          </Link>
          
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
