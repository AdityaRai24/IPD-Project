// src/ProfileForm.js
import React, { useState } from "react";
import "./ProfileForm.css";

const ProfileForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    linkedin: "",
    experience: "",
    about: "",
    profilePicture: null,
    resume: null,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({
        ...formData,
        [name]: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const validateForm = () => {
    let formErrors = {};

    // Email validation
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if (!formData.email.match(emailPattern)) {
      formErrors.email = "Please enter a valid email address.";
    }

    // Phone validation (e.g., for a 10-digit phone number)
    const phonePattern = /^\d{10}$/;
    if (!formData.phone.match(phonePattern)) {
      formErrors.phone = "Please enter a valid 10-digit phone number.";
    }

    // Profile picture validation (optional)
    if (formData.profilePicture) {
      const fileSize = formData.profilePicture.size / 1024 / 1024; // in MB
      if (fileSize > 5) {
        formErrors.profilePicture = "Profile picture size should be less than 5MB.";
      }
    }

    // Resume validation (optional)
    if (formData.resume) {
      const fileSize = formData.resume.size / 1024 / 1024; // in MB
      if (fileSize > 10) {
        formErrors.resume = "Resume size should be less than 10MB.";
      }
    }

    setErrors(formErrors);

    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      alert("Form submitted successfully!");
      console.log(formData);
      // Process form submission (e.g., send data to an API)
    }
  };

  return (
    <div className="container">
      <h2>Profile Details</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <small className="error-message">{errors.email}</small>}
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          {errors.phone && <small className="error-message">{errors.phone}</small>}
        </div>

        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            placeholder="Enter your address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="linkedin">LinkedIn Profile</label>
          <input
            type="url"
            id="linkedin"
            name="linkedin"
            placeholder="Enter your LinkedIn profile URL"
            value={formData.linkedin}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="experience">Work Experience</label>
          <textarea
            id="experience"
            name="experience"
            placeholder="Describe your work experience"
            rows="5"
            value={formData.experience}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="about">About Me</label>
          <textarea
            id="about"
            name="about"
            placeholder="Tell us about yourself"
            rows="5"
            value={formData.about}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="profilePicture">Profile Picture</label>
          <input
            type="file"
            id="profilePicture"
            name="profilePicture"
            accept="image/*"
            onChange={handleChange}
          />
          {errors.profilePicture && <small className="error-message">{errors.profilePicture}</small>}
        </div>

        <div className="form-group">
          <label htmlFor="resume">Upload Resume</label>
          <input
            type="file"
            id="resume"
            name="resume"
            accept=".pdf,.doc,.docx"
            onChange={handleChange}
          />
          {errors.resume && <small className="error-message">{errors.resume}</small>}
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ProfileForm;
