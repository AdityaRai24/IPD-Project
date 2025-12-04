"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  CheckCircle,
  Circle,
  Lock,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Code,
  Database,
  Shield,
  Server,
  Cloud,
  Layers,
  LayoutList,
  Network
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRoadmapStore } from "@/store/useRoadmapStore";
import RoadmapGraph from "@/components/roadmap/RoadmapGraph";
import { Button } from "@/components/ui/button";

const RoadmapDetailPage = ({ params }) => {
  const router = useRouter();
  const { roadmapId } = params;
  const { roadmap, fetchRoadmap, updateRoadmapProgress, isLoading, error } = useRoadmapStore();
  
  const [generatingFor, setGeneratingFor] = useState(null);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [activeUnit, setActiveUnit] = useState(0);
  const [expandedChapters, setExpandedChapters] = useState({});
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'graph'

  useEffect(() => {
    if (roadmapId) {
      fetchRoadmap(roadmapId);
    }
  }, [roadmapId, fetchRoadmap]);

  useEffect(() => {
    if (roadmap && roadmap.length > 0) {
      calculateCompletionPercentage(roadmap);
    }
  }, [roadmap]);

  const isSectionUnlocked = (sectionIndex) => {
    if (sectionIndex === 0) return true;
    const previousSection = roadmap[sectionIndex - 1];
    return previousSection?.levels.every((level) => level.completed) || false;
  };

  const isSectionCompleted = (sectionIndex) => {
    const section = roadmap[sectionIndex];
    return section?.levels.every((level) => level.completed) || false;
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

  const toggleCompletion = async (sectionIndex, levelIndex) => {
    if (!isSectionUnlocked(sectionIndex)) return;

    const updatedRoadmap = roadmap.map((section, secIdx) => ({
      ...section,
      levels: section.levels.map((level, lvlIdx) =>
        secIdx === sectionIndex && lvlIdx === levelIndex
          ? { ...level, completed: !level.completed }
          : level
      ),
    }));

    // Optimistic update handled by store
    await updateRoadmapProgress(updatedRoadmap);
  };

  const generateDesc = async (description, levelId, sectionIndex, level) => {
    if (generatingFor === levelId || !isSectionUnlocked(sectionIndex)) return;

    // Check if we already have content (optional optimization)
    // For now, we just navigate
    router.push(
      `/roadmap/content?topic=${description}&sectionIdx=${sectionIndex}&levelId=${level}&roadmapId=${roadmapId}`
    );
  };

  const toggleChapterExpansion = (sectionIndex, levelIndex) => {
    const chapterId = `${sectionIndex}-${levelIndex}`;
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

  const renderChapterDetails = (details) => {
    return (
      <div className="pl-12 pr-4 pb-4 pt-2 space-y-3 bg-gray-50/50">
        {details.map((detail, idx) => (
          <div key={idx} className="flex items-start gap-3 text-gray-600">
            <div className="w-1.5 h-1.5 rounded-full bg-primary/30 mt-2" />
            <span className="text-sm leading-relaxed">{detail}</span>
          </div>
        ))}
      </div>
    );
  };

  const getUnitIcon = (name) => {
    const icons = {
      "Node.js": <Code className="w-5 h-5" />,
      Database: <Database className="w-5 h-5" />,
      Security: <Shield className="w-5 h-5" />,
      "System Design": <Server className="w-5 h-5" />,
      "Cloud Services": <Cloud className="w-5 h-5" />,
    };
    return icons[name] || <BookOpen className="w-5 h-5" />;
  };

  const renderSidebar = () => {
    return (
      <div className="w-80 bg-gray-50 min-h-screen border-r border-gray-200 fixed left-0 top-0">
        <div className="p-8 mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Learning Path
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Track your progress through each unit
          </p>
          <div className="space-y-2">
            {roadmap.map((unit, index) => (
              <button
                key={index}
                onClick={() => setActiveUnit(index)}
                className={`w-full text-left p-4 rounded-xl flex items-center gap-3 transition-all ${
                  activeUnit === index
                    ? "bg-white shadow-lg border border-primary/10"
                    : "hover:bg-white/60 text-gray-700"
                }`}
              >
                <div
                  className={`p-2 rounded-lg ${
                    activeUnit === index
                      ? "bg-primary/10 text-primary"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {getUnitIcon(unit.name)}
                </div>
                <div className="flex-grow">
                  <div className="text-xs font-medium text-gray-500">
                    Unit {index + 1}
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    {unit.name}
                  </div>
                </div>
                {isSectionCompleted(index) && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderLevel = (level, description, details, index, sectionIndex) => {
    const levelId = `${sectionIndex}-${index}`;
    const isGenerating = generatingFor === levelId;
    const isCompleted = roadmap[sectionIndex]?.levels[index]?.completed;
    const isUnlocked = isSectionUnlocked(sectionIndex);
    const isExpanded = expandedChapters[levelId];

    return (
      <Card
        key={levelId}
        className={`overflow-hidden transition-all duration-200 ${
          isCompleted
            ? "bg-green-50/50 border-green-100"
            : isUnlocked
            ? "bg-white hover:shadow-md"
            : "bg-gray-50/50"
        }`}
      >
        <div className="p-4">
          <div className="flex items-center gap-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                isUnlocked && toggleCompletion(sectionIndex, index);
              }}
              className={`text-primary ${!isUnlocked && "cursor-not-allowed"}`}
              disabled={!isUnlocked}
            >
              {isCompleted ? (
                <CheckCircle className="w-6 h-6 text-green-500" />
              ) : (
                <Circle className="w-6 h-6 text-gray-300" />
              )}
            </button>

            <div className="flex-grow">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-500">
                  Chapter {index + 1}
                </span>
                <span className="text-base font-semibold text-gray-900">
                  {description}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isUnlocked && (
                <button
                  onClick={() =>
                    !isGenerating &&
                    generateDesc(description, levelId, sectionIndex, level)
                  }
                  className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2 font-medium shadow-sm"
                >
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <BookOpen className="w-4 h-4" />
                      <span>Start Learning</span>
                    </>
                  )}
                </button>
              )}

              <button
                onClick={() => toggleChapterExpansion(sectionIndex, index)}
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700"
              >
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {isExpanded && details && renderChapterDetails(details)}
      </Card>
    );
  };

  const renderActiveUnit = () => {
    const unit = roadmap[activeUnit];
    if (!unit) return null;

    return (
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                {getUnitIcon(unit.name)}
              </div>
              <h3 className="text-sm font-medium text-primary">
                UNIT {activeUnit + 1}
              </h3>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">{unit.name}</h2>
          </div>
          {!isSectionUnlocked(activeUnit) && (
            <div className="flex items-center gap-2 text-gray-600 bg-gray-100/80 px-5 py-3 rounded-xl">
              <Lock className="w-4 h-4" />
              <span className="text-sm font-medium">
                Complete previous unit to unlock
              </span>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {unit.levels?.map((levelItem, levelIndex) =>
            renderLevel(
              levelItem.level,
              levelItem.description,
              levelItem.details,
              levelIndex,
              activeUnit
            )
          )}
        </div>
      </div>
    );
  };

  const handleGraphNodeClick = (levelData, sectionIndex, levelIndex) => {
    const levelId = `${sectionIndex}-${levelIndex}`;
    generateDesc(levelData.description, levelId, sectionIndex, levelData.level);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!roadmap || roadmap.length === 0) {
    return null;
  }

  return (
    <div className="flex mt-20 min-h-screen bg-gray-50/30">
      {viewMode === 'list' && renderSidebar()}

      <div className={`${viewMode === 'list' ? 'ml-80' : 'w-full'} flex-grow transition-all duration-300`}>
        <div className="h-20 bg-white border-b border-gray-200 flex items-center px-8 sticky top-0 z-10 shadow-sm justify-between">
          <div className="flex items-center gap-6 flex-grow max-w-2xl">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary" />
              <span className="font-medium text-gray-700">
                Overall Progress
              </span>
            </div>
            <div className="flex-grow h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <div className="text-lg font-bold text-primary min-w-[60px]">
              {completionPercentage}%
            </div>
          </div>

          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
            <Button
              variant={viewMode === 'list' ? 'white' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className={`gap-2 ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
            >
              <LayoutList className="w-4 h-4" />
              List View
            </Button>
            <Button
              variant={viewMode === 'graph' ? 'white' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('graph')}
              className={`gap-2 ${viewMode === 'graph' ? 'bg-white shadow-sm' : ''}`}
            >
              <Network className="w-4 h-4" />
              Graph View
            </Button>
          </div>
        </div>

        {viewMode === 'list' ? (
          renderActiveUnit()
        ) : (
          <div className="p-8 h-[calc(100vh-80px)]">
            <RoadmapGraph roadmap={roadmap} onNodeClick={handleGraphNodeClick} />
          </div>
        )}
      </div>
    </div>
  );
};

export default RoadmapDetailPage;
