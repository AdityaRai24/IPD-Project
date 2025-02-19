"use client";
import { StepForward, BookOpen, Lock } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const LeftNavbar = () => {
  const [roadmap, setRoadmap] = useState([]);
  const router = useRouter();
  const topic = useSearchParams().get("topic");

  useEffect(() => {
    const content = JSON.parse(localStorage.getItem("roadmap"));
    setRoadmap(content);
  }, []);

  const isSectionUnlocked = (sectionIndex) => {
    if (sectionIndex === 0) return true;

    const previousSection = roadmap[sectionIndex - 1];
    return previousSection?.levels.every((level) => level.completed) || false;
  };

  const isLevelAccessible = (sectionIndex, levelIndex) => {
    // First check if the section is unlocked
    if (!isSectionUnlocked(sectionIndex)) return false;
    
    // If it's the first level in a section, it's accessible
    if (levelIndex === 0) return true;
    
    // Otherwise, check if previous level is completed
    const section = roadmap[sectionIndex];
    return section.levels[levelIndex - 1].completed || false;
  };

  const handleNavigation = (levelItem, sectionIndex, levelIndex) => {
    if (isLevelAccessible(sectionIndex, levelIndex)) {
      router.push(
        `/roadmap/content?topic=${levelItem.description}&section=${sectionIndex}&level=${levelIndex+1}`
      );
    }
  };

  return (
    <div className="w-72 pt-20 bg-white shadow-lg fixed h-screen overflow-y-auto pb-16 border-r border-gray-100">
      <div className="p-4 bg-gradient-to-r from-pink-50 to-blue-50 border-b">
        <h1 className="text-xl font-bold text-gray-800">Learning Path</h1>
        <p className="text-sm text-gray-600">Track your progress through each unit</p>
      </div>
      
      <div className="space-y-2 p-2">
        {roadmap?.map((item, index) => (
          <div
            key={index}
            className={`bg-white rounded-lg p-4 transition-colors ${
              isSectionUnlocked(index) ? "hover:bg-gray-50" : "opacity-75"
            }`}
          >
            <div className="mb-2">
              <p className="text-sm font-medium text-pink-600">
                UNIT {index + 1}
              </p>
              <h2 className="font-bold text-lg text-gray-900">{item.name}</h2>
            </div>
            
            <div className="space-y-2 ml-2">
              {item.levels.map((levelItem, levelIndex) => {
                const isAccessible = isLevelAccessible(index, levelIndex);
                return (
                  <div
                    key={levelIndex}
                    onClick={() => handleNavigation(levelItem, index, levelIndex)}
                    className={`flex items-center gap-2 p-2 rounded-md transition-all ${
                      !isAccessible 
                        ? "cursor-not-allowed text-gray-400" 
                        : topic === levelItem.description
                          ? "bg-blue-50 text-blue-700 cursor-pointer"
                          : "hover:bg-gray-100 cursor-pointer text-gray-600"
                    }`}
                  >
                    {!isAccessible ? (
                      <Lock size={16} className="text-gray-400" />
                    ) : (
                      <StepForward size={16} className={
                        topic === levelItem.description
                          ? "text-blue-700"
                          : "text-gray-400"
                      } />
                    )}
                    <p className={`text-sm ${
                      !isAccessible
                        ? "text-gray-400"
                        : topic === levelItem.description
                          ? "font-medium text-blue-700"
                          : "text-gray-600"
                    }`}>
                      {levelItem.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeftNavbar;