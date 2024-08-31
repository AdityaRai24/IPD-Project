import React from 'react';

const JobCard = ({ title, company, location, description, isSelected, handleClick }) => {
  return (
    <div
      className={`bg-white border rounded-lg p-6 shadow-md transition-transform duration-200 cursor-pointer
      ${isSelected ? 'transform scale-105 border-rose-500 ring-4 ring-rose-400' : 'border-gray-200 hover:transform hover:scale-105'}`}
      onClick={handleClick}
    >
      <h3 className="text-xl font-semibold text-rose-500 mb-2">{title}</h3>
      <p className="text-lg text-gray-700 mb-1">{company}</p>
      <p className="text-md text-gray-500 mb-4">{location}</p>
      <p className="text-gray-600 mb-6">{description}</p>
      <button className="bg-rose-500 text-white py-2 px-4 rounded hover:bg-rose-600 transition-colors duration-200">
        Apply Now
      </button>
    </div>
  );
};

export default JobCard;
