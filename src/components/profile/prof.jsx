import React, { useState } from 'react';
import Sidebar from '../sidebar/sidebar';  // Assuming you already have the Sidebar component
import './prof.css';  // Profile specific styling

const Profile = () => {
  // Initial profile data
  const [userInfo, setUserInfo] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    bio: 'This is a short bio about the user. This is a larger sample bio to fill the space and look better in the design.',
    subject: 'Mathematics',  // New field: Subject Specialization
    experience: '5 years',   // New field: Years of Experience
    qualification: 'M.Sc. in Physics', // New field: Qualification
    school: 'ABC High School',  // New field: School/Institution
    socialMedia: {
      linkedin: 'https://linkedin.com/in/johndoe',
      twitter: 'https://twitter.com/johndoe'
    },
    profilePicture: null  // New field: Profile Picture
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleSocialMediaChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevInfo) => ({
      ...prevInfo,
      socialMedia: {
        ...prevInfo.socialMedia,
        [name]: value,
      },
    }));
  };

  const handleEditClick = () => {
    setIsEditing(true);  // Enable editing mode
  };

  const handleSaveClick = () => {
    setIsEditing(false);  // Disable editing mode
    // Add logic here to save the changes to the backend if required
    alert('Profile updated!');
  };

  return (
    <div className="profile-container">
      <Sidebar /> {/* Sidebar for navigation */}
      <div className="main-content">
        <div className="profile-header">
          <h1>Profile</h1>
          <p>Manage your personal and professional information</p>
        </div>

        <div className="profile-info-container">
          <div className="profile-info">
            <div className="info-item">
              <strong>Full Name:</strong>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={userInfo.name}
                  onChange={handleChange}
                  className="profile-input"
                />
              ) : (
                <span>{userInfo.name}</span>
              )}
            </div>

            <div className="info-item">
              <strong>Email:</strong>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={userInfo.email}
                  onChange={handleChange}
                  className="profile-input"
                />
              ) : (
                <span>{userInfo.email}</span>
              )}
            </div>

            <div className="info-item">
              <strong>Phone Number:</strong>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={userInfo.phone}
                  onChange={handleChange}
                  className="profile-input"
                />
              ) : (
                <span>{userInfo.phone}</span>
              )}
            </div>

            <div className="info-item">
              <strong>Bio:</strong>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={userInfo.bio}
                  onChange={handleChange}
                  className="profile-input"
                />
              ) : (
                <span>{userInfo.bio}</span>
              )}
            </div>

            {/* New Fields */}
            <div className="info-item">
              <strong>Subject Specialization:</strong>
              {isEditing ? (
                <input
                  type="text"
                  name="subject"
                  value={userInfo.subject}
                  onChange={handleChange}
                  className="profile-input"
                />
              ) : (
                <span>{userInfo.subject}</span>
              )}
            </div>

            <div className="info-item">
              <strong>Years of Experience:</strong>
              {isEditing ? (
                <input
                  type="text"
                  name="experience"
                  value={userInfo.experience}
                  onChange={handleChange}
                  className="profile-input"
                />
              ) : (
                <span>{userInfo.experience}</span>
              )}
            </div>

            <div className="info-item">
              <strong>Qualification:</strong>
              {isEditing ? (
                <input
                  type="text"
                  name="qualification"
                  value={userInfo.qualification}
                  onChange={handleChange}
                  className="profile-input"
                />
              ) : (
                <span>{userInfo.qualification}</span>
              )}
            </div>

            <div className="info-item">
              <strong>School/Institution:</strong>
              {isEditing ? (
                <input
                  type="text"
                  name="school"
                  value={userInfo.school}
                  onChange={handleChange}
                  className="profile-input"
                />
              ) : (
                <span>{userInfo.school}</span>
              )}
            </div>

            <div className="info-item">
              <strong>LinkedIn:</strong>
              {isEditing ? (
                <input
                  type="url"
                  name="linkedin"
                  value={userInfo.socialMedia.linkedin}
                  onChange={handleSocialMediaChange}
                  className="profile-input"
                />
              ) : (
                <span>{userInfo.socialMedia.linkedin}</span>
              )}
            </div>

            <div className="info-item">
              <strong>Twitter:</strong>
              {isEditing ? (
                <input
                  type="url"
                  name="twitter"
                  value={userInfo.socialMedia.twitter}
                  onChange={handleSocialMediaChange}
                  className="profile-input"
                />
              ) : (
                <span>{userInfo.socialMedia.twitter}</span>
              )}
            </div>

            {/* Profile Picture */}
            <div className="info-item">
              <strong>Profile Picture:</strong>
              {isEditing ? (
                <input
                  type="file"
                  name="profilePicture"
                  onChange={(e) => {
                    setUserInfo((prevInfo) => ({
                      ...prevInfo,
                      profilePicture: URL.createObjectURL(e.target.files[0]),
                    }));
                  }}
                  className="profile-input"
                />
              ) : (
                <img
                  src={userInfo.profilePicture || 'https://via.placeholder.com/150'}
                  alt="Profile"
                  className="profile-image"
                />
              )}
            </div>

            {/* Edit / Save button */}
            <div className="profile-buttons">
              {isEditing ? (
                <button onClick={handleSaveClick} className="save-button">
                  Save Changes
                </button>
              ) : (
                <button onClick={handleEditClick} className="edit-button">
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
