"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle, Circle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import axios from "axios";

const RoadmapPage = () => {
  const router = useRouter();
  const [roadmap, setRoadmap] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generatingFor, setGeneratingFor] = useState(null);
  const [error, setError] = useState(null);
  const [completionPercentage, setCompletionPercentage] = useState(0);

  useEffect(() => {
    const loadRoadmap = () => {
      try {
        const savedRoadmap = localStorage.getItem("roadmap");
        if (savedRoadmap) {
          const parsedRoadmap = JSON.parse(savedRoadmap);
    
          const initializedRoadmap = parsedRoadmap.map((section) => ({
            ...section,
            levels: section.levels.map((level) => ({
              ...level,
              completed: level.completed || false,
            })),
          }));
    
          setRoadmap(initializedRoadmap);
          calculateCompletionPercentage(initializedRoadmap);
        } else {
          router.push("/roadmap");
        }
      } catch (error) {
        setError("Failed to load roadmap data");
      } finally {
        setLoading(false);
      }
    };
    
    loadRoadmap();
  }, [router]);

  const saveRoadmapToLocalStorage = (updatedRoadmap) => {
    localStorage.setItem("roadmap", JSON.stringify(updatedRoadmap));
  };

  const calculateCompletionPercentage = (roadmapData) => {
    const totalLevels = roadmapData.reduce(
      (total, section) => total + section.levels.length,
      0
    );
    const completedLevels = roadmapData.reduce(
      (total, section) =>
        total + section.levels.filter((level) => level.completed).length,
      0
    );
    const percentage = totalLevels
      ? Math.round((completedLevels / totalLevels) * 100)
      : 0;
    setCompletionPercentage(percentage);
  };

  const toggleCompletion = (sectionIndex, levelIndex) => {
    const updatedRoadmap = roadmap.map((section, secIdx) => ({
      ...section,
      levels: section.levels.map((level, lvlIdx) =>
        secIdx === sectionIndex && lvlIdx === levelIndex
          ? { ...level, completed: !level.completed }
          : level
      ),
    }));
  
    setRoadmap(updatedRoadmap);
    saveRoadmapToLocalStorage(updatedRoadmap);
    calculateCompletionPercentage(updatedRoadmap);
  };
  

  const generateDesc = async (description, levelId) => {
    if (generatingFor === levelId) return; // Prevent duplicate requests
    if (JSON.parse(localStorage.getItem(description))) {
      router.push(`/roadmap/content?topic=${description}`);
      return;
    }

    try {
      setGeneratingFor(levelId);
      setError(null);


      router.push(`/roadmap/content?topic=${description}`);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to generate description. Please try again."
      );
    } finally {
      setGeneratingFor(null);
    }
  };


  const renderLevel = (level, description, index, sectionIndex) => {
    const levelId = `${sectionIndex}-${index}`;
    const isGenerating = generatingFor === levelId;
    const isCompleted = roadmap[sectionIndex].levels[index].completed;
  
    return (
      <div
        className={`p-4 rounded-lg shadow mb-2 ${
          isCompleted ? "bg-green-300" : "bg-white"
        }`}
        key={levelId}
      >
        <div
          className={`flex items-center gap-4 cursor-pointer`}
          onClick={() => !isGenerating && generateDesc(description, levelId)}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleCompletion(sectionIndex, index);
            }}
            className="text-primary"
          >
            {isCompleted ? (
              <CheckCircle className="w-5 h-5 text-green-700" />
            ) : (
              <Circle className="w-5 h-5 text-gray-400" />
            )}
          </button>
          <span className="font-semibold text-gray-700">
            {`Chapter ${index + 1}`}
          </span>
          <span className="text-gray-700 flex-grow">{description}</span>
          {isGenerating && (
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
          )}
        </div>
      </div>
    );
  };
  

  const renderSection = (section, name, index) => {
    return (
      <Card key={index} className="mb-6 p-4 shadow-sm shadow-primary bg-gray-100 rounded-lg">
        <h3 className="text-gray-700 font-medium">UNIT {index + 1}</h3>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{name}</h2>
        {section.levels?.map((levelItem, levelIndex) =>
          renderLevel(levelItem.level, levelItem.description, levelIndex, index)
        )}
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-lg text-gray-700 font-semibold text-start mb-4">
        Completion: {completionPercentage}%
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {roadmap.map((item, index) => renderSection(item, item.name, index))}
      </div>
    </div>
  );
};

export default RoadmapPage;
