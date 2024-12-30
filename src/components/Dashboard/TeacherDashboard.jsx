import React, { useState } from 'react';
import Sidebar from '../sidebar/sidebar';  // Assuming Sidebar component exists
import { Line } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileUpload, faTasks, faChartLine, faClipboardList, faCog, faBell, faArrowRight, faCommentDots, faCalendar, faHistory } from '@fortawesome/free-solid-svg-icons';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'; // Import necessary chart elements
import './TeacherDashboard.css';  // Your styles

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TeacherDashboard = () => {
  // Example chart data for analytics (replace with real data)
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Papers Generated',
        data: [5, 10, 12, 8, 15], // Example data
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      }
    ]
  };

  // States for the collaborative review, scheduling, communication, and history sections
  const [activeTab, setActiveTab] = useState("review");

  return (
    <div className="teacher-dashboard">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="main-content">
        {/* Dashboard header */}
        <div className="dashboard-header">
          <h1>Teacher Dashboard</h1>
        </div>

        {/* Stats Section */}
        <div className="stats">

      
        <div className="dashboard-stats">
          <div className="stat-card">
            <FontAwesomeIcon icon={faClipboardList} size="2x" />
            <h2>Uploaded Questions</h2>
            <p>100 questions</p>
          </div>
          <div className="stat-card">
            <FontAwesomeIcon icon={faTasks} size="2x" />
            <h2>Generated Papers</h2>
            <p>5 papers</p>
          </div>
        </div>
        <div className="dashboard-stats">
          <div className="stat-card">
            <FontAwesomeIcon icon={faClipboardList} size="2x" />
            <h2>Department</h2>
            <p>Information Technology</p>
          </div>
          <div className="stat-card">
            <FontAwesomeIcon icon={faTasks} size="2x" />
            <h2>Number of Subjects</h2>
            <p>5</p>
          </div>
        </div>
        </div>

       
        

        

        {/* Collaborative Paper Review Section */}
        <div className="collaborative-review">
          <h3>Collaborative Paper Review</h3>
          
          {activeTab === "review" ? (
            <div className="review-section">
              
              <button className="action-button">Start Reviewing</button>
            </div>
          ) : (
            <div className="comments-section">
              <p>View comments from colleagues here.</p>
              <button className="action-button">View Comments</button>
            </div>
          )}
        </div>

        {/* Exam Paper Scheduling & Management Section */}
        <div className="exam-scheduling">
          <h3>Exam Paper Scheduling & Management</h3>
          <div className="calendar">
            <button className="action-button">Schedule Exam</button>
          </div>
        </div>

    

      
       


        {/* Analytics Chart Section */}
        <div className="chart-section">
          <h3>Analytics: Exam Paper Generation Trend</h3>
          <Line data={chartData} />
        </div>

        {/* Upcoming Tasks Section */}
        <div className="upcoming-tasks">
          <h3>Upcoming Tasks</h3>
          <ul>
            <li><FontAwesomeIcon icon={faTasks} /> Review upcoming exam paper</li>
            <li><FontAwesomeIcon icon={faClipboardList} /> Upload more questions for new subjects</li>
            <li><FontAwesomeIcon icon={faCog} /> Set difficulty level for next set of questions</li>
          </ul>
        </div>

        {/* Notifications Section */}
        <div className="notifications">
          <h3><FontAwesomeIcon icon={faBell} /> Notifications</h3>
          <div className="notification-item">
            <FontAwesomeIcon icon={faClipboardList} /> Your uploaded questions are under review
          </div>
          <div className="notification-item">
            <FontAwesomeIcon icon={faTasks} /> Your recent exam paper was generated successfully
          </div>
          <div className="notification-item">
            <FontAwesomeIcon icon={faCog} /> New updates available for the Teacher Portal
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="quick-links">
          <h3><FontAwesomeIcon icon={faCog} /> Quick Links</h3>
          <ul>
            <li><FontAwesomeIcon icon={faFileUpload} /> Upload New Questions</li>
            <li><FontAwesomeIcon icon={faClipboardList} /> Generate Paper</li>
            <li><FontAwesomeIcon icon={faTasks} /> Review Past Papers</li>
            <li><FontAwesomeIcon icon={faCog} /> Settings</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
