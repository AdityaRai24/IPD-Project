"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronRight, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import axios from "axios";

const RoadmapPage = () => {
  const router = useRouter();
  const [roadmap, setRoadmap] = useState([]);
  const [expandedSections, setExpandedSections] = useState({});
  const [loading, setLoading] = useState(true);
  const [generatingFor, setGeneratingFor] = useState(null);
  const [error, setError] = useState(null);
  const [generatedContent, setGeneratedContent] = useState({});

  useEffect(() => {
    const loadRoadmap = () => {
      try {
        const savedRoadmap = localStorage.getItem("roadmap");
        if (savedRoadmap) {
          setRoadmap(JSON.parse(savedRoadmap));
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

  const generateDesc = async (description, levelId) => {
    if (generatingFor === levelId) return; // Prevent duplicate requests
    if (JSON.parse(localStorage.getItem(description))) {
      router.push(`/roadmap/content?topic=${description}`);
      return;
    }
    console.log(localStorage.getItem(description));

    try {
      setGeneratingFor(levelId);
      setError(null);

      const response = await axios.post(
        "http://localhost:3000/api/generate-description",
        { description },
        { timeout: 30000 }
      );

      localStorage.setItem(description, JSON.stringify(response.data));

      setGeneratedContent((prev) => ({
        ...prev,
        [levelId]: response.data,
      }));
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

  const toggleSection = (sectionKey) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const renderLevel = (level, description, index, sectionIndex) => {
    const levelId = `${sectionIndex}-${index}`;
    const isGenerating = generatingFor === levelId;
    return (
      <div className="space-y-2">
        <div
          className={`flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-100 ${
            isGenerating ? "opacity-70" : ""
          } `}
          onClick={() => !isGenerating && generateDesc(description, levelId)}
        >
          <span className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-full text-sm">
            {level}
          </span>
          <span className="text-gray-700 flex-grow">{description}</span>
          {isGenerating && (
            <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
          )}
        </div>
      </div>
    );
  };

  const renderSection = (section, name, index) => {
    const sectionKey = `${name}-${index}`;
    const isExpanded = expandedSections[sectionKey];

    return (
      <Card key={sectionKey} className="mb-4">
        <CardHeader
          className="cursor-pointer hover:bg-gray-50"
          onClick={() => toggleSection(sectionKey)}
        >
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold text-gray-800">
              {name}
            </CardTitle>
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-500" />
            )}
          </div>
        </CardHeader>

        {isExpanded && (
          <CardContent className="pl-4">
            {section.levels?.map((levelItem, levelIndex) => (
              <div key={levelIndex}>
                {renderLevel(
                  levelItem.level,
                  levelItem.description,
                  levelIndex,
                  index
                )}
              </div>
            ))}
          </CardContent>
        )}
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Learning Roadmap
      </h1>

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
