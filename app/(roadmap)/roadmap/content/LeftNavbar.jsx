"use client";
import { StepForward, BookOpen, Lock, CheckCircle, Circle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { useRoadmapStore } from "@/store/useRoadmapStore";

const LeftNavbar = () => {
  const { roadmap, fetchRoadmap } = useRoadmapStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic");
  const currentSectionIdx = parseInt(searchParams.get("sectionIdx") || searchParams.get("section") || "0");
  const currentLevelId = parseInt(searchParams.get("levelId") || searchParams.get("level") || "1");
  const roadmapId = searchParams.get("roadmapId");

  useEffect(() => {
    if (roadmapId && (!roadmap || roadmap.length === 0)) {
      fetchRoadmap(roadmapId);
    }
  }, [roadmapId, fetchRoadmap, roadmap]);

  const isSectionUnlocked = (sectionIndex) => {
    if (sectionIndex === 0) return true;
    if (!roadmap || roadmap.length === 0) return false;

    const previousSection = roadmap[sectionIndex - 1];
    return previousSection?.levels.every((level) => level.completed) || false;
  };

  const isSectionCompleted = (sectionIndex) => {
    if (!roadmap || roadmap.length === 0) return false;
    const section = roadmap[sectionIndex];
    return section?.levels.every((level) => level.completed) || false;
  };

  const handleNavigation = (levelItem, sectionIndex, levelIndex) => {
    if (isSectionUnlocked(sectionIndex)) {
      const targetLevelId = levelItem.level || levelIndex + 1;
      let url = `/roadmap/content?topic=${encodeURIComponent(levelItem.description)}&sectionIdx=${sectionIndex}&levelId=${targetLevelId}`;
      if (roadmapId) {
        url += `&roadmapId=${roadmapId}`;
      }
      router.push(url);
    }
  };

  return (
    <div className="w-72 pt-20 bg-white shadow-lg fixed h-screen overflow-y-auto pb-16 border-r border-gray-100">
      <div className="p-4 bg-gradient-to-r from-pink-50 to-blue-50 border-b">
        <h1 className="text-xl font-bold text-gray-800">Learning Path</h1>
        <p className="text-sm text-gray-600">Track your progress through each unit</p>
      </div>
      
      <div className="space-y-2 p-2">
        {roadmap?.map((item, sectionIndex) => {
          const isUnlocked = isSectionUnlocked(sectionIndex);
          const isCompleted = isSectionCompleted(sectionIndex);
          
          return (
            <div
              key={sectionIndex}
              className={`bg-white rounded-lg p-4 transition-colors ${
                isUnlocked ? "hover:bg-gray-50" : "opacity-75"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-medium text-pink-600">
                    UNIT {sectionIndex + 1}
                  </p>
                  <h2 className="font-bold text-lg text-gray-900">{item.name}</h2>
                </div>
                {isCompleted && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
                {!isUnlocked && (
                  <Lock size={16} className="text-gray-400" />
                )}
              </div>
              
              <div className="space-y-2 ml-2">
                {item.levels.map((levelItem, levelIndex) => {
                  const isCurrentTopic = topic === levelItem.description;
                  const isLevelCompleted = levelItem.completed;
                  
                  return (
                    <div
                      key={levelIndex}
                      onClick={() => isUnlocked && handleNavigation(levelItem, sectionIndex, levelIndex)}
                      className={`flex items-center gap-2 p-2 rounded-md transition-all ${
                        !isUnlocked 
                          ? "cursor-not-allowed text-gray-400" 
                          : isCurrentTopic
                            ? "bg-blue-50 text-blue-700 cursor-pointer"
                            : "hover:bg-gray-100 cursor-pointer text-gray-600"
                      }`}
                    >
                      {!isUnlocked ? (
                        <Lock size={16} className="text-gray-400" />
                      ) : isLevelCompleted ? (
                        <CheckCircle size={16} className="text-green-500" />
                      ) : (
                        <Circle size={16} className={
                          isCurrentTopic
                            ? "text-blue-700"
                            : "text-gray-400"
                        } />
                      )}
                      <p className={`text-sm ${
                        !isUnlocked
                          ? "text-gray-400"
                          : isCurrentTopic
                            ? "font-medium text-blue-700"
                            : isLevelCompleted
                              ? "text-green-600"
                              : "text-gray-600"
                      }`}>
                        {levelItem.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LeftNavbar;