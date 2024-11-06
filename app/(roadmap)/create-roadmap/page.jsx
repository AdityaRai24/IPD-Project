"use client";
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function RoadmapPage() {
  const searchParams = useSearchParams();
  const [roadmap, setRoadmap] = useState(null);
  const [selectedSkills, setSelectedSkills] = useState(null);

  useEffect(() => {
    const roadmapParam = searchParams.get('roadmap');
    const selectedSkillsParam = searchParams.get('selectedSkills');
    
    if (roadmapParam) {
      setRoadmap(JSON.parse(roadmapParam));
    }
    if (selectedSkillsParam) {
      setSelectedSkills(JSON.parse(selectedSkillsParam));
    }
  }, [searchParams]);

  if (!roadmap || !selectedSkills) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Your Learning Roadmap</h1>
      <h2 className="text-2xl font-semibold mb-4">Selected Skills:</h2>
      <ul className="mb-6">
        {Object.entries(selectedSkills).map(([skill, level]) => (
          <li key={skill} className="mb-2">
            {skill}: Level {level}
          </li>
        ))}
      </ul>

      <h2 className="text-2xl font-semibold mb-4">Roadmap:</h2>
      {Object.entries(roadmap).map(([topic, subTopics]) => (
        <div key={topic} className="mb-4">
          <h3 className="text-xl font-medium mb-2">{topic}</h3>
          <ul className="list-disc pl-6">
            {subTopics.map((subTopic, index) => (
              <li key={index}>{subTopic}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}