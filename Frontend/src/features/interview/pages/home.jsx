import React, { useState } from 'react'
import "../style/home.scss"

const Home = () => {
  const [jobDescription, setJobDescription] = useState('')
  const [resumeFile, setResumeFile] = useState(null)
  const [selfDescription, setSelfDescription] = useState('')

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0])
  }

  const handleJobDescriptionChange = (e) => {
    setJobDescription(e.target.value)
  }

  const handleSelfDescriptionChange = (e) => {
    setSelfDescription(e.target.value)
  }

  const isFormValid = jobDescription.trim() || resumeFile || selfDescription.trim()

  return (
    <main className="home">
      {/* Header Section */}
      <div className="header">
        <h1 className="title">
          Create Your Custom <span className="highlight">Interview Plan</span>
        </h1>
        <p className="subtitle">
          Let our AI analyze the job requirements and your unique profile to build a winning strategy.
        </p>
      </div>

      {/* Main Content */}
      <div className="content-wrapper">
        {/* Left Section - Job Description */}
        <div className="section left-section">
          <div className="section-header">
            <span className="icon">📋</span>
            <h2>Target Job Description</h2>
            <span className="badge required">REQUIRED</span>
          </div>
          <textarea
            name="jobDescription"
            id="jobDescription"
            className="textarea"
            placeholder="Paste the full job description here...&#10;e.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'"
            value={jobDescription}
            onChange={handleJobDescriptionChange}
          />
          <div className="char-count">0 / 5000 chars</div>
        </div>

        {/* Right Section - Profile */}
        <div className="section right-section">
          {/* Resume Upload */}
          <div className="profile-section">
            <div className="section-header">
              <span className="icon">👤</span>
              <h2>Your Profile</h2>
            </div>

            <div className="resume-group">
              <div className="resume-label">
                <span>Upload Resume</span>
                <span className="badge best-results">BEST RESULTS</span>
              </div>
              <label htmlFor="resume" className="file-upload">
                <div className="upload-icon">☁️</div>
                <div className="upload-text">
                  <p>Click to upload or drag & drop</p>
                  <span className="file-info">PDF or DOCX (Max 5MB)</span>
                </div>
              </label>
              <input
                type="file"
                id="resume"
                name="resume"
                className="file-input"
                accept=".pdf,.docx,.doc"
                onChange={handleFileChange}
              />
              {resumeFile && <p className="file-name">✓ {resumeFile.name}</p>}
            </div>

            {/* Divider */}
            <div className="divider">OR</div>

            {/* Self Description */}
            <div className="description-group">
              <label htmlFor="selfDescription" className="label">
                Quick Self-Description
              </label>
              <textarea
                id="selfDescription"
                name="selfDescription"
                className="textarea"
                placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                value={selfDescription}
                onChange={handleSelfDescriptionChange}
              />
            </div>

            {/* Info Box */}
            <div className="info-box">
              <span className="info-icon">ℹ️</span>
              <p>
                Either a <strong>Resume</strong> or a <strong>Self Description</strong> is required to generate a personalized plan.
              </p>
            </div>

            {/* AI Note */}
            <div className="ai-note">
              <span className="ai-icon">⚡</span>
              AI-Powered Strategy Generation • Approx 30s
            </div>
          </div>
        </div>
      </div>

      {/* Button and Footer */}
      <div className="footer-section">
        <button
          className={`btn btn-primary ${!isFormValid ? 'disabled' : ''}`}
          disabled={!isFormValid}
        >
          ★ Generate My Interview Strategy
        </button>

        <div className="footer-links">
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
          <a href="#help">Help Center</a>
        </div>
      </div>
    </main>
  )
}

export default Home