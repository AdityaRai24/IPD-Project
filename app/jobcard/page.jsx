"use client"
import React, { useState } from 'react';
import JobCard from '@/components/JobCard/JobCard';

const JobCardPage = () => {
  const jobs = [
    {
      title: 'Frontend Developer',
      company: 'Tech Corp',
      location: 'New York, NY',
      description: 'We are looking for a skilled frontend developer...',
    },
    {
      title: 'Backend Developer',
      company: 'Web Solutions',
      location: 'San Francisco, CA',
      description: 'Join our team as a backend developer to work on cutting-edge technologies...',
    },
    {
      title: 'UX/UI Designer',
      company: 'Design Studio',
      location: 'Remote',
      description: 'We need a creative UX/UI designer to help improve user experiences...',
    },
    {
      title: 'Data Scientist',
      company: 'Analytics Hub',
      location: 'Austin, TX',
      description: 'Analyze and interpret complex data to help companies make decisions...',
    },
    {
      title: 'Project Manager',
      company: 'Enterprise Solutions',
      location: 'Boston, MA',
      description: 'Lead teams to deliver projects on time with high standards...',
    },
    {
      title: 'Software Engineer',
      company: 'Innovative Tech',
      location: 'Seattle, WA',
      description: 'Develop and maintain high-quality software applications...',
    },
    {
      title: 'Marketing Specialist',
      company: 'Growth Dynamics',
      location: 'Chicago, IL',
      description: 'Craft marketing strategies to enhance brand presence...',
    },
    {
      title: 'Product Manager',
      company: 'NextGen Software',
      location: 'Los Angeles, CA',
      description: 'Manage product lifecycle from conception to release...',
    },
  ];

  const [selectedJobIndex, setSelectedJobIndex] = useState(null);

  const handleCardClick = (index) => {
    setSelectedJobIndex(index);
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold text-rose-500 text-center mb-10">Job Openings</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job, index) => (
          <JobCard
            key={index}
            title={job.title}
            company={job.company}
            location={job.location}
            description={job.description}
            isSelected={selectedJobIndex === index}
            handleClick={() => handleCardClick(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default JobCardPage;
